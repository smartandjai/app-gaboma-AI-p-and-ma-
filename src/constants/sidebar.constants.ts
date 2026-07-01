/**
 * GabomaAI · Sidebar Constants
 * SmartANDJ AI Technologies
 */

import {
  IconFolder,
  IconFileText,
  IconRoute,
  IconTrophy,
} from '@tabler/icons-react';
import type { NavItem } from '@/types/sidebar.types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'projet',   label: 'Projet',    href: '/projet',   icon: IconFolder },
  { id: 'rendu',    label: 'Le Rendu',  href: '/rendu',    icon: IconFileText },
  { id: 'en-piste', label: 'En Piste',  href: '/en-piste', icon: IconRoute },
  { id: 'trophees', label: 'Trophées',  href: '/trophees', icon: IconTrophy },
] as const;

export const SIDEBAR_WIDTHS = {
  expanded: 260,
  collapsed: 64,
  mobile: 280,
} as const;

export const MOBILE_BREAKPOINT = 768;

export const RECENTS_DISPLAY_COUNT = 5;

export const SIDEBAR_STORAGE_KEY = 'gaboma-sidebar-collapsed';
