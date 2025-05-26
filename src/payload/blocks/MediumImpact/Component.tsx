import React from 'react';

import { CMSLink } from '@/payload/fields/Link/index';
import { Media } from '@/components/Media';
import RichText from '@/components/RichText';
import { MediumImpactHeroBlock } from '@/payload-types';

export const MediumImpactHero = ({ links, media, richText }: MediumImpactHeroBlock) => {
  return (
    <div className="">
      <div className="container mb-8">
        {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex gap-4">
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="container">
        {media && typeof media === 'object' && (
          <div>
            <Media className="-mx-4 md:-mx-8 2xl:-mx-16" imgClassName="" priority resource={media} />
            {media?.caption && (
              <div className="mt-3">
                <RichText data={media.caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
