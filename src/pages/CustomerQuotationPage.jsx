import React, { useState, useEffect } from 'react';
import CustomerQuotationView from '../components/quotation/CustomerQuotationView';
import AnnouncementBar from '../components/mezbaan/AnnouncementBar';
import Header from '../components/mezbaan/Header';
import { 
  getQuotation, 
  getRequirement, 
  generateQuotationFromRequirement,
  saveQuotation 
} from '../lib/quotationStorage';

export default function CustomerQuotationPage({ onNavigatePortal, onOpenPlanModal }) {
  const [quotation, setQuotation] = useState(() => {
    const existing = getQuotation();
    if (existing && existing.quoteItems && existing.quoteItems.length > 0) {
      return existing;
    }
    const req = getRequirement();
    if (req) {
      const generated = generateQuotationFromRequirement(req);
      saveQuotation(generated);
      return generated;
    }
    return null;
  });

  const [quoteItems, setQuoteItems] = useState(quotation?.quoteItems || []);
  const [quoteSummary, setQuoteSummary] = useState(quotation?.quoteSummary || {
    totalCost: 0,
    totalPrice: 0,
    mezbaanMargin: 0,
    advanceRequired: 0,
    marginPct: 0
  });

  const handleEditRequirements = () => {
    if (onNavigatePortal) {
      onNavigatePortal('customer-requirement');
    } else {
      window.location.hash = '#/customer-requirement';
    }
  };

  const handleSaveDraft = (updatedItems, updatedSummary) => {
    const updated = {
      ...(quotation || {}),
      quoteItems: updatedItems || quoteItems,
      quoteSummary: updatedSummary || quoteSummary,
      updatedAt: new Date().toISOString()
    };
    saveQuotation(updated);
    setQuotation(updated);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#1F2937] font-['Inter',sans-serif] flex flex-col">
      <AnnouncementBar />
      <Header 
        activeTab="customer-requirement"
        onNavigate={onNavigatePortal}
        onOpenPlanModal={onOpenPlanModal}
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <CustomerQuotationView
          formData={quotation?.requirement || getRequirement() || {}}
          quoteItems={quoteItems}
          setQuoteItems={(items) => {
            setQuoteItems(items);
            handleSaveDraft(items, quoteSummary);
          }}
          quoteSummary={quoteSummary}
          setQuoteSummary={(summary) => {
            setQuoteSummary(summary);
            handleSaveDraft(quoteItems, summary);
          }}
          onEditRequirements={handleEditRequirements}
          onSaveDraft={() => handleSaveDraft(quoteItems, quoteSummary)}
          onClose={handleEditRequirements}
        />
      </main>
    </div>
  );
}
