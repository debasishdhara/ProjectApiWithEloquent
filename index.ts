import swaggerUi from 'swagger-ui-express';
import express from 'express';
import 'module-alias/register';
import {con} from './app/config/db.connect';

const app = express();

// Middleware
app.use(express.json());
const port = 3000;

async function init() {
  try {
    const connection = await con;  // Wait for the promise to resolve
    console.log('Connection established:');
  } catch (err) {
    console.error('Error establishing connection:', err);
  }
}

init();

app.get('/', (_req, res) => {
  res.send('Hello from TypeScript + Express!');
});

import { loadRoutes, allRoutes } from './routes';

import { createSwaggerSpec } from './system/swagger';
// Load all routes asynchronously
loadRoutes().then(() => {
    // Now that all routes are loaded, start the server
    // console.log('All routes loaded.',);
    // Iterate over the stack of middleware (which includes the routes)
    allRoutes.stack.forEach((middleware: any) => {
        // Check if this is a route handler and not a middleware
        if (middleware.route) {
        // Extract method and path for each route
        const methods = Object.keys(middleware.route.methods).map(method => method.toUpperCase());
        const path = middleware.route.path;
        console.log(`Route: ${methods.join(', ')} ${path}`);
        }
    });
    app.use('/api', allRoutes); // Use the dynamically loaded routes under '/api'
  
    (async () => {
        const swaggerSpec = await createSwaggerSpec();
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    })();
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
  
}).catch(err => {
console.error('Error loading routes:', err);
});
