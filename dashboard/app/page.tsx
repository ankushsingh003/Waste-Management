"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Cpu,
  Database,
  Eye,
  Layers,
  LayoutDashboard,
  LineChart,
  RefreshCcw,
  ShieldCheck,
  Terminal,
  TrendingUp,
  Zap,
  Upload,
  Camera
} from 'lucide-react';

export default function DashboardPage() {
  const [defectRate, setDefectRate] = useState(1.8);
  const [productionSpeed, setProductionSpeed] = useState(850);
  const [isUploading, setIsUploading] = useState(false);
  const [inspectResult, setInspectResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logs, setLogs] = useState([
    { id: 1, time: '14:20:05', msg: 'Neural Node 4: Surface scan complete (No defects)', type: 'info' },
    { id: 2, time: '14:21:12', msg: 'Forecaster: Paper price pivot detected (+2.4%)', type: 'warning' },
    { id: 3, time: '14:22:30', msg: 'Orchestrator: Executing Hedge Strategy Q3', type: 'success' },
  ]);

  // Simulate live data
  useEffect(() => {
    const interval = setInterval(() => {
      setDefectRate(prev => Math.max(0.5, Math.min(5, prev + (Math.random() - 0.5) * 0.2)));
      setProductionSpeed(prev => Math.max(700, Math.min(1000, prev + (Math.random() - 0.5) * 10)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8001/detect', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setInspectResult(data);

      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        msg: `Manual Inspect: ${data.total_defects} defects found (${data.quality_score} score)`,
        type: data.total_defects > 0 ? 'warning' : 'success'
      };
      setLogs(prev => [newLog, ...prev.slice(0, 10)]);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <div className="breadcrumb">Factory A / Sector 4 / Main Line</div>
        <h1>Command Center <span className="neural-tag">v2.0 AI-Core</span></h1>
        <p>Unified Printing Operational Intelligence & Strategic Orchestration</p>
      </header>

      <div className="dashboard-grid">
        {/* KPI Row */}
        <div className="widget-sm glass-card kpi-card">
          <div className="kpi-header">
            <Activity size={18} className="icon-primary" />
            <span>Defect Precision</span>
          </div>
          <div className="kpi-value">{defectRate.toFixed(2)}%</div>
          <div className="kpi-trend good">↓ 0.4% from last hour</div>
          <div className="sparkline">
            {[40, 35, 45, 30, 25, 35, 20].map((h, i) => (
              <div key={i} className="spark-bar" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>

        <div className="widget-sm glass-card kpi-card">
          <div className="kpi-header">
            <Zap size={18} className="icon-secondary" />
            <span>Efficiency Index</span>
          </div>
          <div className="kpi-value">{(productionSpeed / 10).toFixed(1)}</div>
          <div className="kpi-trend">Nominal Operating Range</div>
          <div className="progress-ring-mini">
            <div className="ring-fill" style={{ width: `${(productionSpeed / 10)}%` }}></div>
          </div>
        </div>

        <div className="widget-sm glass-card kpi-card">
          <div className="kpi-header">
            <TrendingUp size={18} className="icon-accent" />
            <span>Margin Guard</span>
          </div>
          <div className="kpi-value">+$1.4k</div>
          <div className="kpi-trend warning">Projected ROI Offset (Price)</div>
          <div className="sparkline">
            {[20, 30, 45, 60, 55, 70, 85].map((h, i) => (
              <div key={i} className="spark-bar accent" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>

        {/* Main Feed Row */}
        <div className="widget-lg glass-card vision-command">
          <div className="card-header">
            <div className="header-left">
              <Eye size={18} />
              <h3>Neural Vision Matrix</h3>
            </div>
            <div className="feed-controls">
              <button
                className="btn-inspect"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} /> {isUploading ? 'Analyzing...' : 'Inspect Image'}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept="image/*"
              />
            </div>
          </div>

          <div className="viewport">
            {previewUrl ? (
              <div className="preview-container">
                <img src={previewUrl} alt="Inspection" className="inspect-preview" />
                {inspectResult?.defects?.map((defect: any, idx: number) => (
                  <div
                    key={idx}
                    className="detection-box"
                    style={{
                      top: `${defect.box[1] * 100}%`,
                      left: `${defect.box[0] * 100}%`,
                      width: `${(defect.box[2] - defect.box[0]) * 100}%`,
                      height: `${(defect.box[3] - defect.box[1]) * 100}%`
                    }}
                  >
                    <span className="box-label">{defect.label} [{Math.round(defect.confidence * 100)}%]</span>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="scan-line"></div>
                <div className="grid-overlay"></div>
                <div className="defects-layer">
                  <div className="detection-box" style={{ top: '30%', left: '45%', width: '120px', height: '80px' }}>
                    <span className="box-label">SIMULATED_SPLAT [98%]</span>
                  </div>
                </div>
              </>
            )}

            <div className="telemetry-overlay">
              <div>LATENCY: {isUploading ? '---' : '42ms'}</div>
              <div>RESOLUTION: {previewUrl ? 'Detecting...' : '1280x720'}</div>
              <div>MODEL: YOLOv8_INDUSTRIAL</div>
              {inspectResult && <div style={{ color: 'var(--primary)' }}>QUALITY_SCORE: {inspectResult.quality_score}</div>}
            </div>
          </div>

          <div className="feed-vignettes">
            {[1, 2, 3].map(i => (
              <div key={i} className="vignette">
                <div className="vignette-label">FEED_{i}</div>
                <div className="vignette-static"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Neural Log Side Panel */}
        <div className="widget-sm glass-card logs-panel">
          <div className="card-header">
            <Terminal size={18} />
            <h3>Orchestrator Logs</h3>
          </div>
          <div className="log-scroller">
            {logs.map(log => (
              <div key={log.id} className={`log-entry ${log.type}`}>
                <span className="log-time">[{log.time}]</span>
                <span className="log-msg">{log.msg}</span>
              </div>
            ))}
          </div>
          <div className="agent-status-panel">
            <div className="agent-item">
              <Cpu size={14} />
              <span>Vision Agent</span>
              <span className="status-dot online"></span>
            </div>
            <div className="agent-item">
              <BarChart3 size={14} />
              <span>Forecaster</span>
              <span className="status-dot online"></span>
            </div>
            <div className="agent-item">
              <Layers size={14} />
              <span>LangGraph Hub</span>
              <span className="status-dot pulse"></span>
            </div>
          </div>
        </div>

        {/* Strategic Insight Row */}
        <div className="widget-full glass-card strategic-section">
          <div className="strategic-header">
            <ShieldCheck className="icon-success" />
            <div>
              <h3>AI Strategic Recommendations</h3>
              <p>Autonomous optimizations generated by the Orchestrator Pipeline</p>
            </div>
          </div>
          <div className="actions-grid">
            <div className="action-item">
              <div className="action-main">
                <AlertTriangle size={20} className="icon-warning" />
                <div>
                  <h4>Supply Chain Hedge Required</h4>
                  <p>Raw material prices (Paper/Ink) trend suggests 4.5% increase. Sync production with bulk acquisition.</p>
                </div>
              </div>
              <button className="btn-action">Authorize Buy</button>
            </div>
            <div className="action-item">
              <div className="action-main">
                <RefreshCcw size={20} className="icon-secondary" />
                <div>
                  <h4>Proactive Maintenance Cycle</h4>
                  <p>Vision defect cluster detected on Roller 5. Performance drop threshold reached.</p>
                </div>
              </div>
              <button className="btn-action">Run Maintenance</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          animation: fade-in 1s ease-out;
        }
        
        .preview-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .inspect-preview {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #000;
        }

        .btn-inspect {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: var(--primary);
          color: black;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-inspect:hover { transform: scale(1.05); }

        .breadcrumb {
          font-size: 10px;
          text-transform: uppercase;
          color: #444;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .neural-tag {
          font-size: 12px;
          background: var(--primary-glow);
          color: var(--primary);
          padding: 2px 8px;
          border-radius: 4px;
          vertical-align: middle;
          margin-left: 12px;
          border: 1px solid var(--primary);
        }

        .kpi-header {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .kpi-value {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .kpi-trend {
          font-size: 12px;
          margin-top: 4px;
          margin-bottom: 20px;
          color: #64748b;
        }

        .kpi-trend.good { color: #10b981; }
        .kpi-trend.warning { color: #f59e0b; }

        .sparkline {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 40px;
        }

        .spark-bar {
          flex: 1;
          background: var(--primary);
          opacity: 0.3;
          border-radius: 2px;
        }
        .spark-bar.accent { background: var(--accent); }

        .vision-command .viewport {
          height: 360px;
          background: #000;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          margin: 16px 0;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(0, 242, 254, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 242, 254, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: 1;
        }

        .scan-line {
          position: absolute;
          height: 2px;
          width: 100%;
          background: var(--primary);
          box-shadow: 0 0 15px var(--primary);
          top: 0;
          animation: scan 4s linear infinite;
          z-index: 5;
          opacity: 0.5;
        }

        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .detection-box {
          position: absolute;
          border: 2px solid var(--accent);
          background: rgba(255, 0, 85, 0.1);
          z-index: 10;
        }

        .box-label {
          position: absolute;
          top: -24px;
          left: -2px;
          background: var(--accent);
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          white-space: nowrap;
        }

        .telemetry-overlay {
          position: absolute;
          bottom: 20px;
          left: 20px;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: var(--primary);
          text-shadow: 0 0 5px var(--primary);
          z-index: 5;
          line-height: 1.6;
        }

        .feed-vignettes {
          display: flex;
          gap: 12px;
        }

        .vignette {
          flex: 1;
          height: 60px;
          background: #111;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }

        .vignette-label {
          position: absolute;
          font-size: 8px;
          color: #444;
          bottom: 4px;
          left: 4px;
        }

        .vignette-static {
          position: absolute;
          inset: 0;
          background: repeating-radial-gradient(#000 0 1px, transparent 0 20px);
          opacity: 0.2;
        }

        .log-scroller {
          height: 200px;
          overflow-y: auto;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 16px 0;
          padding-right: 10px;
        }

        .log-entry { padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.02); }
        .log-entry.info { color: #94a3b8; }
        .log-entry.warning { color: #f59e0b; }
        .log-entry.success { color: var(--primary); }
        .log-time { color: #444; margin-right: 8px; }

        .agent-status-panel {
          border-top: 1px solid var(--card-border);
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .agent-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: #64748b;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #333;
          margin-left: auto;
        }

        .status-dot.online { background: #10b981; box-shadow: 0 0 8px #10b981; }
        .status-dot.pulse {
          background: var(--primary);
          box-shadow: 0 0 8px var(--primary);
          animation: status-pulse 2s infinite;
        }

        @keyframes status-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }

        .strategic-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .action-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          justify-content: space-between;
        }

        .action-main {
          display: flex;
          gap: 16px;
        }

        .action-main h4 { font-size: 14px; margin-bottom: 4px; }
        .action-main p { font-size: 12px; color: #64748b; line-height: 1.5; }

        .btn-action {
          padding: 10px;
          background: transparent;
          border: 1px solid var(--primary);
          color: var(--primary);
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-action:hover {
          background: var(--primary);
          color: black;
        }

        .icon-primary { color: var(--primary); }
        .icon-secondary { color: var(--secondary); }
        .icon-accent { color: var(--accent); }
        .icon-warning { color: #f59e0b; }
        .icon-success { color: #10b981; }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
