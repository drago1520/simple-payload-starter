/**
 * Utility functions for UI components automatically added by ShadCN and used in a few of our frontend components and blocks.
 *
 * Other functions may be exported from here in the future or by installing other shadcn components.
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names or conditional class expressions and
 * intelligently merges Tailwind CSS classes.
 * 
 * @param {...ClassValue[]} inputs - Class names, objects, or arrays of class values
 * @returns {string} Merged class string with Tailwind conflicts resolved
 * 
 * ## When to use:
 * 
 * 1. **Conditional Classes**:
 *    - When applying classes based on component props or state
 *    - For toggling classes based on conditions
 * 
 * 2. **Component Variants**:
 *    - When implementing component variant patterns
 *    - For combining base styles with variant-specific styles
 * 
 * 3. **Class Merging**:
 *    - When combining classes from multiple sources
 *    - For merging default styles with user-provided classes
 * 
 * 4. **Tailwind Conflicts**:
 *    - When dealing with potentially conflicting Tailwind classes
 *    - For ensuring the correct class takes precedence
 * 
 * ## Example usage:
 * 
 * ```tsx
 * // Basic usage
 * <div className={cn("base-class", isActive && "active-class")} />
 * 
 * // With variants
 * <Button 
 *   className={cn(
 *     "base-button-class",
 *     variant === "primary" ? "bg-blue-500" : "bg-gray-200",
 *     size === "large" ? "text-lg p-4" : "text-sm p-2",
 *     className // Merge with user-provided className
 *   )} 
 * />
 * 
 * // Resolving Tailwind conflicts
 * <div className={cn("p-4", userClasses)} /> // If userClasses contains p-6, it will override p-4
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
