import fs from 'fs';
import path from 'path';
import pluralize from 'pluralize';
import readline from 'readline';
import { createFile } from './work/fileUpdateAndCreate';
import fsPromises from 'fs/promises'; // Note the use of `promises` to handle async filesystem operations

// Get the router name passed as an argument
const routerType: string = process.argv[2];
const routerPath: string = process.argv[3];
const routerName: string = process.argv[4];
let makeRouteType: string | undefined = process.argv[5];
console.log(routerType, routerPath, routerName, makeRouteType);
// Validate the router type
if (!routerType) {
  console.error('Please provide a router type. e.g. "POST", "GET", "PUT", "DELETE"');
  process.exit(1);
}

// Validate the router path
if (!routerPath) {
  console.error('Please provide a router path. e.g. "user" - for "/users" & "user:id" - for "/users/:id"');
  process.exit(1);
}

// Validate the router name
if (!routerName) {
  console.error('Please provide a router name.');
  process.exit(1);
}


if ((routerName).toLocaleLowerCase() === 'default' || (routerName).toLocaleLowerCase() === 'pbase' || (routerName).toLocaleLowerCase() === 'mbase' || (routerName).toLocaleLowerCase() === 'sbase') {
    console.error('❌ Please provide a router name other than "default", "pbase", "mbase", or "sbase".');
    process.exit(1);
}
  

if (routerName === 's') {
  makeRouteType = 's';
}

if (makeRouteType) {
  if (makeRouteType === 's') {
    // console.log('makeRouteType',makeRouteType);
  } else {
    console.error('Please provide valid syntax for generate singular or plural type route. e.g. "s" - for "user" & "" - for "users"');
    process.exit(1);
  }
}

// Convert to Sentence Case
const toSentenceCase = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

function createPathKey(routePath: string, typeDirect: string = ''): string {
  const segments = routePath.replace(/^\/+/, '').split('/');
  let base = '';

  if (typeDirect === 's') {
    base = segments[0];
  } else {
    base = pluralize.plural(segments[0]);
  }

  const extras = segments
    .slice(1)
    .map(seg => seg.startsWith(':') ? `:${seg.slice(1)}` : seg)
    .join('/');

  return extras ? `/${base}/${extras}` : `/${base}`;
}

function updateBraceDepth(line: string, currentDepth: number): number {
  const openCount = (line.match(/{/g) || []).length;
  const closeCount = (line.match(/}/g) || []).length;
  return currentDepth + openCount - closeCount;
}

function matchJsonKey(line: string, key: string): boolean {
  const regex = new RegExp(`["']${key}["']\\s*:\\s*{`);
  return regex.test(line);
}

async function updateAndFixLineInFile(filePath: string, lineNumber: number): Promise<boolean> {
  const fileContent = await fsPromises.readFile(filePath, 'utf8');
  const lines = fileContent.split('\n');

  const index = lineNumber - 1; // Convert to 0-based index

  if (lines[index]) {
    let originalLine = lines[index];

    // Remove comments temporarily for checking
    const commentIndex = originalLine.indexOf('//');
    let codePart = commentIndex !== -1 ? originalLine.slice(0, commentIndex).trimEnd() : originalLine.trimEnd();
    let commentPart = commentIndex !== -1 ? originalLine.slice(commentIndex) : '';

    if (codePart.endsWith('}') && !codePart.endsWith('},')) {
      codePart = codePart.replace(/}$/, '},'); // Replace last } with },
      console.log(`✅ Comma added at line ${lineNumber}`);
    } else {
      console.log(`ℹ️ No comma needed at line ${lineNumber}`);
    }

    lines[index] = codePart + (commentPart ? ' ' + commentPart : '');

    // Always insert a blank line after
    lines.splice(index + 1, 0, '');
  } else {
    console.log(`❌ Line number ${lineNumber} does not exist.`);
  }

  await fsPromises.writeFile(filePath, lines.join('\n'), 'utf8');
  console.log('✅ File updated successfully.');

  return true;
}

