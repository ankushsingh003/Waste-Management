"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Eye,
    TrendingUp,
    GitBranch,
    Settings,
    Bell,
    ChevronRight,
    Activity,
    Zap,
} from 'lucide-react';

const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'Command Center', color: 'teal' },
    { href: '/vision', icon: Eye, label: 'Vision Feed', color: 'violet' },
    { href: '/forecast', icon: TrendingUp, label: 'AI Forecast', color: 'amber' },
    { href: '/orchestration', icon: GitBranch, label: 'Orchestration', color: 'rose' },
    { href: '/settings', icon: Settings, label: 'System Config', color: 'slate' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(true);

    return (
        <aside style={{
            width: expanded ? '220px' : '64px',
            transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
            background: 'rgba(5,5,10,0.95)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            height: '100vh',
            zIndex: 100,
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
        }}>
            {/* Logo */}
            <div style={{
                padding: expanded ? '28px 20px 20px' : '28px 0 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: expanded ? 'space-between' : 'center',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
                {expanded && (
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #fff 30%, #00f2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            PrintSense AI
                        </div>
                        <div style={{ fontSize: '9px', color: '#2d3748', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px' }}>
                            Enterprise Platform
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setExpanded(!expanded)}
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '6px',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748b',
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                    }}
                >
                    <ChevronRight size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
                </button>
            </div>

            {/* System Status Banner */}
            {expanded && (
                <div style={{
                    margin: '12px 12px 0',
                    padding: '8px 12px',
                    background: 'rgba(0,242,254,0.06)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,242,254,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <div className="pulse" style={{ flexShrink: 0 }} />
                    <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.5px' }}>All Systems Online</div>
                        <div style={{ fontSize: '9px', color: '#3d4966', marginTop: '1px' }}>3 Agents Active</div>
                    </div>
                </div>
            )}

            {/* Nav */}
            <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {navItems.map(({ href, icon: Icon, label, color }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            title={label}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: expanded ? '10px 12px' : '10px 0',
                                justifyContent: expanded ? 'flex-start' : 'center',
                                borderRadius: '8px',
                                color: active ? '#00f2fe' : '#4a5568',
                                background: active ? 'rgba(0,242,254,0.08)' : 'transparent',
                                borderLeft: active ? '2px solid #00f2fe' : '2px solid transparent',
                                fontWeight: active ? 700 : 500,
                                fontSize: '13px',
                                transition: 'all 0.2s ease',
                                textDecoration: 'none',
                                position: 'relative',
                                whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                            <Icon size={16} style={{ flexShrink: 0 }} />
                            {expanded && label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Metrics */}
            {expanded && (
                <div style={{
                    padding: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '8px 10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                                <Activity size={9} /> CPU
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#00f2fe' }}>34%</div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '8px 10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                                <Zap size={9} /> GPU
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#7c3aed' }}>67%</div>
                        </div>
                    </div>

                    {/* User */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.02)',
                    }}>
                        <div style={{
                            width: 32, height: 32,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #7c3aed, #00f2fe)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: '12px', color: '#fff', flexShrink: 0,
                        }}>AS</div>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0' }}>Ankush Singh</div>
                            <div style={{ fontSize: '10px', color: '#4a5568' }}>Factory Director</div>
                        </div>
                        <Bell size={14} style={{ color: '#4a5568', marginLeft: 'auto', flexShrink: 0 }} />
                    </div>
                </div>
            )}
        </aside>
    );
}
