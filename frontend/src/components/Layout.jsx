import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    if (!user) {
        return <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            {children}
        </div>;
    }

    // Role-specific redirect if trying to access pages without permissions handled by PrivateRoute already.
    // However, if user is kiosk role, maybe sidebar shouldn't show? Or limited sidebar.
    // For kiosk, we might want a totally different layout.
    if (user.role === 'kiosk') {
        return <div className="min-h-screen bg-slate-50 flex flex-col p-4">{children}</div>;
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar Desktop */}
            <div className="hidden md:block w-64 flex-shrink-0">
                <Sidebar />
            </div>

            {/* Sidebar Mobile */}
            <div className={`md:hidden fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar />
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header Mobile */}
                <div className="md:hidden flex items-center justify-between bg-white border-b px-4 py-3">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 rounded-md hover:bg-gray-100">
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-gray-800">VoiceTriage AI</span>
                    <div className="w-8"></div> {/* Spacer */}
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
