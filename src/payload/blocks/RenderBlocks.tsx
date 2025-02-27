import { cn } from '@/lib/utils/ui'
import React, { Fragment } from 'react'

import type { Page } from '@/payload/payload-types'

import { HighImpactHero } from '@/payload/heros/HighImpact'
import { LowImpactHero } from '@/payload/heros/LowImpact'
import { MediumImpactHero } from '@/payload/heros/MediumImpact'

import { ArchiveBlock } from '@/payload/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/payload/blocks/CallToAction/Component'
import { ContentBlock } from '@/payload/blocks/Content/Component'
import { FormBlock } from '@/payload/blocks/Form/Component'
import { MediaBlock } from '@/payload/blocks/MediaBlock/Component'

const blockComponents = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
