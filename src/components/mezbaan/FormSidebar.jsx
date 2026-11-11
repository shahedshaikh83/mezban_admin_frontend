import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  PanelLeftClose, 
  PanelLeftOpen, 
  X,
  Menu
} from 'lucide-react';
import SidebarStepItem from './SidebarStepItem';
import { getSidebarCollapsedState, setSidebarCollapsedState } from '../../lib/quotationStorage';

export default function FormSidebar({
  steps = [],
  currentStep = 1,
  completedSteps = new Set(),
  onStepClick,
  onBackToPortal,
  isMobileOpen = false,
  onCloseMobile
}) {
  const [isCollapsed, setIsCollapsed] = useState(() => getSidebarCollapsedState());

  useEffect(() => {
    setSidebarCollapsedState(isCollapsed);
  }, [isCollapsed]);

  const toggleCollapse = (e) => {
    e?.stopPropagation();
    setIsCollapsed(prev => !prev);
  };

  const handleCardClick = (e) => {
    // If collapsed and user clicks the empty area, expand it
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  // Progress Calculation
  const totalSteps = steps.length || 12;
  const completedCount = completedSteps.size;
  const progressPercent = Math.max(Math.round(((currentStep - 1) / totalSteps) * 100), Math.round((completedCount / totalSteps) * 100));

  const sidebarContent = (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-2xl border border-gray-200/90 shadow-sm flex flex-col transition-all duration-300 ease-in-out select-none
        ${isCollapsed ? 'w-[76px] p-2.5 cursor-pointer' : 'w-[300px] p-4'}
      `}
      style={{ maxHeight: 'calc(100vh - 120px)' }}
    >
      {/* Sidebar Header */}
      <div className="pb-3 border-b border-gray-100 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-gray-900">Form Steps</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  Step {currentStep} of {totalSteps}
                </span>
                <button
                  type="button"
                  onClick={toggleCollapse}
                  aria-expanded={!isCollapsed}
                  aria-label="Collapse sidebar"
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B4D3A]/20"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={toggleCollapse}
                aria-expanded={!isCollapsed}
                aria-label="Expand sidebar"
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B4D3A]/20"
              >
                <PanelLeftOpen className="w-4 h-4 text-[#0B4D3A]" />
              </button>
              <span className="text-[10px] font-bold text-gray-500">
                {currentStep}/{totalSteps}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {!isCollapsed ? (
          <div className="flex flex-col gap-1 mt-0.5">
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#0B4D3A] h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.max(progressPercent, 6)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold">
              <span className="text-gray-400">Step {currentStep}</span>
              <span className="text-[#0B4D3A]">{progressPercent}% Completed</span>
            </div>
          </div>
        ) : (
          <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
            <div
              className="bg-[#0B4D3A] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(progressPercent, 6)}%` }}
            />
          </div>
        )}
      </div>

      {/* Steps List (Scrollable internally) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-2 space-y-1 pr-0.5 scrollbar-thin">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = completedSteps.has(stepNum);

          return (
            <SidebarStepItem
              key={step.id || stepNum}
              step={step}
              stepNumber={stepNum}
              isActive={isActive}
              isCompleted={isCompleted}
              isCollapsed={isCollapsed}
              onClick={(e) => {
                e.stopPropagation();
                onStepClick(stepNum);
                if (onCloseMobile) onCloseMobile();
              }}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:flex flex-col gap-3 sticky top-20 shrink-0 self-start transition-all duration-300">
        {/* Above Sidebar: Back to Portal button */}
        <button
          type="button"
          onClick={onBackToPortal}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-xs font-semibold rounded-xl border border-gray-200/90 shadow-2xs transition-colors duration-150 w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
          <span>Back to Portal</span>
        </button>

        {/* Sidebar Container */}
        {sidebarContent}
      </div>

      {/* Mobile Drawer (When isMobileOpen is true) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={onCloseMobile}
          />

          {/* Drawer content */}
          <div className="relative z-10 w-[310px] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-base">Requirement Steps</span>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pt-3 space-y-1">
              {steps.map((step, idx) => {
                const stepNum = idx + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = completedSteps.has(stepNum);

                return (
                  <SidebarStepItem
                    key={step.id || stepNum}
                    step={step}
                    stepNumber={stepNum}
                    isActive={isActive}
                    isCompleted={isCompleted}
                    isCollapsed={false}
                    onClick={() => {
                      onStepClick(stepNum);
                      if (onCloseMobile) onCloseMobile();
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
