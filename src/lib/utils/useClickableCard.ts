'use client'
import type { RefObject } from 'react'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

type UseClickableCardType<T extends HTMLElement> = {
  card: {
    ref: RefObject<T | null>
  }
  link: {
    ref: RefObject<HTMLAnchorElement | null>
  }
}

interface Props {
  external?: boolean
  newTab?: boolean
  scroll?: boolean
}

/**
 * A React hook that makes an entire card/container element clickable while preserving
 * the accessibility and functionality of nested interactive elements.
 * 
 * @template T - The HTML element type for the card container
 * @param {Props} options - Configuration options
 * @param {boolean} options.external - Whether the link points to an external site (default: false)
 * @param {boolean} options.newTab - Whether to open the link in a new tab (default: false)
 * @param {boolean} options.scroll - Whether to scroll to top on navigation (default: true)
 * @returns {UseClickableCardType<T>} Refs to attach to the card container and link element
 * 
 * ## When to use:
 * 
 * 1. **Card Components**:
 *    - For making entire card components clickable
 *    - When building grid layouts with clickable items
 * 
 * 2. **List Items**:
 *    - For making list items fully clickable
 *    - In navigation menus or content lists
 * 
 * 3. **Accessibility Enhancement**:
 *    - To improve UX while maintaining accessibility
 *    - When you need clickable areas larger than just the link text
 * 
 * 4. **Complex Clickable Areas**:
 *    - When a container has multiple interactive elements
 *    - For preserving functionality of nested buttons/links
 * 
 * ## Example usage:
 * 
 * ```tsx
 * const Card = ({ title, description, href }) => {
 *   const { card, link } = useClickableCard<HTMLDivElement>({
 *     external: href.startsWith('http'),
 *     newTab: true
 *   });
 * 
 *   return (
 *     <div 
 *       ref={card.ref} 
 *       className="p-4 border rounded hover:shadow-lg cursor-pointer"
 *     >
 *       <h3>{title}</h3>
 *       <p>{description}</p>
 *       <a ref={link.ref} href={href} className="sr-only">
 *         Read more about {title}
 *       </a>
 *       <button onClick={(e) => e.stopPropagation()}>Like</button>
 *     </div>
 *   );
 * };
 * ```
 */
function useClickableCard<T extends HTMLElement>({
  external = false,
  newTab = false,
  scroll = true,
}: Props): UseClickableCardType<T> {
  const router = useRouter()
  const card = useRef<T>(null)
  const link = useRef<HTMLAnchorElement>(null)
  const timeDown = useRef<number>(0)
  const hasActiveParent = useRef<boolean>(false)
  const pressedButton = useRef<number>(0)

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.target) {
        const target = e.target as Element

        const timeNow = +new Date()
        const parent = target?.closest('a')

        pressedButton.current = e.button

        if (!parent) {
          hasActiveParent.current = false
          timeDown.current = timeNow
        } else {
          hasActiveParent.current = true
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, card, link, timeDown],
  )

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (link.current?.href) {
        const timeNow = +new Date()
        const difference = timeNow - timeDown.current

        if (link.current?.href && difference <= 250) {
          if (!hasActiveParent.current && pressedButton.current === 0 && !e.ctrlKey) {
            if (external) {
              const target = newTab ? '_blank' : '_self'
              window.open(link.current.href, target)
            } else {
              router.push(link.current.href, { scroll })
            }
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, card, link, timeDown],
  )

  useEffect(() => {
    const cardNode = card.current

    if (cardNode) {
      cardNode.addEventListener('mousedown', handleMouseDown)
      cardNode.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      if (cardNode) {
        if (cardNode) {
          cardNode?.removeEventListener('mousedown', handleMouseDown)
          cardNode?.removeEventListener('mouseup', handleMouseUp)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, link, router])

  return {
    card: {
      ref: card,
    },
    link: {
      ref: link,
    },
  }
}

export default useClickableCard
