import React, {useEffect, useState} from "react";
import {createRoot} from 'react-dom/client';
import SubscriptionSteps from './SubscriptionSteps.jsx';
import SubscriptionCheck from './steps/SubscriptionCheck.jsx';
import SubscriptionItemList from './steps/SubscriptionItemList/SubscriptionItemList.jsx';

const Subscription = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);

  const bundleProductEl = document.getElementById('bundle-product');
  const bundleProduct = bundleProductEl ? JSON.parse(bundleProductEl.textContent) : {};

  const bundleSize = bundleProduct.bundleSize; // The number of items that should be selected

  // Configuration of the steps in the subscription process
  const steps = [
    { id: 1, title: window.sultans.Strings.subscription.step1, component:  SubscriptionCheck},
    { id: 2, title: window.sultans.Strings.subscription.step2, component:  SubscriptionItemList }
  ];

  // Prepares bundle data for cart addition
  // TODO: Implement Checkout Functions - Expand operation to further process the bundle.
  //  See Shopify documentation for details:
  //  https://shopify.dev/docs/api/functions/reference/cart-transform#example-expand-operation
  const bundleProductData = {
    "id": bundleProduct.variantId,
    "quantity": 1,
    "properties": {
      '_bundleData': JSON.stringify(selectedProducts)
    }
  };

  // Add the bundle to the cart using Shopify's API
  const addToCart = async () => {
    const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bundleProductData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Function to handle the change of step, saving the data passed from each step
  const handleStepChange = (data) => {
    setSubscriptionData(prevData => [
      ...prevData,
      data
    ]);

    if (currentStep + 1 >= steps.length) {
      addToCart()
        .then(result => {
          window.location.href = '/cart';
        })
        .catch(error => {
          console.error('Failed to add product to cart:', error);
        });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    console.log('subscriptionData', subscriptionData);
  }, [subscriptionData]);

  const changeStep = (stepId) => {
    if (stepId !== currentStep) {
      setCurrentStep(stepId);
    }
  };

  // Dynamically determine the component to render based on the current step
  const SubscriptionStep = steps[currentStep].component;

  return (
    <div>
      {currentStep > 0 && <SubscriptionSteps steps={steps} currentStep={currentStep} changeStep={changeStep}/>}
      <SubscriptionStep
        step={steps[currentStep]}
        onCompleted={handleStepChange}
        setSelectedProducts={setSelectedProducts}
        selectedProducts={selectedProducts}
        bundleProduct={bundleProduct}
        bundleSize={bundleSize}
      />
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