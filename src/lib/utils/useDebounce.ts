import { useState, useEffect } from 'react';

/**
 * A React hook that delays updating a value until a specified delay has passed.
 *
 * @template T - The type of the value being debounced
 * @param {T} value - The value to debounce
 * @param {number} delay - The delay in milliseconds (default: 200ms)
 * @returns {T} The debounced value
 *
 * ## When to use:
 *
 * 1. **Search Inputs**:
 *    - Prevent API calls on every keystroke
 *    - Wait until user stops typing before triggering search
 *
 * 2. **Form Validation**:
 *    - Delay validation until user finishes typing
 *    - Improve UX by reducing flickering error messages
 *
 * 3. **Resize/Scroll Events**:
 *    - Limit expensive calculations during window resize
 *    - Prevent performance issues with rapid scroll events
 *
 * 4. **API Rate Limiting**:
 *    - Prevent hitting rate limits with rapid user interactions
 *
 * ## Example usage:
 *
 * ```tsx
 * // In a search component
 * const SearchComponent = () => {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 *   useEffect(() => {
 *     // This effect only runs 500ms after the user stops typing
 *     if (debouncedSearchTerm) {
 *       searchAPI(debouncedSearchTerm);
 *     }
 *   }, [debouncedSearchTerm]);
 *
 *   return (
 *     <input
 *       type="text"
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="Search..."
 *     />
 *   );
 * };
 * ```
 */
export function useDebounce<T>(value: T, delay = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
