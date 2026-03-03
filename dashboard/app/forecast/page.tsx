"use client";

import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Zap,
    Activity,
    History,
    BrainCircuit,
    PieChart
} from 'lucide-react';

export default function ForecastPage() {
    const [forecast, setForecast] = useState<any>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchForecast = async () => {
        setIsRefreshing(true);
        try {
            const response = await fetch('http://127.0.0.1:8002/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    material_name: "Premium Glossy Paper",
                    historical_prices: [120, 122, 121, 123, 125, 124, 126, 128, 127, 129]
                })
            });
            const data = await response.json();
            setForecast(data);
        } catch (e) {
            setForecast({ predicted_price: 131.2, trend: 'up', material_name: 'Premium Coating Ink (Simulated)' });
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchForecast();
        const interval = setInterval(fetchForecast, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="forecast-container">
            <header className="page-header">
                <div className="breadcrumb">Global Supply / Neural Market Intelligence</div>
                <h1>Market Prediction Hub</h1>
                <p>LSTM-powered predictive analytics for resource acquisition and risk mitigation.</p>
            </header>

            <div className="forecast-grid">
                {/* Main Price Action Card */}
                <div className="widget-lg glass-card main-forecast">
                    <div className="card-header">
                        <div className="header-left">
                            <BrainCircuit className="icon-primary" />
                            <h3>Neural Price Projection</h3>
                        </div>
                        <span className="live-pill">LIVE ENGINE</span>
                    </div>

                    <div className="big-price-display">
                        <div className="price-tag">
                            <span className="label">PROJECTED NEXT {forecast?.material_name}</span>
                            <div className="value">${forecast?.predicted_price}</div>
                        </div>
                        <div className={`trend-indicator ${forecast?.trend}`}>
                            {forecast?.trend === 'up' ? <ArrowUpRight size={48} /> : <ArrowDownRight size={48} />}
                            <div className="trend-details">
                                <span className="pct">+2.4%</span>
                                <span className="msg">Neural confidence: 88.4%</span>
                            </div>
                        </div>
                    </div>

                    <div className="forecast-viz">
                        {/* Visual simulation of LSTM layers/sequence */}
                        <div className="viz-layers">
                            {[0.4, 0.6, 0.8, 1.0, 0.7, 0.5, 0.9, 1.2, 1.1, 1.0, 1.4].map((v, i) => (
                                <div key={i} className="viz-node" style={{ height: `${v * 80}px`, opacity: 0.2 + (i * 0.08) }}></div>
                            ))}
                        </div>
                        <div className="viz-labels">
                            <span>Day -10</span>
                            <span>Input Sequence</span>
                            <span>Prediction</span>
                        </div>
                    </div>
                </div>

                {/* Neural Insights Card */}
                <div className="widget-sm glass-card insights-card">
                    <div className="card-header">
                        <Target className="icon-accent" />
                        <h3>Strategic Hedge</h3>
                    </div>
                    <div className="insight-content">
                        <div className="stat-row">
                            <span className="stat-label">Acquisition window</span>
                            <span className="stat-value">48h Close</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Volatility Index</span>
                            <span className="stat-value low">LOW (0.12)</span>
                        </div>
                        <p className="insight-desc">
                            The neural forecaster detects a bottoming trend in ink solvent prices.
                            Recommendation: Execute bulk acquisition before Q3 pivot.
                        </p>
                        <button className="btn-primary-ghost">Run Correlation Scan</button>
                    </div>
                </div>

                {/* Secondary Services Hub */}
                <div className="widget-full glass-card metrics-row">
                    <div className="metrics-grid">
                        <div className="metric-box">
                            <PieChart size={20} className="icon-secondary" />
                            <div>
                                <h4>Asset Health</h4>
                                <div className="val">99.4%</div>
                            </div>
                        </div>
                        <div className="metric-box">
                            <History size={20} className="icon-primary" />
                            <div>
                                <h4>Model Version</h4>
                                <div className="val">LSTM_v4.2</div>
                            </div>
                        </div>
                        <div className="metric-box">
                            <Zap size={20} className="icon-accent" />
                            <div>
                                <h4>Edge Sync</h4>
                                <div className="val">12ms Latency</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .forecast-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
        }

        .main-forecast {
          grid-column: span 8;
          padding: 40px;
        }

        .live-pill {
          font-size: 10px;
          background: rgba(0, 242, 254, 0.1);
          color: var(--primary);
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid var(--primary);
          letter-spacing: 1px;
          font-weight: 800;
        }

        .big-price-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 60px 0;
        }

        .price-tag .label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .price-tag .value {
          font-size: 72px;
          font-weight: 900;
          letter-spacing: -3px;
          color: #fff;
        }

        .trend-indicator {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .trend-indicator.up { color: var(--accent); }
        .trend-indicator.down { color: var(--primary); }

        .trend-details .pct {
          display: block;
          font-size: 24px;
          font-weight: 800;
        }

        .trend-details .msg {
          font-size: 12px;
          color: #64748b;
        }

        .forecast-viz {
          margin-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 40px;
        }

        .viz-layers {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          height: 120px;
        }

        .viz-node {
          flex: 1;
          background: var(--primary);
          border-radius: 4px;
          transition: height 0.3s ease;
        }

        .viz-labels {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #444;
          text-transform: uppercase;
          margin-top: 12px;
        }

        .insights-card {
          grid-column: span 4;
        }

        .insight-content {
          margin-top: 32px;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.02);
          font-size: 13px;
        }

        .stat-label { color: #64748b; }
        .stat-value { font-weight: 700; }
        .stat-value.low { color: #10b981; }

        .insight-desc {
          font-size: 13px;
          line-height: 1.6;
          color: #94a3b8;
          margin: 24px 0;
        }

        .btn-primary-ghost {
          width: 100%;
          padding: 12px;
          background: rgba(0, 242, 254, 0.05);
          border: 1px solid var(--primary);
          color: var(--primary);
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .metric-box {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .metric-box h4 {
          font-size: 11px;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 4px;
        }

        .metric-box .val {
          font-size: 18px;
          font-weight: 800;
        }
      `}</style>
        </div>
    );
}
