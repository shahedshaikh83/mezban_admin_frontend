import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PlanEventModal from './components/PlanEventModal';
import AdminOS from './pages/AdminOS';
import CustomerRequirementPage from './pages/CustomerRequirementPage';
import CustomerQuotationPage from './pages/CustomerQuotationPage';

export default function App() {
  const [activePortal, setActivePortalState] = useState('customer-requirement'); // 'customer-requirement' | 'quotation' | 'admin'
  const [adminSection, setAdminSection] = useState('dashboard'); // 'dashboard' | 'customer' | 'vendor' | 'database' | 'schema'
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Parse location hash and pathname for direct URL access and browser refresh
  const parseRouteFromHash = useCallback(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const pathname = window.location.pathname.replace(/^\//, '').toLowerCase();

    const target = hash || pathname;

    if (!target || target === 'website' || 
      target === 'customer-requirement' || 
      target === 'customer-requirements' || 
      target === 'requirements' || 
      target === 'requirement'
    ) {
      setActivePortalState('customer-requirement');
    } else if (target === 'quotation' || target === 'quotations') {
      setActivePortalState('quotation');
    } else if (target.startsWith('admin')) {
      setActivePortalState('admin');
      const parts = target.split('/');
      const section = parts[1];
      if (['dashboard', 'customer', 'vendor', 'database', 'schema'].includes(section)) {
        setAdminSection(section);
      } else {
        setAdminSection('dashboard');
      }
    } else if (['customer', 'vendor', 'database', 'schema'].includes(target)) {
      // Legacy redirects into Admin OS
      setActivePortalState('admin');
      setAdminSection(target);
    } else {
      setActivePortalState('customer-requirement');
    }
  }, []);

  // Sync route on mount and listen to hashchange & popstate events
  useEffect(() => {
    parseRouteFromHash();
    window.addEventListener('hashchange', parseRouteFromHash);
    window.addEventListener('popstate', parseRouteFromHash);
    return () => {
      window.removeEventListener('hashchange', parseRouteFromHash);
      window.removeEventListener('popstate', parseRouteFromHash);
    };
  }, [parseRouteFromHash]);

  // Unified navigation handler
  const navigateTo = (portal, section = null) => {
    if (portal === 'customer-requirement' || portal === 'requirements' || portal === 'website') {
      setActivePortalState('customer-requirement');
      if (window.location.hash !== '#/customer-requirement') {
        window.history.pushState(null, '', '#/customer-requirement');
      }
    } else if (portal === 'quotation') {
      setActivePortalState('quotation');
      if (window.location.hash !== '#/quotation') {
        window.history.pushState(null, '', '#/quotation');
      }
    } else if (portal === 'admin') {
      setActivePortalState('admin');
      const targetSection = section || adminSection || 'dashboard';
      setAdminSection(targetSection);
      const targetHash = `#/admin/${targetSection}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
    } else if (['customer', 'vendor', 'database', 'schema'].includes(portal)) {
      setActivePortalState('admin');
      setAdminSection(portal);
      window.history.pushState(null, '', `#/admin/${portal}`);
    }
  };

  const handleAdminSectionChange = (section) => {
    setAdminSection(section);
    window.history.pushState(null, '', `#/admin/${section}`);
  };

  const handleEventCreated = (eventInfo) => {
    console.log('Event successfully registered:', eventInfo);
  };

  const handleOpenQuotation = () => {
    setIsPlanModalOpen(false);
    navigateTo('quotation');
  };

  const openRequirementSheet = () => {
    navigateTo('customer-requirement');
  };

  // Standalone full-width experience for Customer Requirement and Quotation pages
  if (activePortal === 'customer-requirement') {
    return (
      <>
        <CustomerRequirementPage
          onNavigatePortal={navigateTo}
          onOpenPlanModal={() => setIsPlanModalOpen(true)}
          onOpenQuotationPage={() => navigateTo('quotation')}
        />
        <PlanEventModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          onEventCreated={handleEventCreated}
          onOpenQuotation={handleOpenQuotation}
        />
      </>
    );
  }

  if (activePortal === 'quotation') {
    return (
      <>
        <CustomerQuotationPage
          onNavigatePortal={navigateTo}
          onOpenPlanModal={() => setIsPlanModalOpen(true)}
        />
        <PlanEventModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          onEventCreated={handleEventCreated}
          onOpenQuotation={handleOpenQuotation}
        />
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Header: Customer Requirement, Admin OS + Plan My Event */}
      <Navbar
        activePortal={activePortal}
        setActivePortal={navigateTo}
        openPlanModal={() => setIsPlanModalOpen(true)}
        openRequirementSheet={openRequirementSheet}
      />

      {/* Main View Router */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Admin OS */}
        {activePortal === 'admin' && (
          <AdminOS
            activeSection={adminSection}
            onSectionChange={handleAdminSectionChange}
            openPlanModal={() => setIsPlanModalOpen(true)}
            onNavigatePortal={navigateTo}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        setActivePortal={navigateTo}
        openPlanModal={() => setIsPlanModalOpen(true)}
      />

      {/* Interactive Requirement Planner Modal */}
      <PlanEventModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onEventCreated={handleEventCreated}
        onOpenQuotation={handleOpenQuotation}
      />
    </div>
  );
}
