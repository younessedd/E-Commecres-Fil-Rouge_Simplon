import React from 'react';
import { getProductImageUrl } from '../../services/api/api.config';
import './CartItem.css';

const CartItem = ({ item, onRemove }) => {
  const getProductName = () => {
    if (!item) return 'Unknown Product';
    return item.product?.name || item.name || 'Unknown Product';
  };

  const getProductPrice = () => {
    if (!item) return 0;
    return item.product?.price || item.price || item.pivot?.price || 0;
  };

  const getProductQuantity = () => {
    if (!item) return 1;
    return item.quantity || item.pivot?.quantity || 1;
  };

  const getImageUrl = () => {
    if (!item) {
      return 'https://media.istockphoto.com/id/1071359118/vector/missing-image-vector-illustration-no-image-available-vector-concept.jpg?s=612x612&w=0&k=20&c=ukQmxO3tnUxz6mk7akh7aRCw_nyO9mmuvabs9FDPpfw=';
    }
    
    if (item.product?.image_url) {
      return item.product.image_url;
    }
    
    if (item.product?.image) {
      return getProductImageUrl(item.product.image);
    }
    
    if (item.image) {
      return getProductImageUrl(item.image);
    }
    
    if (item.pivot?.image) {
      return getProductImageUrl(item.pivot.image);
    }
    
    return 'https://media.istockphoto.com/id/1071359118/vector/missing-image-vector-illustration-no-image-available-vector-concept.jpg?s=612x612&w=0&k=20&c=ukQmxO3tnUxz6mk7akh7aRCw_nyO9mmuvabs9FDPpfw=';
  };

  const getStockStatus = () => {
    if (!item) return 'stock-out';
    const stock = item.product?.stock || item.stock || 0;
    return stock > 0 ? 'stock-available' : 'stock-out';
  };

  const getFragranceNotes = () => {
    if (!item) return null;
    return item.product?.notes || item.notes || null;
  };

  const itemName = getProductName();
  const itemPrice = getProductPrice();
  const itemQuantity = getProductQuantity();
  const itemTotal = itemPrice * itemQuantity;
  const imageUrl = getImageUrl();
  const stockStatus = getStockStatus();
  const fragranceNotes = getFragranceNotes();
  const stockText = stockStatus === 'stock-available' 
    ? `${item?.product?.stock || item?.stock || 0} Available`
    : 'Out of Stock';

  return (
    <div className="cart-item-card">
      <div className="cart-item-image-container">
        <img 
          src={imageUrl} 
          alt={itemName}
          className="cart-item-image"
          onError={(e) => {
            e.target.src = 'https://media.istockphoto.com/id/1071359118/vector/missing-image-vector-illustration-no-image-available-vector-concept.jpg?s=612x612&w=0&k=20&c=ukQmxO3tnUxz6mk7akh7aRCw_nyO9mmuvabs9FDPpfw=';
          }}
        />
        <div className="cart-item-badge">Premium</div>
      </div>
      
      <div className="cart-item-info">
        <h3 className="cart-item-name">{itemName}</h3>
        
        {fragranceNotes && (
          <div className="cart-item-notes">
            <span className="notes-label">Scent Profile:</span>
            <span className="notes-value">{fragranceNotes}</span>
          </div>
        )}
        
        <div className="cart-item-details-grid">
          <div className="cart-item-detail">
            <span className="detail-label">Price</span>
            <span className="detail-value price-value">{itemPrice} DH</span>
          </div>
          
          <div className="cart-item-detail">
            <span className="detail-label">Quantity</span>
            <span className="detail-value quantity-badge">{itemQuantity}</span>
          </div>
          
          <div className="cart-item-detail">
            <span className="detail-label">Stock</span>
            <span className={`stock-indicator ${stockStatus}`}>
              {stockText}
            </span>
          </div>
        </div>
        
        <div className="cart-item-total">
          <p className="item-total-text">
            Total: <span className="item-total-amount">{itemTotal.toFixed(2)} DH</span>
          </p>
        </div>
      </div>

      <button 
        className="cart-item-remove-btn"
        onClick={() => onRemove(item)}
        aria-label={`Remove ${itemName} from cart`}
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;