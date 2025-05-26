import { getCachedGlobal } from '@/lib/utils/getGlobals';
import Link from 'next/link';
import React from 'react';

import type { Footer } from '@/payload-types';

import { ThemeSelector } from '@/components/ThemeProvider/Theme/ThemeSelector';
import { CMSLink } from '@/payload/fields/Link/index';
import { Logo } from '@/components/Logo/Logo';

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as Footer;

  const navItems = footerData?.navItems || [];

  return (
    <footer className="border-border dark:bg-card mt-auto border-t bg-black text-white">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center">
          <ThemeSelector />
          <CMSLink label="Admin" className="text-white" url={'/admin'} newTab />
          <nav className="flex flex-col gap-4 md:flex-row">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />;
            })}
          </nav>
        </div>
      </div>
    </footer>
  );
}
