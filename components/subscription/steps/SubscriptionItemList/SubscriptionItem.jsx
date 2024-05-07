import React from 'react';

const SubscriptionItem = ({product, index, itemCounts, updateItem, loading, isDisabled}) => {
  return (
    <div className="subscription-item">
      <div className="subscription-item__top">
        <img src={product.image.src} alt={product.title} className="subscription-item__image"/>
        <h3 className="subscription-item__name">{product.title}</h3>
      </div>
      <div className="subscription-item__bottom">
        <p className="subscription-item__description">{product.body_html.replace(/<[^>]*>/g, '')}</p>

        {itemCounts[index] === 0 ? (
          <button className="subscription-item__button" onClick={() => updateItem(index, 1)}
                  disabled={isDisabled}>
            {window.sultans.Strings.subscription.items.addToBox}
          </button>
        ) : (
          <div className="subscription-item__quantity">
            <button className="quantity-btn decrement-btn" onClick={() => updateItem(index, -1)}
                    disabled={loading}>-
            </button>
            <input type="text" className="quantity-input" value={itemCounts[index]} disabled readOnly/>
            <button className="quantity-btn increment-btn" onClick={() => updateItem(index, 1)}
                    disabled={isDisabled}>+
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionItem;
