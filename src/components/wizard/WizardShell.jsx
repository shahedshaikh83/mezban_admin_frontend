import React, { useRef, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, Check, Sparkles, RefreshCw, 
  Trash2, Shield, AlertCircle
} from 'lucide-react';

export default function WizardShell({
  currentStep = 0,
  onStepChange,
  steps = [],
  visitedSteps = new Set([0]),
  onNext,
  onPrev,
  isSubmitting = false,
  onClose,
  onFillSample,
  onClearForm,
  onInstantEstimate,
  children
}) {
  const formTopRef = useRef(null);
  const currentStepData = steps[currentStep] || steps[0];
  const totalSteps = steps.length;
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  // Scroll to top of the form on step change
  useEffect(() => {
    if (formTopRef.current) {
      const topOffset = formTopRef.current.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
    }
  }, [currentStep]);

  return (
    <div style={{
      background: '#fbf9f5',
      minHeight: '100vh',
      padding: '16px 8px 80px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div ref={formTopRef} style={{ maxWidth: 960, margin: '0 auto' }}>
        
        {/* ============================================================== */}
        {/* TOP ACTION BAR: PORTAL, BADGE, SAMPLE FILL & CLEAR FORM */}
        {/* ============================================================== */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 8,
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <ArrowLeft size={16} /> Back to Portal
              </button>
            )}

            <div>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#d4af37',
                background: '#0f3d2e',
                padding: '2px 8px',
                borderRadius: 4,
                letterSpacing: '0.5px'
              }}>
                INTERNAL ADMIN INTAKE
              </span>
              <h1 style={{
                margin: '3px 0 0',
                fontSize: '1.3rem',
                color: '#0f3d2e',
                fontWeight: 800
              }}>
                Customer Requirement Sheet
              </h1>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {onInstantEstimate && (
              <button
                type="button"
                onClick={onInstantEstimate}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  background: 'linear-gradient(135deg, #0f3d2e 0%, #164e3b 100%)',
                  border: '1.5px solid #d4af37',
                  color: '#ffffff',
                  borderRadius: 6,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(15, 61, 46, 0.2)'
                }}
              >
                <Sparkles size={14} color="#d4af37" /> Open Estimated Budget Page
              </button>
            )}

            <button
              type="button"
              onClick={onFillSample}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                color: '#92400e',
                borderRadius: 6,
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Sparkles size={15} /> Fill Sample (Beed Walima)
            </button>

            <button
              type="button"
              onClick={onClearForm}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                background: '#ffffff',
                border: '1px solid #d1d5db',
                color: '#6b7280',
                borderRadius: 6,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={14} /> Clear Form
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PROGRESS BAR & STEPPER HEADER */}
        {/* ============================================================== */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #dcd3c4',
          borderRadius: 8,
          padding: '16px 18px',
          marginBottom: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          {/* Step Meta Info */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
            flexWrap: 'wrap',
            gap: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                background: '#0f3d2e',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.8rem',
                padding: '3px 10px',
                borderRadius: '12px',
                letterSpacing: '0.3px'
              }}>
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span style={{
                fontWeight: 800,
                fontSize: '0.98rem',
                color: '#1a1a1a'
              }}>
                {currentStepData.title}
              </span>
            </div>

            <span style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#0f3d2e'
            }}>
              {progressPercent}% Completed
            </span>
          </div>

          {/* Progress Bar Line */}
          <div style={{
            width: '100%',
            height: 6,
            background: '#e5e7eb',
            borderRadius: 3,
            overflow: 'hidden',
            marginBottom: 14
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #d4af37 0%, #0f3d2e 100%)',
              borderRadius: 3,
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Stepper Navigation: Responsive step pill bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            overflowX: 'auto',
            paddingBottom: 4,
            scrollbarWidth: 'thin'
          }}>
            {steps.map((s, idx) => {
              const isActive = idx === currentStep;
              const isCompleted = visitedSteps.has(idx) && idx < currentStep;
              const isVisited = visitedSteps.has(idx);

              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => {
                    // Allow clicking any visited step or completed step
                    if (isVisited || idx <= currentStep) {
                      onStepChange(idx);
                    }
                  }}
                  disabled={!isVisited && idx > currentStep}
                  title={`${s.letter}. ${s.title}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 32,
                    height: 32,
                    padding: '0 8px',
                    borderRadius: 16,
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 800 : 600,
                    cursor: (isVisited || idx <= currentStep) ? 'pointer' : 'default',
                    border: isActive 
                      ? '2px solid #0f3d2e' 
                      : isCompleted 
                        ? '1.5px solid #10b981' 
                        : '1px solid #d1d5db',
                    background: isActive 
                      ? '#0f3d2e' 
                      : isCompleted 
                        ? '#ecfdf5' 
                        : '#ffffff',
                    color: isActive 
                      ? '#ffffff' 
                      : isCompleted 
                        ? '#047857' 
                        : '#6b7280',
                    transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}
                >
                  {isCompleted ? (
                    <Check size={14} color="#059669" strokeWidth={3} />
                  ) : (
                    <span>{s.letter}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* MAIN STEP FORM CONTAINER */}
        {/* ============================================================== */}
        <div className="wizard-card">
          {/* Smooth Step Transition Wrapper */}
          <div
            key={currentStep}
            className="fade-in"
            style={{
              minHeight: 280,
              animation: 'fadeIn 0.25s ease-out forwards'
            }}
          >
            {children}
          </div>

          {/* ============================================================== */}
          {/* BOTTOM STEP NAVIGATION BAR */}
          {/* ============================================================== */}
          <div style={{
            borderTop: '2px solid #f3efe6',
            marginTop: 32,
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12
          }}>
            {/* Previous Button on the LEFT */}
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={onPrev}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 6,
                  background: '#ffffff',
                  border: '1.5px solid #d1d5db',
                  color: '#374151',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
              >
                <ArrowLeft size={16} /> Previous
              </button>
            ) : (
              <div /> /* Spacer when step A */
            )}

            {/* Next / Submit Button on the RIGHT */}
            {currentStep < totalSteps - 1 ? (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                {onInstantEstimate && (
                  <button
                    type="button"
                    onClick={onInstantEstimate}
                    disabled={isSubmitting}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '11px 18px',
                      borderRadius: 6,
                      background: '#fffdf7',
                      border: '1.5px solid #d4af37',
                      color: '#0f3d2e',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <Sparkles size={15} color="#d4af37" /> Submit & Open Estimated Budget
                  </button>
                )}
                <button
                  type="button"
                  onClick={onNext}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 28px',
                    borderRadius: 6,
                    background: '#0f3d2e',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(15, 61, 46, 0.25)',
                    transition: 'background 0.15s'
                  }}
                >
                  Next Step ({steps[currentStep + 1]?.letter}) <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              /* LAST STEP: Submit Button */
              <button
                type="button"
                onClick={onNext}
                disabled={isSubmitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '14px 28px',
                  borderRadius: 30,
                  background: 'linear-gradient(135deg, #0f3d2e 0%, #164e3b 100%)',
                  border: '2px solid #d4af37',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: 'clamp(0.88rem, 2.8vw, 1.05rem)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 24px rgba(15, 61, 46, 0.35)',
                  transition: 'all 0.2s ease',
                  maxWidth: '100%',
                  textAlign: 'center',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  letterSpacing: '0.02em'
                }}
              >
                {isSubmitting ? (
                  <RefreshCw size={18} className="spin" />
                ) : (
                  <Sparkles size={20} color="#d4af37" />
                )}
                SUBMIT & OPEN ESTIMATED BUDGET PAGE
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
