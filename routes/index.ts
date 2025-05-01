import express, { Router, RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import pluralize from 'pluralize';

const allRoutes = express.Router();
const routesPath = __dirname;

const router = Router();

interface RouteDefinition {
  [method: string]: RouteMethodConfig;
}

interface RouteFileExports {
  [routePath: string]: RouteDefinition;
}

interface RouteMethodConfig {
  summary?: string;
  functions: RequestHandler[];
  tags?: string[];
  security?: any[];
  responses?: any;
  requestBody?: any;
}

const routeJson: Record<string, any> = {};
const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'] as const;
type HttpMethod = typeof httpMethods[number];

// Helper function to handle logging after all routes are loaded
const logRoutes = () => {
  console.log('routeJson:', routeJson); // Log after the route files are processed
};

fs.readdirSync(routesPath).forEach((file) => {
  if (file === 'index.ts' || file === 'index.js') return; // skip this file

  const filePath = path.join(routesPath, file);
  const stat = fs.statSync(filePath);

  if (stat.isFile() && file.endsWith('Routes.ts')) {
    import(filePath).then((routeDefs: RouteFileExports) => {
      const name = file.replace('Routes.ts', '');
      let baseRoutePath: string;

      if (['refreshtoken', 'default'].includes(name.toLowerCase())) {
        baseRoutePath = '/';
      } else {
        baseRoutePath = '/' + pluralize(name.toLowerCase());
      }
      console.log(`${name} route: ${baseRoutePath}`);
      
      // Process each route definition
      Object.entries(routeDefs).forEach(([routePath, methods]) => {
        let currentMethods: Record<string, any> = {};
        
        Object.entries(methods).forEach(([method, config]) => {
          const { functions, ...restConfig } = config;
          currentMethods[method] = restConfig;

          const lowerMethod = method.toLowerCase() as HttpMethod;

          if (
            Array.isArray(functions) &&
            httpMethods.includes(lowerMethod) &&
            functions.every(fn => typeof fn === 'function')
          ) {
            const methodFunc = (router as Record<string, any>)[lowerMethod] as (
              path: string,
              ...handlers: RequestHandler[]
            ) => Router;

            methodFunc(routePath, ...functions); // Register the handler functions
          }
        });

        // Clean up the 'functions' key from each method in currentMethods
        Object.keys(currentMethods).forEach((path) => {
          let pathConfig = currentMethods[path];
          Object.keys(pathConfig).forEach((method) => {
            let methodConfig = pathConfig[method];
            const { functions, ...restConfig } = methodConfig;
            pathConfig[method] = restConfig;
          });
        });

        routeJson[routePath] = currentMethods; // Add route to routeJson
      });

      allRoutes.use(baseRoutePath, router);

      // Log after processing all route files
      logRoutes();
    }).catch(err => {
      console.error(`Error loading route file ${filePath}:`, err);
    });
  }
});

export {
  allRoutes,
  routeJson,
  RouteDefinition,
  RouteFileExports,
  RouteMethodConfig
};
