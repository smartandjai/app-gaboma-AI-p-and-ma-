'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Sparkles, CircleDashed, LayoutGrid, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const NODES = [
  { id: 'prompt', label: 'Prompt', top: 32, left: 28, accent: 'var(--gabon-blue)' },
  { id: 'intent', label: 'Intent', top: 180, left: 200, accent: 'var(--gabon-green)' },
  { id: 'agent', label: 'Agent', top: 120, left: 420, accent: 'var(--gabon-yellow)' },
];

export default function DeerFlowCanvas() {
  const [liveMode, setLiveMode] = useState(true);
  const nodes = useMemo(() => NODES, []);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(12,16,28,0.88)] shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4 bg-[rgba(7,11,20,0.72)]">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">Obsidian Glass</p>
          <h2 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">DeerFlow Canvas</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-xl">
            Workspace nodal minimaliste pour planifier les prompts et la logique d&apos;IA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-[var(--text-secondary)]">
            <Switch checked={liveMode} onCheckedChange={(value) => setLiveMode(value)} />
            <span>{liveMode ? 'Live' : 'Draft'}</span>
          </label>

          <Button
            variant="secondary"
            onClick={() => toast.success('Canvas Obsidian prêt — prêt pour les futurs nœuds @xyflow/react.')}
          >
            <Sparkles size={16} />
            Activer
          </Button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden px-6 py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(46,204,138,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_28%)]" />
        <div className="relative h-full rounded-[1.75rem] border border-[rgba(255,255,255,0.05)] bg-[rgba(6,10,16,0.88)] shadow-[inset_0_0_120px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-x-0 top-0 h-16 border-b border-[rgba(255,255,255,0.04)] bg-[rgba(5,7,12,0.75)] px-5 py-4 text-sm text-[var(--text-secondary)] flex items-center gap-2">
            <CircleDashed size={16} /> Veuillez noter : illustration UI, future intégration @xyflow/react.
          </div>

          <div className="absolute inset-0 overflow-hidden">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="absolute rounded-[1.35rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(8,12,22,0.9)] p-4 shadow-[0_14px_60px_rgba(0,0,0,0.24)]"
                style={{ top: node.top, left: node.left, width: 180 }}
              >
                <span className="text-[0.65rem] uppercase tracking-[0.24em] text-[var(--text-tertiary)]">Nœud</span>
                <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{node.label}</p>
                <div className="mt-3 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-xs text-[var(--text-secondary)]">
                  Temps réel ou guide de conversation.
                </div>
              </div>
            ))}

            <div className="pointer-events-none absolute left-[calc(28px+180px)] top-[calc(32px+32px)] flex items-center gap-2 text-[var(--text-tertiary)]">
              <span className="h-px w-24 bg-[rgba(255,255,255,0.12)]" />
              <ArrowRight size={18} />
              <span className="h-px w-24 bg-[rgba(255,255,255,0.12)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
