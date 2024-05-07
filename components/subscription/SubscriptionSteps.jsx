import React from 'react';

const SubscriptionSteps = ({steps, currentStep, changeStep}) => {

  return (
    <div className="subscription__steps">
      {steps.map((step, index) =>
        <div key={step.id} className="subscription__step">
          <button onClick={() => changeStep(step.id - 1)} disabled={currentStep === step.id - 1}>
            {step.id} {step.title}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionSteps;
