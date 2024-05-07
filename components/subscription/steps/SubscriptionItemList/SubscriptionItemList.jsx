import React, {useEffect, useMemo, useState} from 'react';
import products from '../../../data/products.json';
import SubscriptionBox from './SubscriptionBox.jsx';
import SubscriptionItem from "./SubscriptionItem.jsx";
const SubscriptionItemList = ({setSelectedProducts, selectedProducts, bundleSize, onCompleted, step}) => {

  // State for tracking counts of each item and loading status
  const [itemCounts, setItemCounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalQuantity = useMemo(() => selectedProducts.reduce((acc, item) => acc + item.quantity, 0), [selectedProducts]);
  const isDisabled = useMemo(() => totalQuantity >= bundleSize || loading, [totalQuantity, loading]);

  // Initialize item counts from storage
  useEffect(() => {
    const initialCounts = products.products.map(product => {
      const item = selectedProducts.find(si => si.id === product.id);
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
    setSelectedProducts(cartItems);
  }, [itemCounts]);

  // Function to update the count of items either by increasing or decreasing
  const updateItem = (index, change) => {
    setItemCounts(currentCounts => {
      const newCounts = [...currentCounts];
      const newCount = Math.max(0, newCounts[index] + change);

      if ((totalQuantity >= bundleSize && change > 0) || newCount < 0) {
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

  // Handle the submission and redirect to cart on success
  const handleSubmit = async () => {
    setLoading(true);

    onCompleted({
      step: step.id,
      items: selectedProducts
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
              bundleSize={bundleSize}
              itemCounts={itemCounts}
              updateItem={updateItem}
              loading={loading}
              isDisabled={isDisabled}
            />
          ))}
        </div>

        <SubscriptionBox
          updateItem={updateItem}
          itemCounts={itemCounts}
          clearBox={clearBox}
          totalQuantity={totalQuantity}
          bundleSize={bundleSize}
          handleSubmit={handleSubmit}
          loading={loading}
          onCompleted={onCompleted}
          isDisabled={isDisabled}
        />

      </div>
    </div>
  );
};

export default SubscriptionItemList;
