"use client";

import React, { useState } from 'react';
import { Settings, Server, Bell, Shield, Database, Save, RefreshCcw, CheckCircle } from 'lucide-react';

function SettingRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>{label}</div>
                {sub && <div style={{ fontSize: '11px', color: '#4a5568', marginTop: '2px' }}>{sub}</div>}
            </div>
            <div style={{ flexShrink: 0 }}>{children}</div>
        </div>
    );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
        <div
            onClick={() => onChange(!value)}
            style={{ width: 44, height: 24, borderRadius: 12, background: value ? '#00f2fe' : 'rgba(255,255,255,0.08)', position: 'relative', cursor: 'pointer', transition: 'background 0.25s ease', border: '1px solid rgba(255,255,255,0.08)' }}
        >
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: value ? '#000' : '#374151', position: 'absolute', top: 2, left: value ? 22 : 2, transition: 'left 0.25s ease' }} />
        </div>
    );
}

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);
    const [endpoints, setEndpoints] = useState({ vision: 'http://127.0.0.1:8001', forecast: 'http://127.0.0.1:8002', orchestrator: 'http://127.0.0.1:8003' });
    const [thresholds, setThresholds] = useState({ defect: '3.0', quality: '95', alert: '80' });
    const [toggles, setToggles] = useState({ autoHedge: true, alertsEmail: false, maintenanceAI: true, darkMode: true, liveData: true });

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

    return (
        <div className="animate-fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <div className="breadcrumb">PrintSense AI / System Config</div>
                    <h1>System Configuration <span className="badge badge-violet" style={{ verticalAlign: 'middle', marginLeft: '10px', fontSize: '10px' }}>v2.0</span></h1>
                    <p>API endpoints, alert thresholds, and operational preferences</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-ghost"><RefreshCcw size={13} /> Reset Defaults</button>
                    <button className="btn-primary" onClick={handleSave}>
                        {saved ? <><CheckCircle size={13} /> Saved!</> : <><Save size={13} /> Save Changes</>}
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">

                {/* API Endpoints */}
                <div className="widget-6 glass-card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="icon-wrap teal"><Server size={14} /></div>
                            <h3>API Endpoints</h3>
                        </div>
                    </div>
                    {([
                        { key: 'vision', label: 'Vision Agent', sub: 'YOLOv8 defect detection service' },
                        { key: 'forecast', label: 'Forecast Agent', sub: 'LSTM market price prediction' },
                        { key: 'orchestrator', label: 'Orchestrator Hub', sub: 'LangGraph execution engine' },
                    ] as const).map(({ key, label, sub }) => (
                        <div key={key} style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{label}</div>
                            <div style={{ fontSize: '10px', color: '#3d4966', marginBottom: '6px' }}>{sub}</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    className="form-input"
                                    value={endpoints[key]}
                                    onChange={e => setEndpoints(p => ({ ...p, [key]: e.target.value }))}
                                    style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}
                                />
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', alignSelf: 'center', boxShadow: '0 0 6px #10b981' }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Alert Thresholds */}
                <div className="widget-6 glass-card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="icon-wrap amber"><Bell size={14} /></div>
                            <h3>Alert Thresholds</h3>
                        </div>
                    </div>
                    {([
                        { key: 'defect', label: 'Max Defect Rate (%)', sub: 'Alert when defect rate exceeds this value', color: '#f43f5e' },
                        { key: 'quality', label: 'Min Quality Score (%)', sub: 'Alert when score drops below this value', color: '#f59e0b' },
                        { key: 'alert', label: 'Resource Warning Level (%)', sub: 'Alert when any resource falls below', color: '#7c3aed' },
                    ] as const).map(({ key, label, sub, color }) => (
                        <div key={key} style={{ marginBottom: '18px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>{label}</div>
                                <span style={{ fontSize: '13px', fontWeight: 800, color }}>{thresholds[key]}%</span>
                            </div>
                            <div style={{ fontSize: '10px', color: '#3d4966', marginBottom: '8px' }}>{sub}</div>
                            <input
                                type="range" min="0" max="100" step="0.5"
                                value={thresholds[key]}
                                onChange={e => setThresholds(p => ({ ...p, [key]: e.target.value }))}
                                style={{ width: '100%', accentColor: color }}
                            />
                        </div>
                    ))}
                </div>

                {/* Feature Toggles */}
                <div className="widget-6 glass-card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="icon-wrap violet"><Shield size={14} /></div>
                            <h3>Feature Toggles</h3>
                        </div>
                    </div>
                    <SettingRow label="Autonomous Hedge" sub="AI auto-authorizes supply chain buys when confidence > 90%">
                        <Toggle value={toggles.autoHedge} onChange={v => setToggles(p => ({ ...p, autoHedge: v }))} />
                    </SettingRow>
                    <SettingRow label="Email Alerts" sub="Send critical alerts to factory director email">
                        <Toggle value={toggles.alertsEmail} onChange={v => setToggles(p => ({ ...p, alertsEmail: v }))} />
                    </SettingRow>
                    <SettingRow label="AI Maintenance" sub="Predictive scheduling based on defect cluster patterns">
                        <Toggle value={toggles.maintenanceAI} onChange={v => setToggles(p => ({ ...p, maintenanceAI: v }))} />
                    </SettingRow>
                    <SettingRow label="Live Data Streaming" sub="WebSocket real-time data update mode">
                        <Toggle value={toggles.liveData} onChange={v => setToggles(p => ({ ...p, liveData: v }))} />
                    </SettingRow>
                </div>

                {/* System Info */}
                <div className="widget-6 glass-card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="icon-wrap rose"><Database size={14} /></div>
                            <h3>System Info</h3>
                        </div>
                    </div>
                    {[
                        { label: 'Platform Version', value: 'PrintSense AI v2.0.0' },
                        { label: 'YOLO Model', value: 'YOLOv8-Industrial-FT' },
                        { label: 'LSTM Model', value: 'PrintPrice-LSTM-v3' },
                        { label: 'LangGraph', value: 'langgraph==0.1.x' },
                        { label: 'Framework', value: 'Next.js 15 / FastAPI' },
                        { label: 'Uptime', value: '99.7% (30-day)' },
                        { label: 'Last Deploy', value: '2026-03-03 07:00 IST' },
                    ].map(({ label, value }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <span style={{ fontSize: '11px', color: '#4a5568' }}>{label}</span>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>{value}</span>
                        </div>
                    ))}
                </div>

                {/* Facilities */}
                <div className="widget-full glass-card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="icon-wrap green"><Settings size={14} /></div>
                            <h3>Active Facilities</h3>
                        </div>
                        <button className="btn-primary" style={{ fontSize: '11px', padding: '6px 14px' }}>+ Add Facility</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        {[
                            { name: 'Chicago Hub', country: 'USA', lines: 4, status: 'online', cameras: 12 },
                            { name: 'Berlin Plant', country: 'DE', lines: 3, status: 'online', cameras: 9 },
                            { name: 'Tokyo Facility', country: 'JP', lines: 2, status: 'idle', cameras: 6 },
                        ].map(({ name, country, lines, status, cameras }) => (
                            <div key={name} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>{name}</div>
                                    <div className={`badge ${status === 'online' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '9px' }}>{status.toUpperCase()}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#4a5568' }}>
                                    <span>🏭 {lines} Lines</span>
                                    <span>📷 {cameras} Cams</span>
                                    <span>🌍 {country}</span>
                                </div>
                                <button className="btn-ghost" style={{ marginTop: '12px', width: '100%', justifyContent: 'center', padding: '6px', fontSize: '11px' }}>Configure</button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
