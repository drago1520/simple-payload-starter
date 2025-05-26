import React, { Fragment } from 'react';

import type { Page } from '@/payload-types';

import { ArchiveBlock } from '@/payload/blocks/ArchiveBlock/Component';
import { CallToActionBlock } from '@/payload/blocks/CallToAction/Component';
import { ContentBlock } from '@/payload/blocks/Content/Component';
import { MediaBlock } from '@/payload/blocks/MediaBlock/Component';
import { HighImpactHero } from './HighImpact/Component';
import { MediumImpactHero } from './MediumImpact/Component';
import { Block } from 'payload';
import { LowImpactHero } from './LowImpact/Component';

const blockComponents: Record<Block['slug'], React.ComponentType<any>> = {
  HighImpactHero,
  MediumImpactHero,
  LowImpactHero,
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  mediaBlock: MediaBlock,
};

export const RenderBlocks: React.FC<{
  blocks: Page['blocks'] | undefined;
}> = props => {
  const { blocks } = props;

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block;

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType];

            if (Block) {
              return (
                <Fragment key={index}>
                  <Block {...block} />
                </Fragment>
              );
            }
          }
          return null;
        })}
      </Fragment>
    );
  }

  return null;
};
