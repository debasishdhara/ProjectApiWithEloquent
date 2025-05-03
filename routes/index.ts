import express, { Router, RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import pluralize from 'pluralize';

const allRoutes = express.Router();
const routesPath = __dirname;


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

const router = Router();

// Load routes function which we will call from the main index.ts
export const loadRoutes = async () => {
    const routeFiles = fs.readdirSync(routesPath).filter((file) => file.endsWith('Routes.ts') && file !== 'index.ts' && file !== 'index.js');

    // Wait for all route files to be imported and processed
    await Promise.all(
        routeFiles.map(async (file) => {
            const filePath = path.join(routesPath, file);
            try {
                const routeDefs: RouteFileExports = await import(filePath);
                const name = file.replace('Routes.ts', '');
                let baseRoutePath: string;
                let defaultRoute: string = '';
                // Determine base route path (pluralize if needed)
                if (['refreshtoken', 'default'].includes(name.toLowerCase())) {
                    baseRoutePath = '/';
                    defaultRoute = '/';
                } else {
                    baseRoutePath = '/'; //  + pluralize(name.toLowerCase())
                    defaultRoute = baseRoutePath;
                }
                // Process each route definition
                Object.entries(routeDefs).forEach(([routePath, methods]) => {
                    Object.entries(methods).forEach(([pathDetails, config]) => {
                        let currentMethods: Record<string, any> = {};
                        let usePath = baseRoutePath;
                        Object.entries(config).forEach(([method, config]) => {
                            const { functions, ...restConfig } = config;
                            let functionsExists = false;
                            // console.log("method",method);
                            // console.log("restConfig",restConfig);
                            if (functions && functions.length > 0) {
                                functionsExists = true;
                                currentMethods[method] = restConfig;
                            }
                            const lowerMethod = method.toLowerCase() as HttpMethod;
                            const fullPath = pathDetails === baseRoutePath ? pathDetails : defaultRoute + pathDetails;
                            usePath = pathDetails; // pathDetails === baseRoutePath ? '/' : 
                            if (
                                functionsExists == true &&
                                Array.isArray(functions) &&
                                httpMethods.includes(lowerMethod) &&
                                functions.every(fn => typeof fn === 'function')
                                
                            ) {
                                // console.log(`[REGISTERED] ${lowerMethod.toUpperCase()} ${fullPath}`);
                                router[lowerMethod](usePath, ...functions);
                            }
                        });
                        // console.log("currentMethods",currentMethods);
                        routeJson[usePath] = currentMethods;
                    }); // Add route to routeJson
                    allRoutes.use(baseRoutePath, router);
                });
                // console.log(`[REGISTERED] Routes`, JSON.stringify(routeJson, null, 2));

            } catch (err) {
                console.error(`Error loading route file ${filePath}:`, err);
            }
        })
    );

    // Log routes after all files have been processed
    // console.log('Routes loaded:', routeJson);
};

export {
    allRoutes,
    routeJson
};
