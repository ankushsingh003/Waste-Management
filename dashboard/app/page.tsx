"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity, AlertTriangle, BarChart3, Cpu, Eye,
  TrendingUp, Zap, Upload, RefreshCcw, ShieldCheck,
  Terminal, Layers, ChevronDown, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// ============================================================
//  LIVE DATA HOOK
// ============================================================
function useLiveMetrics() {
  const [metrics, setMetrics] = useState({
    defectRate: 1.8,
    throughput: 856,
    uptime: 99.7,
    quality: 98.2,
    ink: 74,
    paper: 88,
    solvent: 41,
    energyKw: 142.3,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        defectRate: +(Math.max(0.5, Math.min(4.5, prev.defectRate + (Math.random() - 0.5) * 0.15))).toFixed(2),
        throughput: Math.round(Math.max(700, Math.min(1000, prev.throughput + (Math.random() - 0.5) * 12))),
        quality: +(Math.max(95, Math.min(99.9, prev.quality + (Math.random() - 0.5) * 0.1))).toFixed(1),
        energyKw: +(Math.max(120, Math.min(180, prev.energyKw + (Math.random() - 0.5) * 2))).toFixed(1),
      }));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return metrics;
}

// ============================================================
//  MINI SVG SPARKLINE
// ============================================================
function Sparkline({ data, color = '#00f2fe', height = 40 }: { data: number[]; color?: string; height?: number }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100, h = height;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <polygon points={`${pts} ${w},${h} 0,${h}`} fill={color} fillOpacity="0.08" />
    </svg>
  );
}

