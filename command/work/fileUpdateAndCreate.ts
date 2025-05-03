import { promises as fs } from 'fs';
import pluralize from 'pluralize';

/**
 * Convert a string to SentenceCase
 */
const toSentenceCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Reads a template file, replaces placeholders based on routerName, and writes the result to a destination path.
 * @param sourcePath - Path to the source template file
 * @param destinationPath - Path where the processed file will be written
 * @param routerName - Base name used for replacements
 * @returns A Promise resolving to true if successful, false otherwise
 */
export async function createFile(
  sourcePath: string,
  destinationPath: string,
  routerName: string
): Promise<boolean> {
  try {
    let data = await fs.readFile(sourcePath, 'utf8');

    if (data.includes('Pbase')) {
      data = data.replace(/Pbase/g, pluralize.plural(routerName));
    }

    if (data.includes('MBase')) {
      data = data.replace(/MBase/g, toSentenceCase(routerName));
    }

    if (data.includes('SBase')) {
      data = data.replace(/SBase/g, (routerName).toLowerCase());
    }

    await fs.writeFile(destinationPath, data, 'utf8');
    return true;
  } catch (err) {
    console.error('Error in createFile:', err);
    return false;
  }
}
