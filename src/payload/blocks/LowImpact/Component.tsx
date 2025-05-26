import React from 'react';

import type { Page } from '@/payload-types';

import RichText from '@/components/RichText';

export const LowImpactHero = ({ children, richText }) => {
  return (
    <div className="container mt-16">
      <div className="max-w-3xl">{children || (richText && <RichText data={richText} enableGutter={false} />)}</div>
    </div>
  );
};
