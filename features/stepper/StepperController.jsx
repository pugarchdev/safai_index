"use client";
import React, { useState } from 'react';

// Discovery Components
import DiscoveryWizard from './components/discovery/DiscoveryWizard';
import DiscoveryMapPreview from './components/discovery/DiscoveryMapPreview';

// Setup Components
import StepperNav from './components/StepperNav';
import HierarchyStep from './components/setup/HierarchyStep';
import WashroomsStep from './components/setup/WashroomsStep';
import UsersStep from './components/setup/UsersStep';
import AppPreviewStep from './components/setup/AppPreviewStep';
import DashboardStep from './components/setup/DashboardStep';
import WelcomeTourModal from './components/discovery/WelcomeTourModal';
export default function StepperController() {
  // --- Global Flow State ---
  // 'discovery' for the initial questions, 'setup' for the main 5 steps
  const [phase, setPhase] = useState('discovery');
  const [currentStep, setCurrentStep] = useState(1);
const [showTour, setShowTour] = useState(true);
  // --- Data Payload State ---
  const [discoveryAnswers, setDiscoveryAnswers] = useState({});
  const [setupData, setSetupData] = useState({
    nodes: [],
    washrooms: [],
    users: []
  });


const handleTourComplete = () => {
  setShowTour(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

  // --- Handlers ---
  const handleDiscoveryComplete = () => {
    // Transition from Phase 1 to Phase 2
    setPhase('setup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = (stepData, dataKey) => {
    // Save the data from the current step
    if (dataKey) {
      setSetupData(prev => ({ ...prev, [dataKey]: stepData }));
    }
    // Advance to next step
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (stepId) => {
    setCurrentStep(stepId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Render Functions ---
const renderDiscoveryPhase = () => (
    <>
      {showTour ? (
        <WelcomeTourModal onComplete={handleTourComplete} />
      ) : (
        <DiscoveryWizard
          answers={discoveryAnswers}
          onAnswerChange={setDiscoveryAnswers}
          onComplete={handleDiscoveryComplete}
        />
      )}
    </>
  );

  const renderSetupPhase = () => (
    <div className="w-full min-h-full bg-[#F5F7FA] flex flex-col">
      <StepperNav currentStep={currentStep} onStepChange={handleNavClick} />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {currentStep === 1 && (
          <HierarchyStep
            initialNodes={setupData.nodes}
            discoveryProfile={discoveryAnswers.facilityType}
            onNext={(nodes) => handleNextStep(nodes, 'nodes')}
          />
        )}

        {currentStep === 2 && (
          <WashroomsStep
            nodes={setupData.nodes}
            initialWashrooms={setupData.washrooms}
            onNext={(washrooms) => handleNextStep(washrooms, 'washrooms')}
            onBack={handlePrevStep}
          />
        )}

        {currentStep === 3 && (
          <UsersStep
            nodes={setupData.nodes}
            washrooms={setupData.washrooms}
            initialUsers={setupData.users}
            onNext={(users) => handleNextStep(users, 'users')}
            onBack={handlePrevStep}
          />
        )}

        {currentStep === 4 && (
          <AppPreviewStep
            summary={{
              zones: setupData.nodes.filter(n => n.type === 'zone').length || setupData.nodes.length,
              staff: setupData.users?.length || 0,
              washrooms: setupData.washrooms?.length || 0,
              cleaners: setupData.users?.filter(u => u.role === 'cleaner').length || 0
            }}
            onNext={() => handleNextStep(null, null)}
            onBack={handlePrevStep}
          />
        )}

        {currentStep === 5 && (
          <DashboardStep onBack={handlePrevStep} />
        )}
      </main>
    </div>
  );

  return phase === 'discovery' ? renderDiscoveryPhase() : renderSetupPhase();
}