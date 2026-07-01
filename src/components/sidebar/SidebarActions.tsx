/**
 * GabomaAI · SidebarActions (Zone 2)
 * SmartANDJ AI Technologies
 * Nouvelle Piste + Rechercher
 */

'use client';

import { useRouter } from 'next/navigation';
import { IconEdit, IconSearch } from '@tabler/icons-react';
import SidebarItem from './SidebarItem';
import styles from './sidebar.module.css';

interface SidebarActionsProps {
  isCollapsed: boolean;
}

export default function SidebarActions({ isCollapsed }: SidebarActionsProps) {
  const router = useRouter();

  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
      {/* Nouvelle Piste */}
      {isCollapsed ? (
        <SidebarItem
          icon={<IconEdit size={17} stroke={1.5} style={{ color: 'var(--accent)' }} />}
          label="Nouvelle piste"
          isCollapsed
          onClick={() => router.push('/')}
        />
      ) : (
        <button
          type="button"
          onClick={() => router.push('/')}
          className={`${styles.item} ${styles.actionPrimary}`}
        >
          <span className={styles.itemIcon}>
            <IconEdit size={17} stroke={1.5} style={{ color: 'var(--accent)' }} />
          </span>
          <span className={styles.sidebarLabel}>Nouvelle piste</span>
        </button>
      )}

      {/* Rechercher */}
      <SidebarItem
        icon={<IconSearch size={16} stroke={1.5} />}
        label="Rechercher"
        isCollapsed={isCollapsed}
      />
    </div>
  );
}
