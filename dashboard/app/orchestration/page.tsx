"use client";

import React, { useState, useEffect } from 'react';
import { GitBranch, CheckCircle2, Clock, Zap, Cpu, BarChart3, Layers, Activity, Database, Terminal, ArrowRight } from 'lucide-react';

const TOOL_LOGS = [
  { agent: 'Vision Agent', tool: 'capture_frame', status: 'done', ms: 12 },
  { agent: 'Vision Agent', tool: 'run_yolo_inference', status: 'done', ms: 127 },
  { agent: 'Vision Agent', tool: 'classify_defect', status: 'done', ms: 8 },
  { agent: 'Forecaster', tool: 'fetch_market_data', status: 'done', ms: 320 },
  { agent: 'Forecaster', tool: 'run_lstm_prediction', status: 'done', ms: 84 },
  { agent: 'Orchestrator', tool: 'evaluate_hedge_signal', status: 'active', ms: null },
  { agent: 'Orchestrator', tool: 'trigger_buy_order', status: 'waiting', ms: null },
  { agent: 'Router', tool: 'dispatch_alert', status: 'waiting', ms: null },
];

const STATE_TRANSITIONS = [
  { from: 'START', to: 'CAPTURE_FRAME', time: '00.000s', color: '#10b981' },
  { from: 'CAPTURE_FRAME', to: 'RUN_INFERENCE', time: '00.012s', color: '#10b981' },
  { from: 'RUN_INFERENCE', to: 'CLASSIFY_DEFECT', time: '00.139s', color: '#10b981' },
  { from: 'CLASSIFY_DEFECT', to: 'FETCH_MARKET', time: '00.147s', color: '#10b981' },
  { from: 'FETCH_MARKET', to: 'LSTM_PREDICT', time: '00.467s', color: '#10b981' },
  { from: 'LSTM_PREDICT', to: 'EVALUATE_HEDGE', time: '00.551s', color: '#00f2fe' },
  { from: 'EVALUATE_HEDGE', to: 'TRIGGER_BUY', time: '---', color: '#f59e0b' },
];

