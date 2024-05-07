import React, {useEffect, useState} from 'react';
import products from '../../data/products.json';
import SubscriptionBox from '../SubscriptionBox.jsx';
import SubscriptionItem from "../SubscriptionItem.jsx";
const SubscriptionItems = ({setItemsInBox, itemsInBox, bundleProduct}) => {
  const MAX_ITEMS = 12; // Maximum number of items that can be selected

  // State for tracking counts of each item and loading status
  const [itemCounts, setItemCounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize item counts from storage
  useEffect(() => {
    const storedItems = itemsInBox || [];
    const initialCounts = products.products.map(product => {
      const item = storedItems.find(si => si.id === product.id);
      return item ? item.quantity : 0;
    });
    setItemCounts(initialCounts);
  }, []);

  // Initialize item counts from external storage or input
  useEffect(() => {
    const cartItems = products.products.map((product, index) => ({
      id: product.id,
      variantId: product.variants[0].id,
      price: product.variants[0].price,
      title: product.title,
      image: product.image.src,
      quantity: itemCounts[index]
    })).filter(item => item.quantity > 0);
    setItemsInBox(cartItems);
  }, [itemCounts]);

  // Calculate the total number of added items
  const totalAddedItems = itemCounts.reduce((acc, count) => acc + count, 0);

  // Function to update the count of items either by increasing or decreasing
  const updateItemCount = (index, change) => {
    setItemCounts(currentCounts => {
      const newCounts = [...currentCounts];
      const newCount = Math.max(0, newCounts[index] + change);

      if ((totalAddedItems >= MAX_ITEMS && change > 0) || newCount < 0) {
        return currentCounts;
      }
      newCounts[index] = newCount;
      return newCounts;
    });
  };

  // Function to remove all selected items
  const clearBox = () => {
    setItemCounts(products.products.map(() => 0));
  };

  // Prepares bundle data for cart addition
  const bundleCreationProduct = {
    "id": bundleProduct.bundleProductId,
    "quantity": 1,
    "properties": {
      '_bundleData': JSON.stringify(itemsInBox)
    }
  };

  // Add the bundle to the cart using Shopify's API
  const addToCart = async () => {
    const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bundleCreationProduct)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Handle the submission and redirect to cart on success
  const handleSubmit = async () => {
    setLoading(true);

    // TODO: Implement Checkout Functions - Expand operation to further process the bundle.
    //  See Shopify documentation for details:
    //  https://shopify.dev/docs/api/functions/reference/cart-transform#example-expand-operation
    addToCart()
      .then(result => {
        window.location.href = '/cart';
      })
      .catch(error => {
        console.error('Failed to add product to cart:', error);
      });
  }

  return (
    <div className="subscription-items">
      <div className="subscription-items__wrap page-width">
        <div className="subscription-items__list">
          {products.products.map((product, index) => (
            <SubscriptionItem
              key={product.id}
              index={index}
              product={product}
              MAX_ITEMS={MAX_ITEMS}
              itemCounts={itemCounts}
              updateItemCount={updateItemCount}
              loading={loading}
            />
          ))}
        </div>

        <SubscriptionBox
          updateItemCount={updateItemCount}
          itemCounts={itemCounts}
          clearBox={clearBox}
          totalAddedItems={totalAddedItems}
          MAX_ITEMS={MAX_ITEMS}
          handleSubmit={handleSubmit}
          loading={loading}
        />

      </div>
    </div>
  );
};

export default SubscriptionItems;
