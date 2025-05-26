/**
 * Utility to detect if code is running in a browser environment.
 *
 * @returns {boolean} True if running in a browser, false if running in a server environment
 *
 * ## When to use:
 *
 * 1. **Server Components vs Client Components**:
 *    - Use to conditionally execute browser-only code in components that might render on both server and client
 *    - Helps prevent "window is not defined" errors in Server Components
 *
 * 2. **Browser APIs**:
 *    - When accessing browser-only APIs like localStorage, sessionStorage, navigator
 *    - When using DOM manipulation utilities
 *
 * 3. **Conditional Imports**:
 *    - To conditionally import browser-only libraries
 *
 * 4. **Progressive Enhancement**:
 *    - To provide fallbacks when browser features aren't available
 *
 * ## Example usage:
 *
 * ```typescript
 * import canUseDOM from '@/lib/utils/canUseDOM';
 *
 * // Safe access to browser APIs
 * const getLocalStorageItem = (key: string): string | null => {
 *   if (canUseDOM) {
 *     return localStorage.getItem(key);
 *   }
 *   return null;
 * };
 *
 * // Conditional rendering
 * function Component() {
 *   const [windowWidth, setWindowWidth] = useState(canUseDOM ? window.innerWidth : 0);
 *
 *   // Rest of component...
 * }
 * ```
 *
 * Note: In Next.js, prefer using the "use client" directive for components that need browser APIs,
 * but this utility is still useful for conditional logic within those components.
 */
export default !!(typeof window !== 'undefined' && window.document && window.document.createElement);
