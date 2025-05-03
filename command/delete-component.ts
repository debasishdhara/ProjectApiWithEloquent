import fs from 'fs';
import path from 'path';

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
const modelDestinationPath = path.join(dirPath, 'app', 'model', `${toSentenceCase(routerName)}.ts`);

// create services
const serviceDestinationPath = path.join(dirPath, 'app', 'service', `${toSentenceCase(routerName)}Service.ts`);

// create controller
const controllerDestinationPath = path.join(dirPath, 'app', 'controller', `${toSentenceCase(routerName)}Controller.ts`);

// create routes
const routeDestinationPath = path.join(dirPath, 'routes', `${routerName}Routes.ts`);

// Utility to conditionally create files
async function createIfNotExists(destinationPath: string, label: string) {
  if (fs.existsSync(destinationPath)) {
    fs.unlinkSync(destinationPath);
    console.log(`✅ Deleted existing ${label} at ${destinationPath}`);
  }
}

// Run creations
(async () => {
  await createIfNotExists(modelDestinationPath, 'Model');
  await createIfNotExists(serviceDestinationPath, 'Service');
  await createIfNotExists(controllerDestinationPath, 'Controller');
  await createIfNotExists(routeDestinationPath, 'Router');
})();
