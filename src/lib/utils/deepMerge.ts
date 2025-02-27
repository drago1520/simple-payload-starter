// @ts-nocheck

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): boolean {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects, combining their properties recursively.
 * Unlike Object.assign() or the spread operator, this properly handles nested objects.
 * 
 * @template T - The type of the target object
 * @template R - The type of the source object
 * @param {T} target - The target object to merge into
 * @param {R} source - The source object to merge from
 * @returns {T} A new object with properties from both target and source
 * 
 * ## When to use:
 * 
 * 1. **Configuration Merging**:
 *    - When merging default configs with user-provided options
 *    - For theme customization where nested properties need to be preserved
 * 
 * 2. **State Management**:
 *    - When updating complex nested state objects
 *    - For immutable state updates in Redux or React context
 * 
 * 3. **API Response Handling**:
 *    - When combining multiple API responses into a single data structure
 *    - For caching strategies that need to merge fresh and cached data
 * 
 * 4. **Form Data**:
 *    - When merging form defaults with user input
 *    - For multi-step forms where data needs to be combined
 * 
 * ## Example usage:
 * 
 * ```typescript
 * const defaultOptions = {
 *   theme: {
 *     colors: {
 *       primary: 'blue',
 *       secondary: 'gray'
 *     },
 *     fonts: {
 *       heading: 'Arial'
 *     }
 *   }
 * };
 * 
 * const userOptions = {
 *   theme: {
 *     colors: {
 *       primary: 'red'
 *     }
 *   }
 * };
 * 
 * // Result keeps all nested properties while overriding specified ones
 * const mergedOptions = deepMerge(defaultOptions, userOptions);
 * // {
 * //   theme: {
 * //     colors: {
 * //       primary: 'red',
 * //       secondary: 'gray'
 * //     },
 * //     fonts: {
 * //       heading: 'Arial'
 * //     }
 * //   }
 * // }
 * ```
 */
export default function deepMerge<T, R>(target: T, source: R): T {
  const output = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = deepMerge(target[key], source[key])
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }

  return output
}
