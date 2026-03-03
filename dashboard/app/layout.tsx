import type { Metadata } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";
import {
  LayoutDashboard,
  Eye,
  TrendingUp,
  ShieldAlert,
  Settings,
  User
} from 'lucide-react';

export const metadata: Metadata = {
  title: "EcoStream AI | Industrial Command Center",
  description: "Advanced Printing & Packaging Production Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="layout-container">
          <aside className="sidebar">
            <div className="logo-section">
              <Link href="/" className="logo-link">
                <h2 className="gradient-text">EcoStream AI</h2>
              </Link>
              <span className="status-badge"><span className="pulse"></span> Network Live</span>
            </div>
            <nav className="main-nav">
              <Link href="/" className={`nav-item ${usePathname() === '/' ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link href="/vision" className={`nav-item ${usePathname() === '/vision' ? 'active' : ''}`}>
                <Eye size={18} />
                Vision Feed
              </Link>
              <Link href="/forecast" className={`nav-item ${usePathname() === '/forecast' ? 'active' : ''}`}>
                <TrendingUp size={18} />
                Market Forecast
              </Link>
              <Link href="/orchestration" className={`nav-item ${usePathname() === '/orchestration' ? 'active' : ''}`}>
                <ShieldAlert size={18} />
                Orchestration
              </Link>
              <Link href="/settings" className={`nav-item ${usePathname() === '/settings' ? 'active' : ''}`}>
                <Settings size={18} />
                System Config
              </Link>
            </nav>
            <div className="sidebar-footer">
              <div className="user-profile">
                <div className="avatar">
                  <User size={16} />
                </div>
                <div className="user-info">
                  <p className="name">Ankush Singh</p>
                  <p className="role">Factory Director</p>
                </div>
              </div>
            </div>
          </aside>
          <main className="content-area">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
