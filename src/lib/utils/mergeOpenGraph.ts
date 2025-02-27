import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'An open-source website built with Payload and Next.js.',
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: 'Payload Website Template',
  title: 'Payload Website Template',
}

/**
 * Merges custom OpenGraph metadata with default values.
 * Ensures that all pages have consistent OpenGraph metadata while allowing customization.
 * 
 * @param {Metadata['openGraph']} og - Custom OpenGraph metadata to merge with defaults
 * @returns {Metadata['openGraph']} Merged OpenGraph metadata
 * 
 * ## When to use:
 * 
 * 1. **Page Metadata**:
 *    - In page.tsx files when defining metadata for specific pages
 *    - For ensuring consistent OpenGraph defaults across the site
 * 
 * 2. **Dynamic Content**:
 *    - When generating metadata for dynamic routes
 *    - For blog posts, product pages, or other content with unique metadata
 * 
 * 3. **SEO Optimization**:
 *    - When implementing SEO best practices
 *    - For ensuring social media sharing shows appropriate previews
 * 
 * ## Example usage:
 * 
 * ```tsx
 * // In a page.tsx file
 * export const generateMetadata = async ({ params }): Promise<Metadata> => {
 *   const post = await getPost(params.slug);
 *   
 *   return {
 *     title: post.title,
 *     description: post.excerpt,
 *     openGraph: mergeOpenGraph({
 *       title: post.title,
 *       description: post.excerpt,
 *       images: post.featuredImage ? [{ url: post.featuredImage.url }] : undefined,
 *     }),
 *   };
 * };
 * ```
 */
export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
