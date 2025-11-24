// IMPORT SECTION - React, API, and styles
import React, { useState } from 'react';
// Authentication API calls
import { authAPI } from '../../services/api/auth.api';
import './Register.css';  // Component-specific CSS

// REGISTER COMPONENT - Handles user registration for I Smell Shop
const Register = ({ onSwitchToLogin }) => {

  // STATE MANAGEMENT - Form data and UI states
  const [formData, setFormData] = useState({
    name: '',                    // Full name input
    email: '',                   // Email input
    password: '',                // Password input
    password_confirmation: '',   // Confirm password input
    phone: '',                   // Phone number input
    address: '',                 // Address input
    city: ''                     // City input
  });
  const [loading, setLoading] = useState(false);              // Loading indicator
  const [error, setError] = useState('');                     // Error messages
  const [showPassword, setShowPassword] = useState(false);    // Toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle confirm password

  // HANDLE INPUT CHANGE - Update state dynamically when user types
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear previous errors
  };

  // PASSWORD VISIBILITY TOGGLES
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // PASSWORD STRENGTH CALCULATOR
  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: '', width: '0%' };
    if (password.length < 6) return { strength: 'weak', width: '33%' };
    if (password.length < 10) return { strength: 'medium', width: '66%' };
    return { strength: 'strong', width: '100%' };
  };

  // PASSWORD MATCH CHECK
  const passwordsMatch = formData.password === formData.password_confirmation;
  const passwordStrength = getPasswordStrength(formData.password);

  // FORM SUBMISSION HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // CLIENT-SIDE VALIDATION
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      // API CALL - Register user
      const response = await authAPI.register(formData);
      
      // SUCCESS - Switch to login page
      onSwitchToLogin();
      console.log('Account created successfully! You can now login.');
      
    } catch (err) {
      // ERROR HANDLER
      setError(err.response?.data?.message || 'Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // COMPONENT RENDER - Registration form
  return (
    <div className="register-container">
      <div className="register-card">

        {/* HEADER */}
        <h2 className="register-title">Join I Smell Shop</h2>
        <p className="register-subtitle">Create your account to explore luxury fragrances</p>

        {/* ERROR DISPLAY */}
        {error && <div className="register-error">{error}</div>}

        {/* REGISTRATION FORM */}
        <form onSubmit={handleSubmit} className="register-form">

          {/* FULL NAME */}
          <div className="form-group">
            <label className="form-label">Full Name <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label className="form-label">Email Address <span className="required">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* PASSWORD WITH STRENGTH INDICATOR */}
          <div className="form-group">
            <label className="form-label">Password <span className="required">*</span></label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Enter your password (min. 6 characters)"
                className="form-input password-input"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {formData.password && (
              <div className={`password-strength strength-${passwordStrength.strength}`}>
                <span>Strength: {passwordStrength.strength}</span>
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ width: passwordStrength.width }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group">
            <label className="form-label">Confirm Password <span className="required">*</span></label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="form-input password-input"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {formData.password_confirmation && (
              <div className={`password-match ${passwordsMatch ? 'matching' : 'not-matching'}`}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </div>
            )}
          </div>

          {/* PHONE */}
          <div className="form-group">
            <label className="form-label">Phone Number <span className="required">*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* ADDRESS */}
          <div className="form-group">
            <label className="form-label">Address <span className="required">*</span></label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your complete address"
              className="form-input form-textarea"
              rows="3"
              disabled={loading}
            />
          </div>

          {/* CITY */}
          <div className="form-group">
            <label className="form-label">City <span className="required">*</span></label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Enter your city"
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Join I Smell Shop'}
          </button>
        </form>

        {/* LINK TO LOGIN FORM */}
        <div className="login-section">
          <span className="login-text">Already have an account?</span>
          <a 
            href="#login" 
            onClick={(e) => { 
              e.preventDefault(); 
              onSwitchToLogin(); 
            }}
            className="login-link"
          >
            Sign In Here
          </a>
        </div>

      </div>
    </div>
  );
};

// EXPORT COMPONENT
export default Register;