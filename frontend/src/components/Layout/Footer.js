// REACT IMPORT - Core React library for component creation
import React from 'react';
import './Footer.css';  // Import component-specific CSS styles

// FOOTER COMPONENT - Simple luxury perfume footer
const Footer = () => {
  return (
    <footer className="footer">
      
      {/* BRAND AND SLOGAN SECTION */}
      <div className="footer-brand">
        <h3 className="brand-title">I Smell Shop</h3>
        <p className="brand-slogan">Luxury Fragrances, Unforgettable Scents</p>
      </div>

      {/* SOCIAL MEDIA LINKS */}
      <div className="social-section">
        <a href="#" className="social-link" aria-label="Instagram">Instagram</a>
        <a href="#" className="social-link" aria-label="Facebook">Facebook</a>
        <a href="#" className="social-link" aria-label="Twitter">Twitter</a>
        <a href="#" className="social-link" aria-label="TikTok">TikTok</a>
      </div>

      {/* CONTACT INFORMATION */}
      <div className="contact-section">
        <p className="contact-info">📧 contact@ismellshop.com</p>
        <p className="contact-info">📞 +1 (555) 123-4567</p>
        <p className="contact-info">📍 Perfume District, Fragrance City</p>
      </div>

      {/* COPYRIGHT */}
      <div className="copyright-section">
        <p className="copyright">© 2024 I Smell Shop. All rights reserved.</p>
      </div>

    </footer>
  );
};

// DEFAULT EXPORT - Make component available for import in other files
export default Footer;