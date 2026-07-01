/**
 * GabomaAI · SidebarFooter (Zone 5)
 * SmartANDJ AI Technologies
 * Energy gauge + Profile + Settings dropdown
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import {
  IconSettings,
  IconUser,
  IconLogout,
  IconHistory,
} from '@tabler/icons-react';
import { useAuthStore } from '@/stores/auth.store';
import SidebarItem from './SidebarItem';
import styles from './sidebar.module.css';

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export default function SidebarFooter({ isCollapsed }: SidebarFooterProps) {
  const router = useRouter();
  const { signOut } = useClerk();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const [showDropdown, setShowDropdown] = useState(false);
  const [energyWidth, setEnergyWidth] = useState(0);
  const footerRef = useRef<HTMLDivElement>(null);

  // Animate energy bar on mount
  useEffect(() => {
    const timer = setTimeout(() => setEnergyWidth(35), 300);
    return () => clearTimeout(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e: MouseEvent) => {
      if (footerRef.current && !footerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showDropdown]);

  // Close dropdown on Escape
  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowDropdown(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showDropdown]);

  const handleSignOut = async () => {
    logout();
    await signOut();
    router.push('/sign-in');
  };

  const displayName = user?.name || 'Daniel Jonathan';
  const initials = displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  // Collapsed state: just icon buttons
  if (isCollapsed) {
    return (
      <div style={{ marginTop: 'auto', padding: '8px', borderTop: '0.5px solid var(--border)', flexShrink: 0 }}>
        <SidebarItem
          icon={<IconHistory size={16} stroke={1.5} />}
          label="Activité"
          isCollapsed
        />
        <SidebarItem
          icon={<IconSettings size={16} stroke={1.5} />}
          label="Paramètres"
          isCollapsed
          onClick={() => setShowDropdown(!showDropdown)}
        />
      </div>
    );
  }

  return (
    <div
      ref={footerRef}
      className={styles.sidebarFooter}
      style={{
        marginTop: 14,
        paddingTop: 14,
        borderTop: '0.5px solid var(--border)',
        flexShrink: 0,
        padding: '14px 8px',
        position: 'relative',
      }}
    >
      {/* Energy card */}
      <div className={styles.energyCard}>
        <div className={styles.energyHeader}>
          <span className={styles.energyLabel}>Énergie quotidienne</span>
          <span className={styles.energyValue}>350/1000</span>
        </div>
        <div className={styles.energyTrack}>
          <div
            className={styles.energyFill}
            style={{ width: `${energyWidth}%` }}
          />
        </div>
      </div>

      {/* Activité */}
      <SidebarItem
        icon={<IconHistory size={16} stroke={1.5} />}
        label="Activité"
      />

      {/* Profile row */}
      <div className={styles.profileRow} style={{ marginTop: 6 }}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{displayName}</div>
          <div className={styles.userLocation}>Pays-Bas</div>
        </div>
        <button
          type="button"
          className={styles.settingsBtn}
          onClick={() => setShowDropdown(!showDropdown)}
          aria-label="Paramètres"
          aria-expanded={showDropdown}
        >
          <IconSettings size={16} stroke={1.5} />
        </button>
      </div>

      {/* Settings dropdown */}
      {showDropdown && (
        <div className={styles.settingsDropdown}>
          {/* User info header */}
          <div className={styles.dropdownHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className={styles.avatar} style={{ width: 34, height: 34, fontSize: 13 }}>{initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{displayName}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Pays-Bas</div>
              </div>
            </div>
          </div>

          <div className={styles.dropdownSeparator} />

          <button type="button" className={styles.dropdownItem} onClick={() => { setShowDropdown(false); router.push('/settings'); }}>
            <IconSettings size={16} stroke={1.5} />
            Paramètres
          </button>

          <button type="button" className={styles.dropdownItem} onClick={() => { setShowDropdown(false); router.push('/account'); }}>
            <IconUser size={16} stroke={1.5} />
            Mon compte
          </button>

          <div className={styles.dropdownSeparator} />

          <button type="button" className={`${styles.dropdownItem} ${styles.dropdownDanger}`} onClick={handleSignOut}>
            <IconLogout size={16} stroke={1.5} />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
