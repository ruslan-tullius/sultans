import React from 'react';
import products from '../../../data/products.json';

const SubscriptionBox = ({updateItem, itemCounts, clearBox, totalQuantity, handleSubmit, loading, bundleSize, isDisabled}) => {

  const getDisabledText = () => {
    const remainingItems = bundleSize - totalQuantity;
    return window.sultans.Strings.subscription.box.continueButtonDisabled.replace('[count]', remainingItems);
  };

  return (
    <div className="subscription-items__box">
      <div className="subscription-items__box-container">
        <div className="subscription-items__box-header">
          <div className="subscription-items__box-title">{window.sultans.Strings.subscription.box.title}</div>
          <div className="subscription-items__box-count">{totalQuantity}/{bundleSize}</div>
          { totalQuantity > 0 && <button className="subscription-items__box-btn-clear" onClick={clearBox}>{window.sultans.Strings.subscription.box.clearButton}</button>}
        </div>
        <div className="subscription-items__box-content">
          { totalQuantity <= 0 && <div className="subscription-items__box-empty">{window.sultans.Strings.subscription.box.emptyText}</div>}
          {products.products.map((product, index) => (
            itemCounts[index] > 0 && (
              <div key={product.id} className="subscription-items__box-item">
                <img src={product.image.src} alt={product.title} className="subscription-items__box-image" />
                <div className="subscription-items__box-info">
                  <div className="subscription-items__box-item-name">{product.title}</div>
                  <div className="subscription-item__quantity box-quantity">
                    <button className="quantity-btn box-quantity-btn decrement-btn" onClick={() => updateItem(index, -1)} disabled={loading}>-</button>
                    <input type="text" className="quantity-input box-quantity-input" value={itemCounts[index]} disabled readOnly />
                    <button className="quantity-btn box-quantity-btn increment-btn" onClick={() => updateItem(index, 1)} disabled={isDisabled}>+</button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
        <button className={`subscription-items__box-btn-continue ${loading ? 'fading' : ''}`} onClick={handleSubmit} disabled={!isDisabled}>
          {loading ? 'Loading...' :

            ( totalQuantity >= bundleSize ? window.sultans.Strings.subscription.box.continueButton : getDisabledText())}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionBox;