// ============================================================
//  THROUGHPUT BAR CHART
// ============================================================
function ThroughputChart({ live }: { live: number }) {
  const [bars, setBars] = useState(() => Array.from({ length: 12 }, () => 700 + Math.random() * 300));
  useEffect(() => {
    setBars(prev => [...prev.slice(1), live]);
  }, [live]);
  const max = Math.max(...bars);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px' }}>
      {bars.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${(v / max) * 100}%`,
          background: i === bars.length - 1
            ? 'linear-gradient(to top, #7c3aed, #00f2fe)'
            : `rgba(0,242,254,${0.15 + (i / bars.length) * 0.25})`,
          borderRadius: '2px 2px 0 0',
          transition: 'height 0.5s ease',
        }} />
      ))}
    </div>
  );
}

// ============================================================
//  RESOURCE GAUGE
// ============================================================
function ResourceBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 800, color }}>{value}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

// ============================================================
//  MAIN PAGE
// ============================================================
export default function CommandCenter() {
  const m = useLiveMetrics();
  const [facility, setFacility] = useState('Chicago Hub');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [inspectResult, setInspectResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [forecast, setForecast] = useState<any>({ predicted_price: 128.5, trend: 'stable', material_name: 'Paper' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sparkHistory, setSparkHistory] = useState<number[]>([1.8, 1.7, 2.0, 1.6, 1.9, 1.5, 1.8]);
  const [qHistory, setQHistory] = useState<number[]>([98, 98.2, 98.1, 98.4, 97.9, 98.3, 98.2]);

  const [logs, setLogs] = useState([
    { id: 1, time: '07:00:05', msg: 'Neural Node: Surface scan complete (No defects)', type: 'info' },
    { id: 2, time: '07:01:12', msg: 'Forecaster: Paper price pivot detected (+2.4%)', type: 'warning' },
    { id: 3, time: '07:02:30', msg: 'Orchestrator: Executing Hedge Strategy Q3', type: 'success' },
    { id: 4, time: '07:03:01', msg: 'Vision Agent: Roller #5 anomaly resolved', type: 'success' },
  ]);

  useEffect(() => {
    setSparkHistory(prev => [...prev.slice(1), m.defectRate]);
    setQHistory(prev => [...prev.slice(1), m.quality]);
  }, [m.defectRate, m.quality]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const r = await fetch('http://127.0.0.1:8002/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ material_name: 'Premium Glossy Paper', historical_prices: [120, 122, 121, 123, 125, 124, 126, 128, 127, 129] }),
        });
        if (r.ok) setForecast(await r.json());
      } catch { /* offline */ }
    };
    fetchForecast();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    setPreviewUrl(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append('file', file);
    try {
      const r = await fetch('http://127.0.0.1:8001/detect', { method: 'POST', body: fd });
      if (r.ok) {
        const data = await r.json();
        setInspectResult(data);
        const log = { id: Date.now(), time: new Date().toLocaleTimeString(), msg: `Inspect: ${data.total_defects} defects • Score ${data.quality_score}%`, type: data.total_defects > 0 ? 'warning' : 'success' };
        setLogs(prev => [log, ...prev.slice(0, 12)]);
      }
    } catch { }
    finally { setUploadLoading(false); }
  };

  return (
    <div className="animate-fade-up">
      {/* ── Header ─────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="breadcrumb">PrintSense AI / {facility} / Production Line A</div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-1px' }}>
            Command Center <span className="badge badge-teal" style={{ verticalAlign: 'middle', marginLeft: '10px', fontSize: '10px' }}>v2.0 AI-Core</span>
          </h1>
          <p style={{ color: '#4a5568', fontSize: '13px', marginTop: '4px' }}>Unified Printing Operations & Strategic Intelligence</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            className="form-select"
            value={facility}
            onChange={e => setFacility(e.target.value)}
          >
            {['Chicago Hub', 'Berlin Plant', 'Tokyo Facility'].map(f => <option key={f}>{f}</option>)}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px' }}>
            <div className="status-dot pulse" />
            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>LIVE</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">

        {/* ── KPI 1: Defect Rate ───────────────────────── */}
        <div className="widget-3 glass-card">
          <div className="kpi-header"><Activity size={14} style={{ color: '#00f2fe' }} /><span>Defect Rate</span></div>
          <div className="kpi-value" style={{ color: m.defectRate < 2.5 ? '#10b981' : '#f43f5e' }}>{m.defectRate}%</div>
          <div className="kpi-delta down"><ArrowDownRight size={12} />0.3% from prev hour</div>
          <Sparkline data={sparkHistory} color={m.defectRate < 2.5 ? '#10b981' : '#f43f5e'} />
        </div>

        {/* ── KPI 2: Throughput ────────────────────────── */}
        <div className="widget-3 glass-card">
          <div className="kpi-header"><Zap size={14} style={{ color: '#7c3aed' }} /><span>Throughput</span></div>
          <div className="kpi-value" style={{ color: '#a78bfa' }}>{m.throughput}<span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}> sph</span></div>
          <div className="kpi-delta up"><ArrowUpRight size={12} />+1.8% efficiency gain</div>
          <Sparkline data={[820, 835, 810, 856, 840, 860, m.throughput]} color="#7c3aed" />
        </div>

        {/* ── KPI 3: Quality Score ─────────────────────── */}
        <div className="widget-3 glass-card">
          <div className="kpi-header"><ShieldCheck size={14} style={{ color: '#10b981' }} /><span>Quality Score</span></div>
          <div className="kpi-value" style={{ color: '#10b981' }}>{m.quality}%</div>
          <div className="kpi-delta up"><ArrowUpRight size={12} />Above 98% target</div>
          <Sparkline data={qHistory} color="#10b981" />
        </div>

        {/* ── KPI 4: Market Hedge ──────────────────────── */}
        <div className="widget-3 glass-card">
          <div className="kpi-header"><TrendingUp size={14} style={{ color: '#f59e0b' }} /><span>Margin Guard</span></div>
          <div className="kpi-value" style={{ color: '#f59e0b' }}>${forecast?.predicted_price ?? '---'}</div>
          <div className={`kpi-delta ${forecast?.trend === 'up' ? 'down' : 'up'}`}>
            {forecast?.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {forecast ? `${forecast.trend?.toUpperCase()} — ${forecast.material_name}` : 'Calculating...'}
          </div>
          <Sparkline data={[45, 50, 48, 52, 55, 60, 65]} color="#f59e0b" />
        </div>

        {/* ── Neural Vision Main Feed ───────────────────── */}
        <div className="widget-8 glass-card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="icon-wrap teal"><Eye size={15} /></div>
              <div>
                <h3 style={{ marginBottom: '1px' }}>Neural Vision Matrix</h3>
                <div style={{ fontSize: '10px', color: '#3d4966' }}>Camera Array / Line A / Real-time</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-ghost" style={{ padding: '6px 14px' }} onClick={() => fileInputRef.current?.click()}>
                <Upload size={12} /> {uploadLoading ? 'Analyzing...' : 'Inspect Image'}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept="image/*" />
            </div>
          </div>

          {/* Viewport */}
          <div style={{ height: '300px', background: '#000', borderRadius: '10px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '14px' }}>
            {previewUrl ? (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <img src={previewUrl} alt="Inspection" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
                {inspectResult?.defects?.map((d: any, i: number) => d.box && (
                  <div key={i} style={{ position: 'absolute', top: `${d.box[1] * 100}%`, left: `${d.box[0] * 100}%`, width: `${(d.box[2] - d.box[0]) * 100}%`, height: `${(d.box[3] - d.box[1]) * 100}%`, border: '2px solid #f43f5e', background: 'rgba(244,63,94,0.08)' }}>
                    <span style={{ position: 'absolute', top: '-22px', left: '-2px', background: '#f43f5e', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 6px', whiteSpace: 'nowrap', borderRadius: '2px' }}>{d.label} [{Math.round(d.confidence * 100)}%]</span>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Scanning animation */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,242,254,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,254,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 1 }} />
                <div style={{ position: 'absolute', height: '1px', width: '100%', background: 'linear-gradient(90deg, transparent, #00f2fe, transparent)', boxShadow: '0 0 20px #00f2fe', zIndex: 5, top: '0', animation: 'scan-line 4s linear infinite' }} />
                <div style={{ position: 'absolute', top: '28%', left: '42%', width: '130px', height: '90px', border: '2px solid #f43f5e', background: 'rgba(244,63,94,0.07)', zIndex: 10 }}>
                  <span style={{ position: 'absolute', top: '-22px', left: '-2px', background: '#f43f5e', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '2px' }}>INK_SPLAT [94%]</span>
                </div>
                <div style={{ position: 'absolute', top: '60%', left: '15%', width: '80px', height: '55px', border: '2px solid #f59e0b', background: 'rgba(245,158,11,0.07)', zIndex: 10 }}>
                  <span style={{ position: 'absolute', top: '-22px', left: '-2px', background: '#f59e0b', color: '#000', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '2px' }}>MISREG [78%]</span>
                </div>
                {/* Corner reticles */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 3 }}>
                  <rect x="12" y="12" width="20" height="20" fill="none" stroke="#00f2fe" strokeWidth="1.5" strokeDasharray="6 14" />
                  <rect x="calc(100%-32px)" y="12" width="20" height="20" fill="none" stroke="#00f2fe" strokeWidth="1.5" strokeDasharray="6 14" />
                </svg>
              </>
            )}
            {/* Telemetry overlay */}
            <div style={{ position: 'absolute', bottom: '14px', left: '14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#00f2fe', textShadow: '0 0 6px #00f2fe', lineHeight: 1.8, zIndex: 15 }}>
              <div>LATENCY: {uploadLoading ? '---' : `${inspectResult?.latency_ms ?? 42}ms`}</div>
              <div>RES: {inspectResult?.metadata?.image_size ? `${inspectResult.metadata.image_size[0]}x${inspectResult.metadata.image_size[1]}` : '1280×720'}</div>
              <div>MODEL: {inspectResult?.metadata?.model ?? 'YOLOv8-INDUSTRIAL'}</div>
              {inspectResult && <div style={{ color: inspectResult.status === 'PASS' ? '#10b981' : '#f43f5e', fontWeight: 800 }}>QUALITY: {inspectResult.quality_score}% [{inspectResult.status}]</div>}
            </div>
          </div>

          {/* Feed Thumbnails */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {inspectResult?.defects?.length > 0 ? (
              inspectResult.defects.map((d: any, i: number) => (
                <div key={i} style={{ flex: 1, padding: '10px 14px', background: 'rgba(244,63,94,0.04)', border: '1px solid rgba(244,63,94,0.15)', borderLeft: '3px solid #f43f5e', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>{d.label}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{Math.round(d.confidence * 100)}% Precision</div>
                </div>
              ))
            ) : (
              ['CAM_01', 'CAM_02', 'CAM_03'].map(c => (
                <div key={c} style={{ flex: 1, height: '56px', background: '#0a0a12', borderRadius: '6px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'repeating-radial-gradient(#0d1117 0 1px, transparent 0 20px)', opacity: 0.4 }} />
                  <div style={{ position: 'absolute', bottom: '5px', left: '7px', fontSize: '8px', color: '#2d3748', fontWeight: 700, fontFamily: 'monospace' }}>{c}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Orchestrator Logs ─────────────────────────── */}
        <div className="widget-4 glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="icon-wrap rose"><Terminal size={14} /></div>
              <h3>Orchestrator Log</h3>
            </div>
            <div className="badge badge-green" style={{ fontSize: '9px' }}>Live</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
            {logs.map(l => (
              <div key={l.id} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', lineHeight: 1.5 }}>
                <span style={{ color: '#2d3748', marginRight: '8px' }}>[{l.time}]</span>
                <span style={{ color: l.type === 'info' ? '#64748b' : l.type === 'warning' ? '#f59e0b' : '#10b981' }}>{l.msg}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: Cpu, label: 'Vision Agent', status: 'online', sub: 'Port :8001' },
              { icon: BarChart3, label: 'Forecaster', status: 'online', sub: 'Port :8002' },
              { icon: Layers, label: 'LangGraph Hub', status: 'pulse', sub: 'Port :8003' },
            ].map(({ icon: Icon, label, status, sub }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={13} style={{ color: '#4a5568', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>{label}</div>
                  <div style={{ fontSize: '9px', color: '#3d4966' }}>{sub}</div>
                </div>
                <div className={`status-dot ${status}`} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Throughput Chart ──────────────────────────── */}
        <div className="widget-6 glass-card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="icon-wrap violet"><BarChart3 size={14} /></div>
              <h3>Throughput Timeline</h3>
            </div>
            <span style={{ fontSize: '11px', color: '#4a5568' }}>Last 30 min</span>
          </div>
          <ThroughputChart live={m.throughput} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '10px', color: '#3d4966', fontFamily: 'monospace' }}>-30min</span>
            <span style={{ fontSize: '10px', color: '#3d4966', fontFamily: 'monospace' }}>now</span>
          </div>
        </div>

        {/* ── Resource Levels ───────────────────────────── */}
        <div className="widget-6 glass-card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="icon-wrap amber"><Zap size={14} /></div>
              <h3>Resource Levels</h3>
            </div>
          </div>
          <ResourceBar label="Ink Tank A" value={m.ink} color="#00f2fe" />
          <ResourceBar label="Paper Stock" value={m.paper} color="#a78bfa" />
          <ResourceBar label="Solvent Drum" value={m.solvent} color="#f59e0b" />
          <div style={{ marginTop: '14px', padding: '10px 14px', background: 'rgba(245,158,11,0.06)', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>⚠ Solvent Drum below 50% threshold</span>
            <button className="btn-danger" style={{ padding: '4px 12px', fontSize: '10px' }}>Reorder</button>
          </div>
        </div>

        {/* ── AI Strategic Recommendations ─────────────── */}
        <div className="widget-full glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div className="icon-wrap green"><ShieldCheck size={16} /></div>
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#e2e8f0' }}>AI Strategic Recommendations</h3>
              <p style={{ fontSize: '11px', color: '#4a5568', marginTop: '2px' }}>Autonomous decisions generated by the Orchestrator Pipeline</p>
            </div>
            <div className="badge badge-teal" style={{ marginLeft: 'auto' }}>3 Pending</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {[
              {
                icon: AlertTriangle, color: 'amber', badge: 'badge-amber', priority: 'HIGH',
                title: 'Supply Chain Hedge', body: 'Paper/Ink prices trend +4.5% over next 7 days. Bulk acquisition recommended to lock Q3 margins.',
                cta: 'Authorize Buy', ctaClass: 'btn-primary',
              },
              {
                icon: RefreshCcw, color: 'teal', badge: 'badge-teal', priority: 'MEDIUM',
                title: 'Proactive Maintenance', body: 'Defect cluster on Roller #5 detected. Predictive model shows 72% chance of calibration drift in 4h.',
                cta: 'Schedule Now', ctaClass: 'btn-ghost',
              },
              {
                icon: TrendingUp, color: 'violet', badge: 'badge-violet', priority: 'INFO',
                title: 'Energy Optimization', body: 'Current draw is 142kW. AI suggests shift-schedule adjustment to save ~$380/day in off-peak energy.',
                cta: 'Apply Plan', ctaClass: 'btn-ghost',
              },
            ].map(({ icon: Icon, color, badge, priority, title, body, cta, ctaClass }) => (
              <div key={title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                  <div className={`icon-wrap ${color}`} style={{ marginTop: '2px', flexShrink: 0 }}><Icon size={14} /></div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>{title}</span>
                      <span className={`badge ${badge}`} style={{ fontSize: '8px' }}>{priority}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#4a5568', lineHeight: 1.6 }}>{body}</p>
                  </div>
                </div>
                <button className={ctaClass} style={{ width: '100%', justifyContent: 'center', padding: '8px' }}>{cta}</button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes scan-line {
          from { top: -2px; }
          to   { top: 100%; }
        }
      `}</style>
    </div>
  );
}
