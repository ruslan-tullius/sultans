import React, {useState} from "react";
import {createRoot} from 'react-dom/client';
import SubscriptionCheck from './steps/SubscriptionCheck.jsx';
import SubscriptionItems from './steps/SubscriptionItems.jsx';

const Subscription = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [itemsInBox, setItemsInBox] = useState([]);

  const bundleProductEl = document.getElementById('bundle-product');
  const bundleProduct = bundleProductEl ? JSON.parse(bundleProductEl.textContent) : {};

  // Configuration of the steps in the subscription process
  const steps = [
    { id: 1, title: window.sultans.Strings.subscription.step1, component:  SubscriptionCheck},
    { id: 2, title: window.sultans.Strings.subscription.step2, component:  SubscriptionItems }
  ];

  // Function to handle the change of step, saving the data passed from each step
  const handleStepChange = () => {
    setCurrentStep(i => ++i);
  };

  const changeStep = (stepId) => {
    if (stepId !== currentStep) {
      setCurrentStep(stepId);
    }
  };

  // Dynamically determine the component to render based on the current step
  const SubscriptionStep = steps[currentStep].component;

  return (
    <div>
      {currentStep > 0 &&
        <div className="subscription__steps">
          {steps.map((step, index) =>
            <div key={step.id} className="subscription__step">
              <button onClick={() => changeStep(step.id - 1)} disabled={currentStep === step.id - 1}>
                {step.id} {step.title}
              </button>
            </div>
          )}
        </div>
      }
      <SubscriptionStep step={steps[currentStep]} onCompleted={handleStepChange} setItemsInBox={setItemsInBox} itemsInBox={itemsInBox} bundleProduct={bundleProduct} />
    </div>
  );
};

document.querySelectorAll('[data-subscription]').forEach((container) => {
  const root = createRoot(container);
  root.render(
    <Subscription
      id={container.dataset.id}
    />,
  );
});