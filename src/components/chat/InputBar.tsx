/**
 * Gaboma AI · InputBar.tsx · Client Component
 * SmartANDJ AI Technologies
 * 
 * Gemini Pill InputBar — Spec complète :
 * - Bouton + mutant (rond → pilule après sélection modèle)
 * - Popover vers le haut (Style Perplexity) : modèles + Wandana toggle
 * - STT micro sur PC (dictée vocale)
 * - Gaboma Waves spectre sur Mobile
 * - Flèche d'envoi remplace le bloc vocal dès 1 caractère tapé
 * - Disclaimer : "Gaboma AI peut faire des erreurs. Votre discernement reste souverain."
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera as CameraIcon,
  ScanSearch as ScanSearchIcon,
  Globe as GlobeIcon,
  Gem as GemIcon,
  Puzzle as PuzzleIcon,
  Lock as LockIcon,
} from 'lucide-react';
import { IconAurata, IconNkyel, IconOnyxGris, IconBlackPanther, IconBluePanther, IconWandana } from '@/components/icons';

/* ── Types ────────────────────────────────────────── */
type ModelKey = 'aurata' | 'nkyel' | 'onyx-gris' | 'black-panther';

interface Model {
  key: ModelKey;
  label: string;
  description: string;
}

const MODELS: Model[] = [
  { key: 'black-panther', label: 'Black Panther', description: 'Super Agent multi-agents' },
  { key: 'aurata',        label: 'Aurata',        description: 'Mode fondamental' },
  { key: 'nkyel',         label: 'Ñkyel',         description: 'Mode avancé' },
  { key: 'onyx-gris',     label: 'OnyxGris',      description: 'Agent IA autonome' },
];

interface InputBarProps {
  onSend: (message: string, model: ModelKey | null, wandana: boolean) => void;
  onStop?: () => void;
  isGenerating?: boolean;
}

