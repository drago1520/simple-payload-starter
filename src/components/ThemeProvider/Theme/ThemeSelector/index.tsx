'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState } from 'react';

import { Bold, Italic, Monitor, Moon, Sun, Underline } from 'lucide-react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { useTheme } from '..';
import { themeLocalStorageKey } from './types';
import { Theme } from '../types';

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme();
  const [value, setValue] = useState('');

  const onThemeChange = (themeToSet: Theme) => {
    if (themeToSet === 'auto') {
      setTheme(null);
      setValue('auto');
    } else {
      setTheme(themeToSet);
      setValue(themeToSet);
    }
  };

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey);
    setValue(preference ?? 'auto');
  }, []);

  return (
    <ToggleGroup type="single" size="sm" value={value} onValueChange={(value: Theme) => onThemeChange(value)}>
      <ToggleGroupItem value="auto" aria-label="Toggle auto" className="rounded-lg">
        <Monitor className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="light" aria-label="Toggle light" className="rounded-lg">
        <Sun className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Toggle dark" className="rounded-lg">
        <Moon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
