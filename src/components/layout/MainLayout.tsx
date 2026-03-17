import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { cn } from '@/lib/utils';
import { NetworkStatusIndicator } from '@/components/ui/network-status-indicator';
import { QuickActionsFAB } from '@/components/ui/quick-actions-fab';
import { usePrefetchRoutes } from '@/hooks/usePrefetchRoutes';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const showBreadcrumb = location.pathname !== '/';

  // Initialize route prefetching
  usePrefetchRoutes();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <CommandPalette />

      {/* Network status indicator - fixed position */}
      <div className="fixed bottom-4 left-4 z-40">
        <NetworkStatusIndicator showDetails />
      </div>

      {/* Quick Actions FAB */}
      <QuickActionsFAB />

      <motion.main
        id="main-content"
        initial={false}
        animate={{
          marginLeft: sidebarCollapsed ? 72 : 280,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'min-h-screen transition-all duration-300',
          showBreadcrumb ? 'pt-[104px]' : 'pt-16'
        )}
      >
        <div className="p-6">{children}</div>
      </motion.main>
    </div>
  );
};
