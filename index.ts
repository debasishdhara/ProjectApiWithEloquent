import swaggerUi from 'swagger-ui-express';
import express from 'express';
import 'module-alias/register';
import {con} from './app/config/db.connect';

const app = express();
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

const { allRoutes } = require('@routes');
app.use('/api', allRoutes);

import { createSwaggerSpec } from './system/swagger';
(async () => {
  const swaggerSpec = await createSwaggerSpec();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
})();
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
