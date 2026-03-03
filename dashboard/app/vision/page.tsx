"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Eye, Upload, Camera, Cpu, ShieldCheck, XCircle, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

// ── Simulated Defect History Table ───────────────────────────────────
const HISTORY = [
    { id: 'INS-0041', time: '07:02:15', cam: 'CAM_03', type: 'Ink Splat', conf: 94, status: 'FAIL', action: 'Rejected' },
    { id: 'INS-0042', time: '07:04:33', cam: 'CAM_01', type: 'Misregistration', conf: 78, status: 'WARN', action: 'Flagged' },
    { id: 'INS-0043', time: '07:06:10', cam: 'CAM_02', type: 'No Defect', conf: 99, status: 'PASS', action: 'Passed' },
    { id: 'INS-0044', time: '07:08:45', cam: 'CAM_01', type: 'Streak', conf: 88, status: 'FAIL', action: 'Rejected' },
    { id: 'INS-0045', time: '07:10:02', cam: 'CAM_04', type: 'No Defect', conf: 99, status: 'PASS', action: 'Passed' },
    { id: 'INS-0046', time: '07:12:20', cam: 'CAM_03', type: 'Color Drift', conf: 82, status: 'WARN', action: 'Flagged' },
];

// ── Camera Feed Tile ─────────────────────────────────────────────────
function CameraFeed({ name, status, alert }: { name: string; status: string; alert?: string }) {
    return (
        <div style={{
            background: '#060810',
            borderRadius: '10px',
            overflow: 'hidden',
            border: `1px solid ${alert ? 'rgba(244,63,94,0.3)' : 'rgba(255,255,255,0.05)'}`,
            position: 'relative',
            boxShadow: alert ? '0 0 20px rgba(244,63,94,0.12)' : 'none',
        }}>
            <div style={{ height: '140px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Grid BG */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,242,254,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,254,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                {/* Scan line */}
                {status === 'SCANNING' && (
                    <div style={{ position: 'absolute', height: '1px', width: '100%', background: 'linear-gradient(90deg,transparent,#00f2fe,transparent)', top: 0, animation: 'scan-line 3s linear infinite' }} />
                )}
                {/* Defect box */}
                {alert && (
                    <div style={{ position: 'absolute', top: '35%', left: '30%', width: '80px', height: '55px', border: '2px solid #f43f5e', background: 'rgba(244,63,94,0.1)' }}>
                        <span style={{ position: 'absolute', top: '-20px', left: '-2px', background: '#f43f5e', color: '#fff', fontSize: '8px', fontWeight: 800, padding: '1px 5px', borderRadius: '2px', whiteSpace: 'nowrap' }}>{alert}</span>
                    </div>
                )}
                <Camera size={24} style={{ color: '#1a2035', zIndex: 2 }} />
            </div>
            <div style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>{name}</div>
                    <div style={{ fontSize: '9px', color: '#3d4966', marginTop: '2px' }}>{status}</div>
                </div>
                <div className={`badge ${alert ? 'badge-rose' : 'badge-green'}`} style={{ fontSize: '8px' }}>
                    {alert ? 'DEFECT' : 'CLEAR'}
                </div>
            </div>
        </div>
    );
}

// ── Quality Gauge ────────────────────────────────────────────────────
function QualityGauge({ value }: { value: number }) {
    const center = { x: 70, y: 70 };
    const r = 56;
    const startAngle = -210; const sweepAngle = 240;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const arcPt = (angle: number) => ({
        x: center.x + r * Math.cos(toRad(angle)),
        y: center.y + r * Math.sin(toRad(angle)),
    });

    const pct = value / 100;
    const fillAngle = startAngle + sweepAngle * pct;
    const s = arcPt(startAngle); const e = arcPt(fillAngle);
    const fg = arcPt(fillAngle - 1); const bg = arcPt(startAngle + sweepAngle);

    const arc = (from: { x: number; y: number }, to: { x: number; y: number }, large: boolean) =>
        `M${from.x.toFixed(1)},${from.y.toFixed(1)} A${r},${r} 0 ${large ? 1 : 0} 1 ${to.x.toFixed(1)},${to.y.toFixed(1)}`;

    const color = value >= 98 ? '#10b981' : value >= 95 ? '#f59e0b' : '#f43f5e';

    return (
        <svg viewBox="0 0 140 110" style={{ width: '100%', maxWidth: '180px' }}>
            <path d={arc(s, bg, sweepAngle > 180)} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" strokeLinecap="round" />
            {pct > 0.01 && <path d={arc(s, e, sweepAngle * pct > 180)} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />}
            <text x="70" y="72" textAnchor="middle" fontSize="22" fontWeight="900" fill={color} fontFamily="Inter, sans-serif">{value}%</text>
            <text x="70" y="86" textAnchor="middle" fontSize="8" fill="#3d4966" fontFamily="Inter, sans-serif" textDecoration="uppercase" letterSpacing="1">QUALITY</text>
        </svg>
    );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function VisionPage() {
    const [quality, setQuality] = useState(98.2);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [inspectResult, setInspectResult] = useState<any>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [history, setHistory] = useState(HISTORY);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const id = setInterval(() => setQuality(v => +(Math.max(95, Math.min(99.9, v + (Math.random() - 0.5) * 0.2))).toFixed(1)), 4000);
        return () => clearInterval(id);
    }, []);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadLoading(true);
        setPreviewUrl(URL.createObjectURL(file));
        const fd = new FormData(); fd.append('file', file);
        try {
            const r = await fetch('http://127.0.0.1:8001/detect', { method: 'POST', body: fd });
            if (r.ok) {
                const data = await r.json();
                setInspectResult(data);
                const entry = {
                    id: `INS-${Math.floor(Math.random() * 9000) + 1000}`,
                    time: new Date().toLocaleTimeString(),
                    cam: 'MANUAL',
                    type: data.defects?.[0]?.label ?? 'No Defect',
                    conf: Math.round((data.defects?.[0]?.confidence ?? 0.99) * 100),
                    status: data.status === 'PASS' ? 'PASS' : 'FAIL',
                    action: data.status === 'PASS' ? 'Passed' : 'Rejected',
                };
                setHistory(prev => [entry, ...prev.slice(0, 10)]);
            }
        } catch { } finally { setUploadLoading(false); }
    };

    return (
        <div className="animate-fade-up">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <div className="breadcrumb">PrintSense AI / Vision Intelligence</div>
                    <h1>Vision Intelligence <span className="badge badge-violet" style={{ verticalAlign: 'middle', marginLeft: '10px', fontSize: '10px' }}>4K AI Inspection</span></h1>
                    <p>Real-time multi-camera defect detection & quality control</p>
                </div>
                <button className="btn-primary" onClick={() => fileRef.current?.click()}>
                    <Upload size={13} />{uploadLoading ? 'Analyzing...' : 'Manual Inspect'}
                </button>
                <input type="file" ref={fileRef} onChange={handleFile} style={{ display: 'none' }} accept="image/*" />
            </div>

            <div className="dashboard-grid">

                {/* Camera Array */}
                <div className="widget-8 glass-card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="icon-wrap violet"><Camera size={14} /></div>
                            <h3>Live Camera Array</h3>
                        </div>
                        <span className="badge badge-green">4 Active</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <CameraFeed name="CAM_01 — Sector A" status="SCANNING" />
                        <CameraFeed name="CAM_02 — Sector B" status="SCANNING" alert="INK_SPLAT [94%]" />
                        <CameraFeed name="CAM_03 — Sector C" status="SCANNING" />
                        <CameraFeed name="CAM_04 — Overlay" status="SCANNING" alert="MISREG [78%]" />
                    </div>
                </div>

                {/* Gauge + Stats */}
                <div className="widget-4 glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div className="card-header" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="icon-wrap green"><Activity size={14} /></div>
                            <h3>Quality Score</h3>
                        </div>
                    </div>
                    <QualityGauge value={quality} />
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { label: 'Total Inspected', value: '4,821', color: '#00f2fe' },
                            { label: 'Passed', value: '4,709', color: '#10b981' },
                            { label: 'Rejected', value: '82', color: '#f43f5e' },
                            { label: 'Flagged', value: '30', color: '#f59e0b' },
                        ].map(({ label, value, color }) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>{label}</span>
                                <span style={{ fontSize: '12px', fontWeight: 800, color }}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Manual Inspect Result */}
                {inspectResult && (
                    <div className="widget-full glass-card">
                        <div className="card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div className={`icon-wrap ${inspectResult.status === 'PASS' ? 'green' : 'rose'}`}>
                                    {inspectResult.status === 'PASS' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                </div>
                                <h3>Inspection Result — {inspectResult.status}</h3>
                            </div>
                            <div className={`badge ${inspectResult.status === 'PASS' ? 'badge-green' : 'badge-rose'}`}>
                                {inspectResult.quality_score}% Quality Score
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            {previewUrl && <img src={previewUrl} alt="Inspect" style={{ width: '200px', height: '140px', objectFit: 'contain', background: '#000', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }} />}
                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {(inspectResult.defects?.length > 0 ? inspectResult.defects : [{ label: 'No Defect', confidence: 1, status: 'pass' }]).map((d: any, i: number) => (
                                    <div key={i} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 800, color: d.status === 'pass' ? '#10b981' : '#f43f5e', textTransform: 'uppercase' }}>{d.label}</div>
                                        <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>{Math.round(d.confidence * 100)}% confidence</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Defect History Table */}
                <div className="widget-full glass-card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="icon-wrap teal"><Eye size={14} /></div>
                            <h3>Inspection History</h3>
                        </div>
                        <span style={{ fontSize: '11px', color: '#3d4966' }}>Last {history.length} inspections</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                                <tr>
                                    {['ID', 'Time', 'Camera', 'Defect Type', 'Confidence', 'Status', 'Action'].map(h => (
                                        <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '10px', fontWeight: 700, color: '#3d4966', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(r => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={{ padding: '10px 12px', color: '#4a5568', fontFamily: 'monospace', fontSize: '11px' }}>{r.id}</td>
                                        <td style={{ padding: '10px 12px', color: '#4a5568', fontFamily: 'monospace', fontSize: '11px' }}>{r.time}</td>
                                        <td style={{ padding: '10px 12px', color: '#00f2fe', fontFamily: 'monospace', fontSize: '11px' }}>{r.cam}</td>
                                        <td style={{ padding: '10px 12px', color: '#e2e8f0', fontWeight: 600 }}>{r.type}</td>
                                        <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{r.conf}%</td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <span className={`badge ${r.status === 'PASS' ? 'badge-green' : r.status === 'WARN' ? 'badge-amber' : 'badge-rose'}`} style={{ fontSize: '9px' }}>{r.status}</span>
                                        </td>
                                        <td style={{ padding: '10px 12px', color: r.action === 'Passed' ? '#10b981' : r.action === 'Flagged' ? '#f59e0b' : '#f43f5e', fontWeight: 600, fontSize: '11px' }}>{r.action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <style jsx>{`
        @keyframes scan-line { from { top: -2px; } to { top: 100%; } }
      `}</style>
        </div>
    );
}
