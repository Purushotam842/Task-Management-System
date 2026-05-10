import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import useTheme from '../hooks/useTheme';
import './DashboardLayout.css';


const DashboardLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="dashboard-layout">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="dashboard-content">
                <header className="dashboard-header">
                    <button 
                        className="mobile-menu-btn"
                        onClick={toggleSidebar}
                        aria-label="Toggle menu"
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className="header-search">
                        <input type="text" placeholder="Search projects or tasks..." className="form-input" />
                    </div>
                    <div className="header-actions">
                        <button
                            type="button"
                            className="theme-toggle"
                            onClick={toggleTheme}
                            aria-label="Toggle dark mode"
                            title="Toggle theme"
                        >
                            {theme === 'dark' ? 'Dark' : 'Light'}
                        </button>

                        <button className="btn btn-primary">
                            <span>New Project</span>
                        </button>
                    </div>
                </header>
                <div className="content-inner">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};


export default DashboardLayout;
