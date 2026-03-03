"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, RefreshCcw, AlertTriangle, BarChart3, Activity } from 'lucide-react';

// ── SVG Line Chart ───────────────────────────────────────────────────
function LineChart({ historical, predicted, color = '#00f2fe' }: { historical: number[]; predicted: number[]; color?: string }) {
  const all = [...historical, ...predicted];
  const maxV = Math.max(...all); const minV = Math.min(...all);
  const range = maxV - minV || 1;
  const W = 600; const H = 180;
  const total = all.length;

  const toXY = (v: number, i: number) => ({
    x: (i / (total - 1)) * W,
    y: H - ((v - minV) / range) * (H - 20) - 10,
  });

  const histPts = historical.map((v, i) => toXY(v, i));
  const predPts = predicted.map((v, i) => toXY(v, historical.length - 1 + i));

  const pathD = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, overflow: 'visible' }}>
      <defs>
        <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* grid lines */}
      {[0.25, 0.5, 0.75].map(t => (
        <line key={t} x1="0" y1={H * (1 - t)} x2={W} y2={H * (1 - t)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      {/* historical fill */}
      {histPts.length > 1 && (
        <polygon
          points={`${pathD(histPts)} L${histPts[histPts.length - 1].x},${H} L0,${H}`}
          fill="url(#histGrad)"
        />
      )}

      {/* historical line */}
      {histPts.length > 1 && (
        <path d={pathD(histPts)} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      )}

      {/* divider at prediction boundary */}
      {predPts.length > 0 && (
        <line x1={predPts[0].x} y1={0} x2={predPts[0].x} y2={H} stroke="rgba(245,158,11,0.2)" strokeWidth="1" strokeDasharray="4 4" />
      )}

      {/* predicted fill */}
      {predPts.length > 1 && (
        <polygon
          points={`${pathD(predPts)} L${predPts[predPts.length - 1].x},${H} L${predPts[0].x},${H}`}
          fill="url(#predGrad)"
        />
      )}

      {/* predicted line */}
      {predPts.length > 1 && (
        <path d={pathD(predPts)} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="6 3" />
      )}

      {/* endpoint dot */}
      {predPts.length > 0 && (
        <circle cx={predPts[predPts.length - 1].x} cy={predPts[predPts.length - 1].y} r="4" fill="#f59e0b" />
      )}

      {/* hover labels on last hist + last pred */}
      {histPts.length > 0 && (
        <>
          <circle cx={histPts[histPts.length - 1].x} cy={histPts[histPts.length - 1].y} r="3" fill={color} />
          <text x={histPts[histPts.length - 1].x + 6} y={histPts[histPts.length - 1].y + 4} fontSize="9" fill={color} fontFamily="JetBrains Mono, monospace">
            ${historical[historical.length - 1]}
          </text>
        </>
      )}
    </svg>
  );
}

// ── Material datasets ────────────────────────────────────────────────
const MATERIALS: Record<string, { historical: number[]; predicted: number[]; unit: string; trend: string }> = {
  'Premium Glossy Paper': {
    historical: [118, 120, 119, 122, 121, 123, 125, 124, 126, 128, 127, 129],
    predicted: [129, 130.5, 132, 133.2, 134.8],
    unit: '$/tonne', trend: 'up',
  },
  'UV Flexo Ink': {
    historical: [340, 342, 339, 344, 341, 343, 346, 344, 347, 345, 348, 350],
    predicted: [350, 348, 346, 345, 344],
    unit: '$/drum', trend: 'down',
  },
  'Aluminum Foil (Packaging)': {
    historical: [2100, 2120, 2110, 2130, 2125, 2140, 2150, 2145, 2155, 2160, 2165, 2170],
    predicted: [2170, 2175, 2180, 2185, 2190],
    unit: '$/MT', trend: 'up',
  },
  'PET Film': {
    historical: [820, 818, 822, 819, 825, 823, 827, 825, 828, 826, 830, 829],
    predicted: [829, 828, 827, 826, 826],
    unit: '$/MT', trend: 'flat',
  },
};

export default function ForecastPage() {
  const [selected, setSelected] = useState('Premium Glossy Paper');
  const [loading, setLoading] = useState(false);
  const mat = MATERIALS[selected];
  const lastHist = mat.historical[mat.historical.length - 1];
  const lastPred = mat.predicted[mat.predicted.length - 1];
  const delta = +(lastPred - lastHist).toFixed(1);
  const deltaP = +((delta / lastHist) * 100).toFixed(2);

  const fetchForecast = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="breadcrumb">PrintSense AI / AI Forecast</div>
          <h1>Market Intelligence <span className="badge badge-amber" style={{ verticalAlign: 'middle', marginLeft: '10px', fontSize: '10px' }}>Neural Hedge Engine</span></h1>
          <p>Predictive pricing & supply chain risk management for print materials</p>
        </div>
        <button className="btn-ghost" onClick={fetchForecast} style={{ gap: '8px' }}>
          <RefreshCcw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          {loading ? 'Fetching...' : 'Recalculate'}
        </button>
      </div>

      <div className="dashboard-grid">

        {/* Material Selector */}
        <div className="widget-full glass-card" style={{ padding: '16px 24px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.keys(MATERIALS).map(m => (
              <button
                key={m}
                onClick={() => setSelected(m)}
                className={selected === m ? 'btn-primary' : 'btn-ghost'}
                style={{ fontSize: '12px' }}
              >{m}</button>
            ))}
          </div>
        </div>

        {/* Main Chart */}
        <div className="widget-9 glass-card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="icon-wrap amber"><BarChart3 size={14} /></div>
              <div>
                <h3>{selected}</h3>
                <div style={{ fontSize: '10px', color: '#3d4966', marginTop: '1px' }}>{mat.unit} · 12-week historical + 5-week AI forecast</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#64748b' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '2px', background: '#00f2fe', borderRadius: '2px' }} /> Historical
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '2px', background: '#f59e0b', borderRadius: '2px', borderStyle: 'dashed' }} /> AI Forecast
              </span>
            </div>
          </div>
          <LineChart historical={mat.historical} predicted={mat.predicted} color={mat.trend === 'up' ? '#10b981' : mat.trend === 'down' ? '#f43f5e' : '#00f2fe'} />
        </div>

        {/* Delta Panel */}
        <div className="widget-3 glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div className="kpi-header"><Activity size={13} style={{ color: '#f59e0b' }} /><span>Forecast Delta</span></div>
            <div className="kpi-value" style={{ color: delta > 0 ? '#f43f5e' : '#10b981', fontSize: '32px' }}>
              {delta > 0 ? '+' : ''}{delta}
            </div>
            <div className={`kpi-delta ${delta > 0 ? 'down' : 'up'}`}>
              {delta > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(deltaP)}% projected change
            </div>
          </div>
          <div>
            <div className="kpi-header"><TrendingUp size={13} style={{ color: '#00f2fe' }} /><span>Trend Signal</span></div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: mat.trend === 'up' ? '#f43f5e' : mat.trend === 'down' ? '#10b981' : '#64748b', textTransform: 'uppercase' }}>{mat.trend}</div>
          </div>
          <div>
            <div className="kpi-header"><span>AI Confidence</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1 }} className="progress-bar"><div className="progress-fill" style={{ width: '87%' }} /></div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#00f2fe' }}>87%</span>
            </div>
          </div>
        </div>

        {/* Hedge Recommendations */}
        <div className="widget-full glass-card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="icon-wrap rose"><AlertTriangle size={14} /></div>
              <h3>Hedge Strategy Engine</h3>
            </div>
            <span className="badge badge-amber">Auto-Generated</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'Buy Signal', desc: `Lock ${selected} stock now before projected ${Math.abs(deltaP)}% price spike in 5 weeks. Recommended volume: 3 months supply.`, priority: 'HIGH', color: 'amber' },
              { label: 'Hedge Window', desc: 'Consider futures contract for 60-day protection. AI confidence: 87%. Optimal strike price within +2% of current market.', priority: 'MEDIUM', color: 'teal' },
            ].map(({ label, desc, priority, color }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>{label}</div>
                  <div className={`badge badge-${color}`} style={{ fontSize: '9px' }}>{priority}</div>
                </div>
                <p style={{ fontSize: '12px', color: '#4a5568', lineHeight: 1.7 }}>{desc}</p>
                <button className="btn-primary" style={{ marginTop: '16px', width: '100%', justifyContent: 'center', padding: '8px', fontSize: '12px' }}>Authorize Strategy</button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