export default function OrchestrationPage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '32px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="breadcrumb">PrintSense AI / Orchestration</div>
          <h1>LangGraph Orchestration <span className="badge badge-rose" style={{ verticalAlign: 'middle', marginLeft: '10px', fontSize: '10px' }}>Live Pipeline</span></h1>
          <p>Multi-agent graph execution trace & real-time decision flow</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Agent Graph */}
        <div className="widget-9 glass-card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="icon-wrap teal"><GitBranch size={14} /></div>
              <h3>Agent Graph — Execution Trace</h3>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#64748b' }}>
              {[['Done', '#10b981'], ['Active', '#00f2fe'], ['Waiting', '#f59e0b']].map(([l, c]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c as string }} />{l}
                </span>
              ))}
            </div>
          </div>
          <div style={{ background: '#04040c', borderRadius: '10px', padding: '20px', border: '1px solid rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,242,254,0.02) 1px, transparent 1px), linear-gradient(90deg,rgba(0,242,254,0.02) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />
            <svg viewBox="0 0 600 220" style={{ width: '100%', height: 200, position: 'relative', zIndex: 1 }}>
              {/* Edges */}
              <path d="M100,110 C160,110 160,60 196,60" fill="none" stroke="rgba(0,242,254,0.25)" strokeWidth="1.5" />
              <path d="M100,120 C160,120 160,180 196,180" fill="none" stroke="rgba(245,158,11,0.25)" strokeWidth="1.5" />
              <path d="M240,60  C300,60  300,120 356,120" fill="none" stroke="rgba(124,58,237,0.25)" strokeWidth="1.5" />
              <path d="M240,180 C300,180 300,120 356,120" fill="none" stroke="rgba(245,158,11,0.25)" strokeWidth="1.5" />
              <path d="M400,120 L496,120" fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5" />
              {/* Animated dots */}
              <circle r="3" fill="#00f2fe"><animateMotion dur="2s" repeatCount="indefinite" path="M100,110 C160,110 160,60 196,60" /></circle>
              <circle r="3" fill="#f59e0b"><animateMotion dur="2.5s" repeatCount="indefinite" path="M100,120 C160,120 160,180 196,180" /></circle>
              <circle r="3" fill="#00f2fe"><animateMotion dur="1.8s" repeatCount="indefinite" path="M240,60 C300,60 300,120 356,120" /></circle>
              {/* Nodes */}
              {[
                { x: 80, y: 115, label: 'State', color: 'rgba(0,242,254,0.12)', stroke: '#10b981', sub: 'Graph Root' },
                { x: 220, y: 60, label: 'Vision', color: 'rgba(124,58,237,0.12)', stroke: '#10b981', sub: 'YOLOv8' },
                { x: 220, y: 180, label: 'Forecaster', color: 'rgba(245,158,11,0.12)', stroke: '#10b981', sub: 'LSTM' },
                { x: 378, y: 120, label: 'Orchestrator', color: 'rgba(0,242,254,0.12)', stroke: '#00f2fe', sub: 'Decision' },
                { x: 518, y: 120, label: 'Router', color: 'rgba(16,185,129,0.12)', stroke: '#f59e0b', sub: 'Dispatch' },
              ].map(n => (
                <g key={n.label}>
                  {n.stroke === '#00f2fe' && (
                    <circle cx={n.x} cy={n.y} r="30" fill="#00f2fe" fillOpacity="0.04">
                      <animate attributeName="r" values="28;34;28" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={n.x} cy={n.y} r="24" fill={n.color} stroke={n.stroke} strokeWidth="1.5" />
                  <circle cx={n.x} cy={n.y + 20} r="5" fill={n.stroke} />
                  <text x={n.x} y={n.y + 38} textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="Inter" fontWeight="700">{n.label}</text>
                  <text x={n.x} y={n.y + 50} textAnchor="middle" fontSize="8" fill="#3d4966" fontFamily="Inter">{n.sub}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Run Summary */}
        <div className="widget-3 glass-card">
          <div className="card-header">
            <h3>Run #1,847</h3>
            <div className="badge badge-teal" style={{ fontSize: '9px' }}>In Progress</div>
          </div>
          {[
            { label: 'Started', value: '07:12:00', Icon: Clock },
            { label: 'Steps Done', value: '6 / 8', Icon: CheckCircle2 },
            { label: 'Total Time', value: '551ms', Icon: Zap },
            { label: 'Model Calls', value: '2', Icon: Cpu },
          ].map(({ label, value, Icon }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <Icon size={13} style={{ color: '#4a5568', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: '#64748b', flex: 1 }}>{label}</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#e2e8f0', fontFamily: 'monospace' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Tool Call Log */}
        <div className="widget-full glass-card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="icon-wrap rose"><Terminal size={14} /></div>
              <h3>Tool Call Trace</h3>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  {['#', 'Agent', 'Tool', 'Latency', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 14px', fontSize: '10px', fontWeight: 700, color: '#3d4966', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOOL_LOGS.map((log, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: log.status === 'active' ? 'rgba(0,242,254,0.03)' : 'transparent' }}>
                    <td style={{ padding: '10px 14px', color: '#3d4966', fontFamily: 'monospace', fontSize: '11px' }}>{String(i + 1).padStart(2, '0')}</td>
                    <td style={{ padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>{log.agent}</td>
                    <td style={{ padding: '10px 14px', color: '#00f2fe', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>{log.tool}()</td>
                    <td style={{ padding: '10px 14px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '11px' }}>{log.ms ? `${log.ms}ms` : '---'}</td>
                    <td style={{ padding: '10px 14px' }}>
                      {log.status === 'done' && <span className="badge badge-green" style={{ fontSize: '9px' }}>DONE</span>}
                      {log.status === 'active' && <span className="badge badge-teal" style={{ fontSize: '9px' }}>ACTIVE</span>}
                      {log.status === 'waiting' && <span className="badge badge-amber" style={{ fontSize: '9px' }}>WAITING</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* State Transitions */}
        <div className="widget-full glass-card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="icon-wrap violet"><Activity size={14} /></div>
              <h3>State Transition Log</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {STATE_TRANSITIONS.map(({ from, to, time, color }) => (
              <div key={from} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: '10px', color: '#3d4966', fontFamily: 'monospace', width: '60px', flexShrink: 0 }}>{time}</span>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{from}</span>
                <ArrowRight size={12} style={{ color, flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color, fontFamily: 'monospace', fontWeight: 700 }}>{to}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
