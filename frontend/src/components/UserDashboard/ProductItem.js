// REACT IMPORTS - Core React functionality and state management hooks
import React, { useState } from 'react';
//import { cartAPI, getProductImageUrl } from '../../services/api';  // API services for cart and images
import './ProductItem.css';  // Component-specific styles
import { cartAPI } from '../../services/api/cart.api';
import { getProductImageUrl } from '../../services/api/api.config';

// PRODUCT ITEM COMPONENT - Individual fragrance display with cart functionality for I Smell Shop
const ProductItem = ({ product, showNotification }) => {
  // STATE MANAGEMENT - Component state variables
  const [addingToCart, setAddingToCart] = useState(false);      // Cart addition loading state
  const [showCartPopup, setShowCartPopup] = useState(false);    // Quantity selection popup visibility
  const [quantity, setQuantity] = useState(1);                  // Selected product quantity

  // ADD TO CART HANDLER - Open quantity selection popup
  const handleAddToCart = async () => {
    if (product.stock < 1) return;  // Prevent action if fragrance is out of stock

    // Show the cart popup for quantity selection
    setShowCartPopup(true);
  };

  // CONFIRM ADD TO CART - Add selected quantity to cart
  const handleAddToCartConfirm = async () => {
    try {
      setAddingToCart(true);  // Start loading state for cart addition
      
      // API CALL - Add fragrance to cart with selected quantity
      await cartAPI.add({
        product_id: product.id,  // Fragrance identifier
        quantity: quantity       // Selected quantity
      });
      
      // SUCCESS NOTIFICATION - Confirm fragrance addition
      showNotification(`Added ${quantity} x ${product.name} to your fragrance cart successfully!`, 'success');
      
      // CLOSE POPUP AND RESET - Clean up popup state
      setShowCartPopup(false);  // Hide quantity selection popup
      setQuantity(1);           // Reset quantity to default
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Failed to add fragrance to cart', 'error');  // Updated error notification
    } finally {
      setAddingToCart(false);  // End loading state regardless of outcome
    }
  };

  // CLOSE POPUP HANDLER - Reset popup state
  const closeCartPopup = () => {
    setShowCartPopup(false);  // Hide quantity selection popup
    setQuantity(1);           // Reset quantity to default
  };

  // INCREASE QUANTITY HANDLER - Increment selected quantity
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);  // Increase quantity if within stock limits
    }
  };

  // DECREASE QUANTITY HANDLER - Decrement selected quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);  // Decrease quantity if above minimum
    }
  };

  // IMAGE URL HANDLING - Get fragrance image URL with fallback
  const imageUrl = getProductImageUrl(product.image);
  
  // TOTAL PRICE CALCULATION - Compute price for selected quantity
  const totalPrice = (product.price * quantity).toFixed(2);

  // COMPONENT RENDER - Fragrance card and popup interface
  return (
    <>
      {/* FRAGRANCE CARD - Main fragrance display */}
      <div className="product-item-card">
        
        {/* FRAGRANCE IMAGE SECTION - Product visual representation */}
        <div className="product-image-container">
          <img 
            src={imageUrl} 
            alt={product.name}  // Accessibility alt text
            className="product-image"
            onError={(e) => {
              // FALLBACK IMAGE - Show luxury placeholder if image fails to load
              e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
            }}
          />
          {/* LUXURY BADGE - Premium indicator */}
          <div className="luxury-badge">Premium</div>
        </div>
        
        {/* FRAGRANCE INFORMATION SECTION - Text details */}
        <div className="product-info">
          {/* FRAGRANCE NAME - Main product title */}
          <h3 className="product-name">{product.name}</h3>
          
          {/* FRAGRANCE DESCRIPTION - Product details with truncation */}
          <p className="product-description">
            {product.description ? 
              (product.description.length > 100 ? 
                `${product.description.substring(0, 100)}...` :  // Truncate long descriptions
                product.description  // Show full description if short
              ) : 
              'Experience luxury in every scent'  // Updated fallback for missing description
            }
          </p>
          
          {/* FRAGRANCE META SECTION - Price and stock information */}
          <div className="product-meta">
            {/* FRAGRANCE PRICE - Display product price */}
            <span className="product-price">{product.price} DH</span>
            {/* STOCK STATUS - Dynamic stock display with styling */}
            <span className={`product-stock ${product.stock > 0 ? 'stock-in' : 'stock-out'}`}>
              {product.stock > 0 ? `${product.stock} Bottles Available` : 'Out of Stock'}  {/* Updated stock text */}
            </span>
          </div>

          {/* FRAGRANCE NOTES - Display scent characteristics if available */}
          {product.notes && (
            <div className="fragrance-notes">
              <span className="notes-label">Scent Notes:</span>
              <span className="notes-value">{product.notes}</span>
            </div>
          )}
        </div>

        {/* ACTION BUTTON SECTION - Add to cart functionality */}
        <div className="product-actions">
          <button
            className={`product-btn ${product.stock < 1 ? 'btn-out-of-stock' : 'btn-add-cart'}`}
            onClick={handleAddToCart}  // Open quantity selection popup
            disabled={product.stock < 1}  // Disable if out of stock
          >
            {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}  {/* Dynamic button text */}
          </button>
        </div>
      </div>

      {/* CART POPUP MODAL - Quantity selection interface */}
      {showCartPopup && (
        <div className="cart-popup-overlay">
          <div className="cart-popup-container">
            {/* CLOSE BUTTON - Dismiss popup */}
            <button className="cart-popup-close" onClick={closeCartPopup}>
              ✕  {/* Updated close button */}
            </button>
            
            <div className="cart-popup-content">
              {/* FRAGRANCE INFORMATION IN POPUP - Quick product overview */}
              <div className="cart-popup-product">
                {/* FRAGRANCE IMAGE IN POPUP */}
                <div className="cart-popup-image">
                  <img 
                    src={imageUrl} 
                    alt={product.name}
                    onError={(e) => {
                      // FALLBACK IMAGE - Show luxury placeholder if image fails to load
                      e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                </div>
                {/* FRAGRANCE DETAILS IN POPUP */}
                <div className="cart-popup-info">
                  <h3 className="cart-popup-title">{product.name}</h3>  {/* Fragrance name */}
                  <div className="cart-popup-price">{product.price} DH</div>  {/* Unit price */}
                  <span className={`cart-popup-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock > 0 ? `${product.stock} Bottles Available` : 'Out of Stock'}  {/* Updated stock status */}
                  </span>
                </div>
              </div>

              {/* FRAGRANCE DESCRIPTION IN POPUP - Full description display */}
              {product.description && (
                <div className="cart-popup-description">
                  <p>{product.description}</p>  {/* Full fragrance description */}
                </div>
              )}

              {/* FRAGRANCE NOTES IN POPUP - Display scent characteristics */}
              {product.notes && (
                <div className="cart-popup-notes">
                  <strong>Scent Profile:</strong> {product.notes}
                </div>
              )}

              {/* QUANTITY SELECTOR SECTION - Quantity adjustment controls */}
              <div className="cart-popup-quantity">
                <span className="quantity-label">Select Quantity:</span>  {/* Updated quantity label */}
                <div className="quantity-controls">
                  {/* DECREASE QUANTITY BUTTON */}
                  <button 
                    className="quantity-btn decrease"
                    onClick={decreaseQuantity}  // Decrease quantity
                    disabled={quantity <= 1}    // Disable at minimum quantity
                  >
                    −  {/* Updated decrease button */}
                  </button>
                  {/* QUANTITY INPUT - Direct quantity entry */}
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => {
                      // VALIDATE INPUT - Ensure quantity stays within valid range
                      const value = Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1));
                      setQuantity(value);
                    }}
                    className="quantity-input"
                  />
                  {/* INCREASE QUANTITY BUTTON */}
                  <button 
                    className="quantity-btn increase"
                    onClick={increaseQuantity}    // Increase quantity
                    disabled={quantity >= product.stock}  // Disable at maximum stock
                  >
                    +  {/* Updated increase button */}
                  </button>
                </div>
              </div>

              {/* TOTAL PRICE DISPLAY - Calculated total for selected quantity */}
              <div className="cart-popup-total">
                <span className="total-label">Total Amount:</span>  {/* Updated total label */}
                <span className="total-amount">{totalPrice} DH</span>  {/* Calculated total */}
              </div>

              {/* ACTION BUTTONS SECTION - Final decision buttons */}
              <div className="cart-popup-actions">
                {/* CANCEL BUTTON - Close popup without action */}
                <button 
                  className="cart-popup-cancel" 
                  onClick={closeCartPopup}  // Close popup
                  disabled={addingToCart}   // Disable during loading
                >
                  Continue Browsing  {/* Updated cancel button text */}
                </button>
                {/* CONFIRM BUTTON - Add to cart with selected quantity */}
                <button 
                  className="cart-popup-confirm"
                  onClick={handleAddToCartConfirm}  // Add to cart
                  disabled={addingToCart || product.stock < 1}  // Disable during loading or if out of stock
                >
                  {addingToCart ? (
                    <span className="loading-content">
                      <div className="loading-spinner"></div>
                      Adding to Cart...  {/* Loading state text */}
                    </span>
                  ) : (
                    `Add ${quantity} Bottle${quantity !== 1 ? 's' : ''} to Cart`  /* Updated confirm button text */
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// DEFAULT EXPORT - Make component available for import
export default ProductItem;