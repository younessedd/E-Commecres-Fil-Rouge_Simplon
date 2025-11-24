// REACT IMPORT - Core React functionality
import React from 'react';
//import { getProductImageUrl } from '../../services/api';  // API service for product images

import { getProductImageUrl } from '../../services/api/api.config';
import './CartItem.css';  // Component-specific styles

// CART ITEM COMPONENT - Individual fragrance cart item display with removal functionality for I Smell Shop
const CartItem = ({ item, onRemove }) => {
  // ENHANCED ITEM ID GETTER - Extract cart item identifier from various data structures
  const getItemId = (item) => {
    return item?.id || item?.cart_id || item?.cart_item_id || item?.pivot?.id;
  };

  // ENHANCED FRAGRANCE NAME GETTER - Extract fragrance name with fallback
  const getProductName = (item) => {
    if (!item) return 'Unknown Fragrance';  // Updated fallback for missing item
    return item.product?.name || item.name || 'Unknown Fragrance';  // Handle nested product data
  };

  // ENHANCED FRAGRANCE PRICE GETTER - Extract fragrance price with fallback
  const getProductPrice = (item) => {
    if (!item) return 0;  // Fallback for missing item
    return item.product?.price || item.price || item.pivot?.price || 0;  // Handle various price locations
  };

  // ENHANCED FRAGRANCE QUANTITY GETTER - Extract quantity with fallback
  const getProductQuantity = (item) => {
    if (!item) return 1;  // Default quantity
    return item.quantity || item.pivot?.quantity || 1;  // Handle various quantity locations
  };

  // ENHANCED IMAGE URL GETTER - Generate fragrance image URL with fallback
  const getImageUrl = (item) => {
    if (!item) return 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';  // Updated luxury fallback image
    
    const imagePath = item.product?.image || item.image;  // Extract image path
    return getProductImageUrl(imagePath);  // Generate full image URL
  };

  // ENHANCED STOCK STATUS GETTER - Determine stock availability
  const getStockStatus = (item) => {
    if (!item) return 'stock-out';  // Default to out of stock
    const stock = item.product?.stock || item.stock || 0;  // Extract stock quantity
    return stock > 0 ? 'stock-available' : 'stock-out';  // Return status based on stock
  };

  // FRAGRANCE NOTES GETTER - Extract scent characteristics
  const getFragranceNotes = (item) => {
    if (!item) return null;
    return item.product?.notes || item.notes || null;  // Extract fragrance notes
  };

  // DATA EXTRACTION - Get all necessary item properties using helper functions
  const itemId = getItemId(item);              // Unique cart item identifier
  const itemName = getProductName(item);       // Fragrance name for display
  const itemPrice = getProductPrice(item);     // Unit price of the fragrance
  const itemQuantity = getProductQuantity(item); // Quantity in cart
  const itemTotal = itemPrice * itemQuantity;  // Calculated total price
  const imageUrl = getImageUrl(item);          // Fragrance image URL
  const stockStatus = getStockStatus(item);    // Stock availability status
  const fragranceNotes = getFragranceNotes(item); // Fragrance scent notes
  const stockText = stockStatus === 'stock-available' 
    ? `${item.product?.stock || item.stock} Bottles Available`  // Updated stock count text
    : 'Out of Stock';  // Out of stock message

  // COMPONENT RENDER - Fragrance cart item display with product information
  return (
    <div className="cart-item-card">
      
      {/* FRAGRANCE IMAGE SECTION - Visual representation of fragrance */}
      <div className="cart-item-image-container">
        <img 
          src={imageUrl} 
          alt={itemName}  // Accessibility alt text
          className="cart-item-image"
          onError={(e) => {
            // FALLBACK IMAGE HANDLER - Replace broken images with luxury placeholder
            e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
          }}
        />
        {/* LUXURY BADGE - Premium indicator */}
        <div className="cart-item-badge">Premium</div>
      </div>
      
      {/* FRAGRANCE INFORMATION SECTION - Text details and pricing */}
      <div className="cart-item-info">
        
        {/* FRAGRANCE NAME - Main fragrance title */}
        <h3 className="cart-item-name">{itemName}</h3>
        
        {/* FRAGRANCE NOTES - Display scent characteristics if available */}
        {fragranceNotes && (
          <div className="cart-item-notes">
            <span className="notes-label">Scent Profile:</span>
            <span className="notes-value">{fragranceNotes}</span>
          </div>
        )}
        
        {/* FRAGRANCE DETAILS GRID - Organized product information */}
        <div className="cart-item-details-grid">
          
          {/* UNIT PRICE DETAIL - Display individual fragrance price */}
          <div className="cart-item-detail">
            <span className="detail-label">Price per Bottle</span>  {/* Updated price label */}
            <span className="detail-value price-value">{itemPrice} DH</span>  {/* Price value */}
          </div>
          
          {/* QUANTITY DETAIL - Display quantity in cart */}
          <div className="cart-item-detail">
            <span className="detail-label">Bottles in Cart</span>  {/* Updated quantity label */}
            <span className="detail-value quantity-badge">{itemQuantity}</span>  {/* Quantity value */}
          </div>
          
          {/* STOCK STATUS DETAIL - Display availability information */}
          <div className="cart-item-detail">
            <span className="detail-label">Availability</span>  {/* Updated status label */}
            <span className={`stock-indicator ${stockStatus}`}>
              {stockText}  {/* Dynamic stock text */}
            </span>
          </div>
        </div>
        
        {/* ITEM TOTAL SECTION - Calculated total for this cart item */}
        <div className="cart-item-total">
          <p className="item-total-text">
            Fragrance Total:  {/* Updated total label */}
            <span className="item-total-amount"> {itemTotal.toFixed(2)} DH</span>  {/* Calculated total */}
          </p>
        </div>
      </div>

      {/* REMOVE BUTTON SECTION - Action to remove fragrance from cart */}
      <button 
        className="cart-item-remove-btn"
        onClick={() => onRemove(item)}  // Trigger removal handler from parent
        aria-label={`Remove ${itemName} from cart`}  // Accessibility label
      >
        Remove Fragrance  {/* Updated button text */}
      </button>
    </div>
  );
};

// DEFAULT EXPORT - Make component available for import
export default CartItem;