/* ── Gaboma Waves (Mobile only) ───────────────────── */
function GabomaWaves() {
  return (
    <div className="flex items-center gap-[3px] lg:hidden" aria-label="Gaboma Waves">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: 2.5,
            background: 'var(--accent)',
          }}
          animate={{ height: [6, 14 + i * 3, 6] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

/* ── STT Mic Icon ─────────────────────────────────── */
function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="7" y="2" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 10C5 12.8 7.2 15 10 15C12.8 15 15 12.8 15 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M10 15V18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/* ── Send Arrow Icon ──────────────────────────────── */
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 14V4M9 4L5 8M9 4L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Plus Icon ────────────────────────────────────── */
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ── Chevron Down ─────────────────────────────────── */
function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Main InputBar ────────────────────────────────── */
export default function InputBar({ onSend, onStop, isGenerating }: InputBarProps) {
  const [text, setText] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelKey | null>(null);
  const [wandanaOn, setWandanaOn] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const hasText = text.trim().length > 0;

  /* Auto-resize textarea */
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = '0';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }
  }, [text]);

  /* Close popover on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    if (popoverOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [popoverOpen]);

  const handleSend = useCallback(() => {
    if (!hasText) return;
    onSend(text.trim(), selectedModel, wandanaOn);
    setText('');
  }, [text, selectedModel, wandanaOn, hasText, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectModel = (model: ModelKey) => {
    setSelectedModel(model);
    setPopoverOpen(false);
  };

  const selectedLabel = MODELS.find(m => m.key === selectedModel)?.label;

  return (
    <div className="w-full">
      {/* ── Pill Container ──────────────────────────── */}
      <div className="relative" ref={popoverRef}>
        {/* Popover (opens UP — Style Perplexity) */}
        <AnimatePresence>
          {popoverOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-[var(--radius-lg)] shadow-2xl"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
              }}
            >
              {/* Section 1: Modèles */}
              <div className="px-3 pb-1 pt-3">
                <p
                  className="mb-2 px-2 text-[10px] font-medium uppercase tracking-widest"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Modèles Gaboma
                </p>
                {MODELS.map((model) => (
                  <button
                    key={model.key}
                    onClick={() => handleSelectModel(model.key)}
                    className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-2 py-2.5 transition-colors"
                    style={{
                      background: selectedModel === model.key ? 'var(--accent-10)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedModel !== model.key) e.currentTarget.style.background = 'var(--accent-06)';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedModel !== model.key) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Model Icon */}
                    <div
                      className="flex-shrink-0"
                      style={{
                        color: selectedModel === model.key ? 'var(--accent)' : 'var(--text-tertiary)',
                      }}
                    >
                      {(() => {
                        const props = { width: 14, height: 14 };
                        switch (model.key) {
                          case 'black-panther': return <IconBlackPanther {...props} />;
                          case 'aurata': return <IconAurata {...props} />;
                          case 'nkyel': return <IconNkyel {...props} />;
                          case 'onyx-gris': return <IconOnyxGris {...props} />;
                          default: return <div className="h-2 w-2 rounded-full bg-current" />;
                        }
                      })()}
                    </div>
                    <div className="text-left">
                      <p className="text-[13px] font-medium" style={{ color: '#FFFFFF' }}>
                        {model.label}
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        {model.description}
                      </p>
                    </div>
                    {selectedModel === model.key && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-auto flex-shrink-0">
                        <path d="M3 7L6 10L11 4" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px mx-3" style={{ background: 'var(--border)' }} />

              {/* Section 2: Wandana Deep Research */}
              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0" style={{ color: wandanaOn ? 'var(--accent)' : 'var(--text-tertiary)' }}>
                    <IconWandana width={16} height={16} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: '#FFFFFF' }}>
                      Wandana
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      Recherche & Deep Recherche
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setWandanaOn(!wandanaOn)}
                  className="relative flex-shrink-0 rounded-xl"
                  style={{
                    width: 40,
                    height: 22,
                    background: wandanaOn ? 'var(--accent)' : 'var(--accent-06)',
                    border: `1px solid ${wandanaOn ? 'var(--accent-35)' : 'var(--border)'}`,
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <span
                    className="absolute left-[2px] top-[2px] block rounded-full bg-white"
                    style={{
                      width: 16,
                      height: 16,
                      opacity: wandanaOn ? 1 : 0.4,
                      transform: wandanaOn ? 'translateX(18px)' : 'translateX(0)',
                      transition: 'transform 200ms ease, opacity 200ms ease',
                    }}
                  />
                </button>
              </div>

              {/* Divider */}
              <div className="h-px mx-3" style={{ background: 'var(--border)' }} />

              {/* Section 3: Ajouter au chat — style Claude */}
              <div className="px-3 pt-2 pb-3">
                <p
                  className="mb-2 px-2 text-[10px] font-medium uppercase tracking-widest"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Ajouter au chat
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { icon: <CameraIcon />, label: 'Caméra' },
                    { icon: <ScanSearchIcon />, label: 'Indice' },
                    { icon: <GlobeIcon />, label: 'Wandana' },
                    { icon: <GemIcon />, label: 'Le Rendu' },
                    { icon: <PuzzleIcon />, label: 'Extensions' },
                    { icon: <LockIcon />, label: 'Coffre-Fort' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="flex flex-col items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-2.5 transition-colors"
                      style={{ background: 'transparent' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-06)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>{item.icon}</span>
                      <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── The Pill ─────────────────────────────── */}
        <div
          className="flex items-center gap-2.5 rounded-full py-2 pl-3 pr-2"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
          }}
        >
          {/* LEFT: Mutant + Button → Pill */}
          <AnimatePresence mode="wait">
            {selectedModel ? (
              <motion.button
                key="pill"
                initial={{ width: 36, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 36, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setPopoverOpen(!popoverOpen)}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{
                  background: 'var(--accent-10)',
                  border: '1px solid var(--accent-35)',
                }}
              >
                <PlusIcon />
                <span
                  className="whitespace-nowrap text-[13px] font-semibold"
                  style={{ color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}
                >
                  {selectedLabel}
                </span>
                <ChevronDown />
              </motion.button>
            ) : (
              <motion.button
                key="plus"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setPopoverOpen(!popoverOpen)}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                style={{
                  background: 'var(--accent-10)',
                  border: '1px solid var(--accent-35)',
                  color: 'var(--accent)',
                }}
              >
                <PlusIcon />
              </motion.button>
            )}
          </AnimatePresence>

          {/* CENTER: Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Demandez n'importe quoi à Gaboma..."
            rows={1}
            className="flex-1 resize-none border-none bg-transparent text-[15px] leading-snug outline-none placeholder:text-[var(--text-tertiary)]"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-primary)',
              maxHeight: 200,
            }}
          />

          {/* RIGHT: Dynamic action block */}
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.button
                key="stop"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.12 }}
                onClick={onStop}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                }}
                aria-label="Stop generation"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="3" y="3" width="8" height="8" rx="1.5" />
                </svg>
              </motion.button>
            ) : hasText ? (
              /* Send button */
              <motion.button
                key="send"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.12 }}
                onClick={handleSend}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                }}
              >
                <SendIcon />
              </motion.button>
            ) : (
              /* Mic STT + Waves (mobile) */
              <motion.div
                key="voice"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex flex-shrink-0 items-center gap-2"
              >
                {/* Mic STT (PC + Mobile) */}
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  aria-label="Dictée vocale"
                >
                  <MicIcon />
                </button>
                {/* Gaboma Waves (Mobile only) */}
                <GabomaWaves />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Disclaimer ──────────────────────────────── */}
      <p
        className="mt-3 text-center text-[11px] tracking-wide"
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--text-tertiary)',
        }}
      >
        Gaboma AI peut faire des erreurs. Votre discernement reste souverain.
      </p>
    </div>
  );
}
