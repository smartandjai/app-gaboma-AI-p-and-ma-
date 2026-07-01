/**
 * Gaboma AI · TopBar.tsx · Client Component
 * SmartANDJ AI Technologies
 * 
 * En-tête supérieur :
 * - Gauche : Bouton sidebar (Iboga AI hover sur PC, Iboga seul sur mobile)
 * - Droite PC : Mode Éphémère (texte + icône) + Rendu [◧]
 * - Droite Mobile : [👻] Éphémère + [⋯] Options
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { RenduIcon } from '@/components/icons/RenduIcon';

interface TopBarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function TopBar({ onToggleSidebar, sidebarOpen }: TopBarProps) {
  const [ephemeral, setEphemeral] = useState(false);
  const [hoveredSidebar, setHoveredSidebar] = useState(false);

  return (
    <header className="flex h-[52px] flex-shrink-0 items-center justify-between px-4">
      {/* ── Left: Sidebar toggle ──────────────────── */}
      <button
        onClick={onToggleSidebar}
        onMouseEnter={() => setHoveredSidebar(true)}
        onMouseLeave={() => setHoveredSidebar(false)}
        className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        title={sidebarOpen ? 'Fermer la barre latérale' : 'Ouvrir la barre latérale'}
      >
        {/* Mobile: Always Iboga */}
        <span className="lg:hidden">
          <Image src="/gaboma-logo.png" alt="Iboga" width={28} height={28} className="rounded-lg" />
        </span>
        {/* PC: Gaboma AI default → Iboga AI on hover */}
        <span className="hidden lg:block">
          {hoveredSidebar || sidebarOpen ? (
            <Image src="/gaboma-logo.png" alt="Iboga AI" width={28} height={28} className="rounded-lg" />
          ) : (
            <Image src="/gaboma-icon.png" alt="Gaboma AI" width={28} height={28} className="rounded-lg" />
          )}
        </span>
      </button>

      {/* ── Right: Controls ───────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Mode Éphémère */}
        <button
          onClick={() => setEphemeral(!ephemeral)}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors"
          style={{
            background: ephemeral ? 'var(--accent-10)' : 'transparent',
            border: ephemeral ? '1px solid var(--accent-35)' : '1px solid transparent',
            color: ephemeral ? 'var(--accent)' : 'var(--text-secondary)',
          }}
        >
          {/* Ghost icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 2C6 2 4 4.5 4 7V12C4 12.5 4.3 13 4.8 13C5.3 13 5.5 12.5 6 12.5C6.5 12.5 6.7 13 7.2 13C7.7 13 7.9 12.5 8.5 12.5C9.1 12.5 9.3 13 9.8 13C10.3 13 10.5 12.5 11 12.5C11.5 12.5 11.7 13 12.2 13C12.7 13 13 12.5 13 12V7C13 4.5 11 2 9 2Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="7" cy="7.5" r="0.8" fill="currentColor" />
            <circle cx="11" cy="7.5" r="0.8" fill="currentColor" />
          </svg>
          {/* Text — PC only */}
          <span
            className="hidden text-[13px] font-medium lg:inline"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Mode Éphémère
          </span>
        </button>

        {/* Mobile: Options menu [⋯] */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg lg:hidden"
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="5" cy="9" r="1.2" fill="currentColor" />
            <circle cx="9" cy="9" r="1.2" fill="currentColor" />
            <circle cx="13" cy="9" r="1.2" fill="currentColor" />
          </svg>
        </button>

        {/* PC: Le Rendu 💎 — shown after first response */}
        <button
          className="hidden h-9 w-9 items-center justify-center rounded-lg transition-colors lg:flex"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          title="Ouvrir le Rendu"
        >
          <RenduIcon className="w-[18px] h-[18px]" />
        </button>
      </div>
    </header>
  );
}
