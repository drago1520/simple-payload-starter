/**
 * Converts a string to kebab-case format.
 * 
 * @param {string} string - The input string to convert
 * @returns {string} The kebab-cased string
 * 
 * ## When to use:
 * 
 * 1. **URL Slugs**:
 *    - For generating URL-friendly slugs from titles or names
 *    - Example: "Hello World" → "hello-world"
 * 
 * 2. **CSS Class Names**:
 *    - When generating CSS class names from camelCase or space-separated strings
 *    - Example: "buttonPrimary" → "button-primary"
 * 
 * 3. **File Names**:
 *    - For standardizing file naming conventions
 *    - Example: "UserProfile" → "user-profile"
 */
export const toKebabCase = (string: string): string =>
  string
    ?.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
