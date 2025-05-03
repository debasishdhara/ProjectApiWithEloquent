import fs from 'fs';
import path from 'path';
import { createFile } from './work/fileUpdateAndCreate';

// Get the router name passed as an argument
const routerName = process.argv[2];

// Validate the router name
if (!routerName) {
  console.error('❌ Please provide a router name.');
  process.exit(1);
}

if ((routerName).toLocaleLowerCase() === 'default' || (routerName).toLocaleLowerCase() === 'pbase' || (routerName).toLocaleLowerCase() === 'mbase' || (routerName).toLocaleLowerCase() === 'sbase') {
  console.error('❌ Please provide a router name other than "default", "pbase", "mbase", or "sbase".');
  process.exit(1);
}

// Convert to SentenceCase
const toSentenceCase = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

// Define the base directory
const dirPath = path.resolve(__dirname, '..');

// Paths for file creation

// create model
const modelSourcePath = path.join(__dirname, 'baseStructure', 'models', 'base.ts');
const modelDestinationPath = path.join(dirPath, 'app', 'model', `${toSentenceCase(routerName)}.ts`);

// create controller
const controllerSourcePath = path.join(__dirname, 'baseStructure', 'controllers', 'BaseController.ts');
const controllerDestinationPath = path.join(dirPath, 'app', 'controller', `${routerName}Controller.ts`);

// create routes
const routeSourcePath = path.join(__dirname, 'baseStructure', 'routers', 'baseRouters.ts');
const routeDestinationPath = path.join(dirPath, 'routes', `${routerName}Routes.ts`);

// create services
const serviceSourcePath = path.join(__dirname, 'baseStructure', 'services', 'BaseService.ts');
const serviceDestinationPath = path.join(dirPath, 'app', 'service', `${routerName}Service.ts`);
// Utility to conditionally create files
async function createIfNotExists(sourcePath: string, destinationPath: string, label: string) {
  if (fs.existsSync(destinationPath)) {
    console.log(`⚠️  ${label} already exists at ${destinationPath}. Skipping creation.`);
  } else {
    const result = await createFile(sourcePath, destinationPath, routerName);
    if (result) {
      console.log(`✅ ${label} created at ${destinationPath}`);
    } else {
      console.error(`❌ Failed to create ${label}`);
    }
  }
}

// Run creations
(async () => {
  await createIfNotExists(modelSourcePath, modelDestinationPath, 'Model');
  await createIfNotExists(controllerSourcePath, controllerDestinationPath, 'Controller');
  await createIfNotExists(routeSourcePath, routeDestinationPath, 'Router');
  await createIfNotExists(serviceSourcePath, serviceDestinationPath, 'Service');
})();
