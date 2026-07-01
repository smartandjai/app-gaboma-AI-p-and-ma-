/**
 * GabomaAI · Agent Page (ONYX / BLACK PANTHER)
 * SmartANDJ AI Technologies
 * Task 10 — Desktop 3 colonnes, mobile BottomTabs, WebView-ready
 */

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgent } from '@/hooks/useAgent';
import type { GabomaModel } from '@/lib/models';
import InputBar from '@/components/input/InputBar';
import PhaseBanner from '@/components/agent/PhaseBanner';
import AgentTimeline from '@/components/chat/AgentTimeline';
import AgentComputer from '@/components/agent/AgentComputer';

type WorkspaceTab = 'browser' | 'terminal' | 'files' | 'rendu';
type MobileTab = 'conversation' | 'tasks' | 'workspace';

const WORKSPACE_TABS: { key: WorkspaceTab; label: string; icon: string }[] = [
  { key: 'browser', label: 'Navigateur', icon: '🌐' },
  { key: 'terminal', label: 'Terminal', icon: '⚡' },
  { key: 'files', label: 'Fichiers', icon: '📁' },
  { key: 'rendu', label: 'Le Rendu', icon: '💎' },
];

export default function AgentPage() {
  const [model, setModel] = useState<GabomaModel>('ONYXGRIS');
  const [wsTab, setWsTab] = useState<WorkspaceTab>('browser');
  const [mobileTab, setMobileTab] = useState<MobileTab>('conversation');
  const agent = useAgent();

  const handleSend = useCallback((content: string) => {
    agent.startAgent(content, model);
  }, [agent, model]);

  return (
    <div className="flex flex-col h-full" style={{ background: '#020304' }}>
      {/* ── Desktop Layout ── */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Panel 1 — Sessions sidebar (18%) */}
        <div
          className="flex flex-col overflow-hidden"
          style={{ width: '18%', minWidth: 200, borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="px-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: '#525258' }}>
              Sessions
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2">
            <div
              className="px-3 py-2 rounded-lg text-[13px] font-medium"
              style={{ background: 'rgba(197,160,89,0.08)', border: '1px solid rgba(197,160,89,0.12)', color: '#C5A059' }}
            >
              Session active
            </div>
          </div>
        </div>

        {/* Panel 2 — Timeline + Chat (42%) */}
        <div
          className="flex flex-col overflow-hidden"
          style={{ width: '42%', borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          <PhaseBanner phase={agent.phase} />
          <AgentTimeline events={agent.events} />

          {/* Streamed text */}
          {agent.streamedText && (
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="markdown-prose text-[14px]"
                style={{ color: '#F0EDE6', lineHeight: 1.7 }}
              >
                {agent.streamedText}
              </motion.div>
            </div>
          )}

          {!agent.streamedText && agent.events.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-4 h-4 rounded-full mx-auto mb-4"
                  style={{ background: (model === 'BLACK_PANTHER' || model === 'BLUE_PANTHER') ? (model === 'BLUE_PANTHER' ? '#0070F3' : '#C5A059') : '#00D4AA' }}
                />
                <p className="text-[14px] font-semibold" style={{ color: '#F0EDE6', fontFamily: 'var(--font-display)' }}>
                  {model === 'BLUE_PANTHER' ? 'BLUE PANTHER' : (model === 'BLACK_PANTHER' ? 'BLACK PANTHER' : 'ONYXGRIS')}
                </p>
                <p className="text-[13px] mt-1" style={{ color: '#525258' }}>
                  Prêt à exécuter vos directives
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          <AnimatePresence>
            {agent.error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-4 mb-2 px-4 py-3 rounded-xl text-[13px]"
                style={{ background: 'rgba(192,57,45,0.08)', border: '1px solid rgba(192,57,45,0.2)', color: '#C0392D' }}
              >
                ❌ {agent.error}
              </motion.div>
            )}
          </AnimatePresence>

          <InputBar
            onSend={handleSend}
            onStop={agent.stop}
            isStreaming={agent.isStreaming}
            model={model}
            onModelChange={setModel}
          />
        </div>

        {/* Panel 3 — Workspace (40%) */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Workspace tabs */}
          <div
            className="flex gap-1 px-3 py-2"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            {WORKSPACE_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setWsTab(t.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                style={{
                  background: wsTab === t.key ? 'rgba(197,160,89,0.08)' : 'transparent',
                  border: wsTab === t.key ? '1px solid rgba(197,160,89,0.15)' : '1px solid transparent',
                  color: wsTab === t.key ? '#C5A059' : '#525258',
                  cursor: 'pointer',
                }}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Workspace content */}
          <div className="flex-1 overflow-hidden p-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={wsTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {wsTab === 'browser' && <AgentComputer />}
                {wsTab === 'terminal' && <TerminalView lines={agent.streamedText ? agent.streamedText.split('\n') : []} />}
                {wsTab === 'files' && <FilesView files={agent.files} />}
                {wsTab === 'rendu' && <RenduView artifacts={agent.artifacts} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Mobile Layout ── */}
      <div className="flex flex-col flex-1 lg:hidden overflow-hidden">
        <PhaseBanner phase={agent.phase} />

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full overflow-y-auto"
            >
              {mobileTab === 'conversation' && (
                <div className="px-4 py-3">
                  {agent.streamedText ? (
                    <div className="markdown-prose text-[14px]" style={{ color: '#F0EDE6', lineHeight: 1.7 }}>
                      {agent.streamedText}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <p className="text-[13px]" style={{ color: '#525258' }}>En attente de directive…</p>
                    </div>
                  )}
                </div>
              )}
              {mobileTab === 'tasks' && <AgentTimeline events={agent.events} />}
              {mobileTab === 'workspace' && (
                <div className="p-3 h-full">
                  <AgentComputer />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile bottom tabs */}
        <div
          className="flex border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0B0D0F' }}
        >
          {([
            { key: 'conversation', label: 'Chat', icon: '💬' },
            { key: 'tasks', label: 'Tâches', icon: '⚡' },
            { key: 'workspace', label: 'Espace', icon: '🖥️' },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setMobileTab(t.key)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: mobileTab === t.key ? '#C5A059' : '#525258',
              }}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <InputBar
          onSend={handleSend}
          onStop={agent.stop}
          isStreaming={agent.isStreaming}
          model={model}
          onModelChange={setModel}
        />
      </div>
    </div>
  );
}

/* ── Inline sub-views ── */

function TerminalView({ lines }: { lines: string[] }) {
  return (
    <div
      className="h-full rounded-xl overflow-y-auto p-4"
      style={{ background: '#050810', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7 }}
    >
      {lines.length === 0 ? (
        <p style={{ color: '#525258' }}>Terminal en attente…</p>
      ) : (
        lines.map((l, i) => (
          <div key={i} style={{ color: l.startsWith('$') ? '#C5A059' : '#F0EDE6', whiteSpace: 'pre-wrap' }}>{l}</div>
        ))
      )}
    </div>
  );
}

function FilesView({ files }: { files: { name: string; path: string; size: number }[] }) {
  return (
    <div
      className="h-full rounded-xl overflow-y-auto p-4"
      style={{ background: '#0B0D0F', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {files.length === 0 ? (
        <p className="text-[13px]" style={{ color: '#525258' }}>Aucun fichier généré</p>
      ) : (
        <div className="space-y-1">
          {files.map((f) => (
            <div key={f.path} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-sm">📄</span>
              <span className="text-[13px] truncate flex-1" style={{ color: '#F0EDE6', fontFamily: 'var(--font-mono)' }}>{f.name}</span>
              <span className="text-[11px]" style={{ color: '#525258' }}>{(f.size / 1024).toFixed(1)}KB</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RenduView({ artifacts }: { artifacts: { id: string; title: string; type: string; content?: string }[] }) {
  return (
    <div
      className="h-full rounded-xl overflow-y-auto p-4"
      style={{ background: '#0B0D0F', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {artifacts.length === 0 ? (
        <p className="text-[13px]" style={{ color: '#525258' }}>Le Rendu apparaîtra ici 💎</p>
      ) : (
        <div className="space-y-3">
          {artifacts.map((a) => (
            <div key={a.id} className="p-3 rounded-xl" style={{ background: 'rgba(197,160,89,0.04)', border: '1px solid rgba(197,160,89,0.1)' }}>
              <p className="text-[14px] font-semibold mb-1" style={{ color: '#C5A059' }}>{a.title}</p>
              {a.content && (
                <pre className="text-[12px] mt-2 overflow-x-auto" style={{ color: '#8A8A92', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap' }}>
                  {a.content.slice(0, 500)}{a.content.length > 500 ? '…' : ''}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