async function findRouteLineNumber(filePath: string, targetPath: string, targetMethod: string) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  let insideRoutesObject = false;
  let lineNumber = 0;
  let insideTargetPath = false;
  let insideTargetMethod = false;
  let insideTargetPathBraceCount = false;
  let targetPathMatchLine: number | null = null;
  let targetMethodMatchLine: number | null = null;
  let targetPathCloseBraceLineNumber: number = 0;
  let targetMethodCloseBraceLineNumber: number = 0;
  let lastTargetPathLineHasComma = false;
  let lastTargetMethodLineHasComma = false;
  let targetPathSimilarMatchLineNumberCheck = false;
  let targetPathSimilarMatchCloseBraceLineNumberCheck = false;
  let depth = 0;
  let targetPathSimilarMatchDepth = 0;
  let targetPathSimilarMatchLineNumber = 0;
  let targetPathSimilarMatchCloseBraceLineNumber = 0;
  let insideTargetMethodBraceCount = false;
  const pattern = /^const\s+\w+\s*=\s*{/;
  // multiple line comments check
  let multipleLineComment = false;
  for await (const line of rl) {
    lineNumber++;
    let trimmed = line.trim();
    if (trimmed.includes('//')) {
      trimmed = trimmed.split('//')[0];
    }
    //check if line has commments
    if (trimmed.startsWith('//')) {
      continue;
    }

    // check if line has multiple line comments
    if (trimmed.includes('/*')) {
      multipleLineComment = true;
    }

    if (multipleLineComment === false) {
      if (pattern.test(trimmed)) {
        targetPathSimilarMatchLineNumberCheck = true;
        targetPathSimilarMatchCloseBraceLineNumberCheck = true;
       
      }
      if(targetPathSimilarMatchLineNumberCheck === true && targetPathSimilarMatchCloseBraceLineNumberCheck === true){
        targetPathSimilarMatchDepth = updateBraceDepth(trimmed, targetPathSimilarMatchDepth);
        if(targetPathSimilarMatchDepth === 1 && trimmed.includes('}')){
          targetPathSimilarMatchLineNumber = lineNumber;
        }
        if(targetPathSimilarMatchDepth === 0){
          targetPathSimilarMatchCloseBraceLineNumberCheck = false;
        }
      }
      // console.log(trimmed);
      // match the line with target path
      // if (trimmed.startsWith(`${'"'+targetPath+'"'}:`) || trimmed.startsWith(`${"'"+targetPath+'"'}:`)) {
      if (matchJsonKey(trimmed, targetPath)) {
        insideTargetPath = true;
        insideTargetPathBraceCount = true;
        targetPathMatchLine = lineNumber;
      }

      if (insideTargetPath === true && insideTargetPathBraceCount === true) {
        depth = updateBraceDepth(trimmed, depth);
        // console.log(depth);
        if (depth === 0) {
          insideTargetPathBraceCount = false;
          targetPathCloseBraceLineNumber = lineNumber;
          if(trimmed.includes(',')) {
            lastTargetPathLineHasComma = true;
          }else {
            lastTargetPathLineHasComma = false;
          }
        }
        // console.log(trimmed);
        // console.log(targetMethod);
        // check method available in the route
        // if (trimmed.startsWith(`${'"'+targetMethod+'"'}:`) || trimmed.startsWith(`${"'"+targetMethod+'"'}:`) || trimmed.startsWith(`${'"'+(targetMethod).toLowerCase()+'"'}:`) || trimmed.startsWith(`${"'"+(targetMethod).toUpperCase()+'"'}:`) ) {
        if (trimmed !== '') {
          if (matchJsonKey(trimmed, targetMethod)) {
            insideTargetMethod = true;
            insideTargetMethodBraceCount = true;
            targetMethodMatchLine = lineNumber;
          } else {
            if (depth === 1) {
              targetMethodCloseBraceLineNumber = lineNumber;
              if(trimmed.includes(',')) {
                lastTargetMethodLineHasComma = true;
              }else {
                lastTargetMethodLineHasComma = false;
              }
            }
          }
        }
      }
    }
    if (trimmed.includes('*/')) {
      multipleLineComment = false;
    }
  }

  rl.close();
  return { insideRoutesObject, insideTargetPath, targetPathMatchLine, targetPathCloseBraceLineNumber, insideTargetMethod, insideTargetMethodBraceCount, targetMethodMatchLine, targetMethodCloseBraceLineNumber ,lastTargetPathLineHasComma
    ,lastTargetMethodLineHasComma,targetPathSimilarMatchLineNumber };
}

