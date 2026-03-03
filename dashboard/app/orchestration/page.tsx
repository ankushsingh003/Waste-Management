"use client";

import React, { useState, useEffect } from 'react';
import {
    ShieldAlert,
    Cpu,
    Workflow,
    Network,
    Zap,
    CheckCircle2,
    Clock,
    Play,
    RotateCcw
} from 'lucide-react';

export default function OrchestrationPage() {
    const [nodes, setNodes] = useState([
        { id: 'VISION', status: 'ACTIVE', type: 'INPUT', label: 'Neural Vision node' },
        { id: 'FORECAST', status: 'ACTIVE', type: 'INPUT', label: 'Price Engine' },
        { id: 'STRATEGY', status: 'PULSE', type: 'CORE', label: 'LangGraph Logic' },
        { id: 'ACTION', status: 'IDLE', type: 'OUTPUT', label: 'Manufacturing Bus' },
    ]);

    const [logs, setLogs] = useState([
        { time: '07:05:12', node: 'VISION', msg: 'Surface scan complete. Quality: 94%', type: 'success' },
        { time: '07:05:20', node: 'FORECAST', msg: 'Market pivot detected. Hedge suggested.', type: 'warning' },
        { time: '07:05:45', node: 'STRATEGY', msg: 'Executing Autonomous Hedge Strategy v2', type: 'info' },
    ]);

    return (
        <div className="orchestration-container">
            <header className="page-header">
                <div className="breadcrumb">Logic Hub / Autonomous Agents</div>
                <h1>Orchestration Matrix</h1>
                <p>Real-time graph visualization of AI agent decisions and industrial workflows.</p>
            </header>

            <div className="orchestration-grid">
                {/* Node Graph Visualization */}
                <div className="widget-lg glass-card graph-view">
                    <div className="card-header">
                        <Network className="icon-primary" />
                        <h3>Agent Topology</h3>
                    </div>

                    <div className="graph-viz">
                        <div className="nodes-container">
                            {nodes.map((node) => (
                                <div key={node.id} className={`node-item ${node.status.toLowerCase()}`}>
                                    <div className="node-icon">
                                        {node.id === 'VISION' && <Cpu size={20} />}
                                        {node.id === 'FORECAST' && <Workflow size={20} />}
                                        {node.id === 'STRATEGY' && <Zap size={20} />}
                                        {node.id === 'ACTION' && <CheckCircle2 size={20} />}
                                    </div>
                                    <div className="node-info">
                                        <span className="node-label text-xs">{node.label}</span>
                                        <span className="node-id font-bold">{node.id}</span>
                                    </div>
                                    <div className={`status-tag ${node.status.toLowerCase()}`}>{node.status}</div>
                                </div>
                            ))}

                            {/* SVG Connections between nodes */}
                            <svg className="graph-connections">
                                <line x1="20%" y1="50%" x2="40%" y2="50%" className="conn-line active" />
                                <line x1="20%" y1="80%" x2="40%" y2="50%" className="conn-line active" />
                                <line x1="60%" y1="50%" x2="80%" y2="50%" className="conn-line" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Tactical Control Card */}
                <div className="widget-sm glass-card control-panel">
                    <div className="card-header">
                        <Workflow className="icon-accent" />
                        <h3>Tactical Overrides</h3>
                    </div>
                    <div className="control-list">
                        <div className="control-item">
                            <div className="item-txt">
                                <h4>Safety Interlock</h4>
                                <p>Auto-shutdown on defect cluster</p>
                            </div>
                            <div className="toggle active"></div>
                        </div>
                        <div className="control-item">
                            <div className="item-txt">
                                <h4>Hedge Authorization</h4>
                                <p>Autonomous bulk buy rights</p>
                            </div>
                            <div className="toggle"></div>
                        </div>
                        <button className="btn-primary mt-6">Deploy Logic Suite</button>
                        <button className="btn-secondary-ghost mt-2">Reset Graph State</button>
                    </div>
                </div>

                {/* Global Agent Logs */}
                <div className="widget-full glass-card log-expanded">
                    <div className="card-header">
                        <Clock size={16} />
                        <h3>Unified Agent Event Stream</h3>
                    </div>
                    <div className="log-table">
                        <div className="table-header">
                            <span>Timestamp</span>
                            <span>Source Node</span>
                            <span>Event Payload</span>
                            <span>Status</span>
                        </div>
                        {logs.map((log, i) => (
                            <div key={i} className="table-row">
                                <span className="timestamp">[{log.time}]</span>
                                <span className={`node-badge ${log.node.toLowerCase()}`}>{log.node}</span>
                                <span className="msg">{log.msg}</span>
                                <span className={`status-dot ${log.type}`}></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .graph-viz {
          height: 400px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .nodes-container {
          display: flex;
          gap: 120px;
          position: relative;
          z-index: 2;
        }

        .node-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          padding: 20px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 140px;
          transition: all 0.3s ease;
        }

        .node-item.active { border-color: var(--primary); box-shadow: 0 0 20px rgba(0, 242, 254, 0.1); }
        .node-item.pulse { animation: node-pulse 2s infinite; border-color: var(--primary); }

        @keyframes node-pulse {
          0% { border-color: var(--primary); transform: scale(1); }
          50% { border-color: var(--accent); transform: scale(1.05); }
          100% { border-color: var(--primary); transform: scale(1); }
        }

        .node-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .status-tag {
          font-size: 8px;
          background: #111;
          padding: 2px 8px;
          border-radius: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .status-tag.active { color: #10b981; }
        .status-tag.pulse { color: var(--primary); }

        .graph-connections {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        .conn-line {
          stroke: rgba(255, 255, 255, 0.05);
          stroke-width: 2;
          stroke-dasharray: 5;
        }

        .conn-line.active {
          stroke: var(--primary);
          stroke-dashoffset: 20;
          animation: flow 2s linear infinite;
        }

        @keyframes flow {
          to { stroke-dashoffset: 0; }
        }

        .control-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 24px;
        }

        .control-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
        }

        .item-txt h4 { font-size: 13px; margin-bottom: 2px; }
        .item-txt p { font-size: 11px; color: #64748b; }

        .toggle {
          width: 32px;
          height: 18px;
          background: #222;
          border-radius: 20px;
          position: relative;
        }

        .toggle.active { background: var(--primary); }
        .toggle::after {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: all 0.2s;
        }
        .toggle.active::after { left: 17px; }

        .log-table {
          width: 100%;
          margin-top: 20px;
        }

        .table-header {
          display: grid;
          grid-template-columns: 120px 140px 1fr 80px;
          padding: 12px;
          font-size: 11px;
          text-transform: uppercase;
          color: #444;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .table-row {
          display: grid;
          grid-template-columns: 120px 140px 1fr 80px;
          padding: 16px 12px;
          font-size: 13px;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.02);
        }

        .timestamp { font-family: 'Courier New', monospace; color: #64748b; font-size: 11px; }
        .node-badge {
          font-size: 10px;
          padding: 4px 10px;
          border-radius: 4px;
          background: rgba(255,255,255,0.05);
          width: fit-content;
        }
        .node-badge.vision { border-left: 3px solid var(--primary); }
        .node-badge.forecast { border-left: 3px solid var(--accent); }
        .node-badge.strategy { border-left: 3px solid #10b981; }

        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .status-dot.success { background: #10b981; box-shadow: 0 0 10px #10b981; }
        .status-dot.warning { background: #f59e0b; }
        .status-dot.info { background: var(--primary); }
      `}</style>
        </div>
    );
}
