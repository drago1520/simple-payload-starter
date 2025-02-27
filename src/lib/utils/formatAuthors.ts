import { Post } from '@/payload-types'

/**
 * Formats an array of populatedAuthors from Posts into a prettified string.
 * 
 * @param authors - The populatedAuthors array from a Post.
 * @returns A prettified string of authors.
 * 
 * ## When to use:
 * 
 * 1. **Blog Posts Display**:
 *    - When showing author bylines for blog posts
 *    - For article metadata display
 * 
 * 2. **Content Attribution**:
 *    - When crediting multiple contributors to content
 *    - For proper citation in academic or journalistic content
 * 
 * 3. **SEO Metadata**:
 *    - When generating author metadata for search engines
 *    - For structured data in article schema
 * 
 * ## Examples:
 * 
 * - [Author1, Author2] becomes 'Author1 and Author2'
 * - [Author1, Author2, Author3] becomes 'Author1, Author2, and Author3'
 * 
 * ## Example usage:
 * 
 * ```tsx
 * // In a blog post component
 * const BlogPostHeader = ({ post }) => {
 *   const authorString = formatAuthors(post.populatedAuthors);
 *   
 *   return (
 *     <header>
 *       <h1>{post.title}</h1>
 *       {authorString && (
 *         <p className="byline">By {authorString}</p>
 *       )}
 *       <time>{formatDateTime(post.publishedAt)}</time>
 *     </header>
 *   );
 * };
 * ```
 */
export const formatAuthors = (
  authors: NonNullable<NonNullable<Post['populatedAuthors']>[number]>[],
) => {
  // Ensure we don't have any authors without a name
  const filteredAuthors = authors.filter((author) => Boolean(author.name))

  if (filteredAuthors.length === 0) return ''
  if (filteredAuthors.length === 1) return filteredAuthors[0].name
  if (filteredAuthors.length === 2)
    return `${filteredAuthors[0].name} and ${filteredAuthors[1].name}`

  return `${filteredAuthors
    .slice(0, -1)
    .map((author) => author?.name)
    .join(', ')} and ${filteredAuthors[authors.length - 1].name}`
}