async function readGetWrapped(filePath: string, targetPath: string, targetMethod: string, onlyGet = false) {
  try {
    const data = await fsPromises.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    const getObject = { [targetMethod]: jsonData?.base?.[targetMethod] };
    if (onlyGet) {
      return getObject;
    }
    const targetObject = { [targetPath]: getObject };
    return targetObject;
  } catch (error) {
    console.error('Error:', error);
  }
}

(async () => {
  try {
    const dirPath = __dirname + '/../';
    let routedestinationPath = path.join(dirPath, 'routes', `${routerName}Routes.ts`);
    let finalRouteName = routerName;
    if (makeRouteType === 's') {
      routedestinationPath = path.join(dirPath, 'routes', `defaultRoutes.ts`);
      finalRouteName = 'default';
    }

    const targetPath = createPathKey(routerPath, makeRouteType);
    const targetMethod = routerType.toLowerCase();
    let jsonSourcePath = path.join(__dirname, 'baseStructure', 'routes', 'singleGetRouters.json');

    if (targetMethod === 'post') {
      jsonSourcePath = path.join(__dirname, 'baseStructure', 'routes', 'singlePostRouters.json');
    } else if (targetMethod === 'put') {
      jsonSourcePath = path.join(__dirname, 'baseStructure', 'routes', 'singlePutRouters.json');
    } else if (targetMethod === 'delete') {
      jsonSourcePath = path.join(__dirname, 'baseStructure', 'routes', 'singleDeleteRouters.json');
    }

    if (fs.existsSync(routedestinationPath)) {
      console.log('File exists. Finding line number...');
      const lineNumber = await findRouteLineNumber(routedestinationPath, targetPath, targetMethod);
      if (lineNumber.insideTargetPath && lineNumber.insideTargetMethod) {
        console.log(`❌ Target path and method already exists in the file.`);
      } else if (lineNumber.insideTargetPath && !lineNumber.insideTargetMethod) {
        const resultLine = await updateAndFixLineInFile(routedestinationPath, lineNumber.targetMethodCloseBraceLineNumber);

        if (resultLine === true) {
          const fullJson:any = await readGetWrapped(jsonSourcePath, targetPath, targetMethod, true);
          const formattedGetJson = JSON.stringify({ [targetMethod]: fullJson[targetMethod] }, null, 2)
            .split('\n')
            .slice(1, -1)
            .map(line => '  ' + line);

          let targetContent = (await fs.promises.readFile(routedestinationPath, 'utf8')).split('\n');
          targetContent.splice(lineNumber.targetMethodCloseBraceLineNumber, 0, ...formattedGetJson);
          await fs.promises.writeFile(routedestinationPath, targetContent.join('\n'), 'utf8');
        }
      }
    }else{
        console.log(`❌ File not found: ${routedestinationPath}`);
        const routesourcePath = path.join(__dirname, 'baseStructure', 'routes', 'basicRoutes.ts');
        // Step 4: Read the target file
        
        const resultOfRoute = await createFile(routesourcePath, routedestinationPath, finalRouteName);
        console.log(`✅ File created: ${routedestinationPath}`);
        // check if file exists
        if (resultOfRoute) {
        // Step 1: Read the JSON file
        const fullJson:any = await readGetWrapped(jsonSourcePath,targetPath, (targetMethod).toLowerCase());   
        // Step 2: Format the extracted "get" object
        const formattedGetJson = JSON.stringify({ [targetPath]: fullJson[targetPath] }, null, 2)
        .split('\n')
        .slice(1, -1) // REMOVE first '{' and last '}'
        .map(line => '  ' + line); // optional indent
        let targetContent = (await fs.promises.readFile(routedestinationPath, 'utf8')).split('\n');
        targetContent.splice(2, 0, ...formattedGetJson); // Insert after line 2
        await fs.promises.writeFile(routedestinationPath, targetContent.join('\n'), 'utf8');
        // file exists so find the line number of path like "/logins" user input login then added json in under that json
        }
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();
