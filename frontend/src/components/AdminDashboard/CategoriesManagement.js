import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api/categories.api';
import './CategoriesManagement.css';

// CATEGORIES MANAGEMENT COMPONENT - Admin interface for fragrance collections management
const CategoriesManagement = ({ showNotification }) => {
  // STATE MANAGEMENT - Application data and UI state
  const [allCategories, setAllCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  // PAGINATION STATE - Data pagination controls
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [perPage] = useState(9);

  // FORM STATE - Collection form data
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  // RESPONSIVE LAYOUT EFFECT - Detect screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // INITIAL DATA LOADING - Fetch collections on component mount
  useEffect(() => {
    fetchAllCategories();
  }, []);

  // FETCH ALL COLLECTIONS - Retrieve complete collections dataset from API
  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll(1, 1000);
      const categoriesData = response.data.data || response.data;
      
      setAllCategories(categoriesData);
      setTotalCategories(categoriesData.length);
      
      const calculatedLastPage = Math.ceil(categoriesData.length / perPage);
      setLastPage(calculatedLastPage);
      
      updateDisplayedCategories(categoriesData, 1);
      
    } catch (error) {
      console.error('Error fetching fragrance collections:', error);
      showNotification('Failed to load fragrance collections', 'error');
    } finally {
      setLoading(false);
    }
  };

  // UPDATE DISPLAYED COLLECTIONS - Paginate and filter collections for display
  const updateDisplayedCategories = (categoriesData, page) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    setCategories(categoriesData.slice(startIndex, endIndex));
  };

  // SEARCH HANDLER - Filter collections based on search criteria
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      updateDisplayedCategories(allCategories, 1);
      setCurrentPage(1);
      setTotalCategories(allCategories.length);
      setLastPage(Math.ceil(allCategories.length / perPage));
      showNotification('Showing all fragrance collections', 'info');
      return;
    }

    const filteredCategories = allCategories.filter(category =>
      category.id.toString().includes(searchQuery) ||
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.slug && category.slug.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setTotalCategories(filteredCategories.length);
    const calculatedLastPage = Math.ceil(filteredCategories.length / perPage) || 1;
    setLastPage(calculatedLastPage);
    updateDisplayedCategories(filteredCategories, 1);
    setCurrentPage(1);

    if (filteredCategories.length > 0) {
      showNotification(`Found ${filteredCategories.length} collection${filteredCategories.length !== 1 ? 's' : ''} for "${searchQuery}"`, 'success');
    } else {
      showNotification(`No fragrance collections found for "${searchQuery}"`, 'info');
    }
  };

  // KEYBOARD NAVIGATION - Handle Enter key for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // FORM INPUT HANDLER - Update form data on input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // FORM SUBMISSION HANDLER - Create or update collection
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (selectedCategory && selectedCategory.id) {
        await categoriesAPI.update(selectedCategory.id, formData);
        showNotification(`Fragrance collection "${formData.name}" updated successfully!`, 'success');
      } else {
        await categoriesAPI.create(formData);
        showNotification(`Fragrance collection "${formData.name}" added successfully!`, 'success');
      }

      closeModals();
      fetchAllCategories();
      
    } catch (error) {
      console.error('Error saving fragrance collection:', error);
      showNotification('Failed to save fragrance collection', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // MODAL CONTROLS - Close all modals and reset form
  const closeModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      slug: ''
    });
  };

  // EDIT HANDLER - Open edit modal with collection data
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug || ''
    });
    setShowEditModal(true);
  };

  // DELETE MODAL HANDLER - Open confirmation dialog for collection deletion
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  // COLLECTION DELETION HANDLER - Remove collection from system
  const handleDelete = async () => {
    if (!selectedCategory) return;

    const categoryIdToDelete = selectedCategory.id;
    const categoryName = selectedCategory.name;
    
    try {
      setFormLoading(true);
      
      await categoriesAPI.delete(categoryIdToDelete);
      
      const updatedCategories = allCategories.filter(category => category.id !== categoryIdToDelete);
      setAllCategories(updatedCategories);
      setTotalCategories(updatedCategories.length);
      
      const calculatedLastPage = Math.ceil(updatedCategories.length / perPage) || 1;
      setLastPage(calculatedLastPage);
      
      const newCurrentPage = currentPage > calculatedLastPage ? Math.max(1, calculatedLastPage) : currentPage;
      setCurrentPage(newCurrentPage);
      updateDisplayedCategories(updatedCategories, newCurrentPage);
      
      showNotification(`Fragrance collection "${categoryName}" deleted successfully!`, 'success');
      closeModals();
      
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('Failed to delete fragrance collection', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // PAGINATION HANDLER - Navigate between collection pages
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateDisplayedCategories(allCategories, page);
  };

  // PAGINATION RENDERER - Generate pagination controls
  const renderPagination = () => {
    if (lastPage <= 1) return null;

    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key="first" className="pagination-btn" onClick={() => handlePageChange(1)}>
          {isMobile ? 'First' : 'First'}
        </button>
      );
    }

    if (currentPage > 1) {
      pages.push(
        <button key="prev" className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)}>
          {isMobile ? 'Prev' : 'Previous'}
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'pagination-active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (currentPage < lastPage) {
      pages.push(
        <button key="next" className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)}>
          {isMobile ? 'Next' : 'Next'}
        </button>
      );
    }

    if (endPage < lastPage) {
      pages.push(
        <button key="last" className="pagination-btn" onClick={() => handlePageChange(lastPage)}>
          {isMobile ? 'Last' : 'Last'}
        </button>
      );
    }

    return (
      <div className="pagination-container">
        <div className="pagination">
          {pages}
        </div>
        <div className="pagination-info">
          Showing {categories.length} of {totalCategories} fragrance collections | Page {currentPage} of {lastPage}
        </div>
      </div>
    );
  };

  // ACTION BUTTONS COMPONENT - Edit and Delete buttons for each collection
  const ActionButtons = ({ category }) => (
    <div className="action-buttons">
      <button 
        className="management-btn btn-edit"
        onClick={() => handleEdit(category)}
      >
        Edit
      </button>
      <button 
        className="management-btn btn-delete" 
        onClick={() => openDeleteModal(category)}
      >
        Delete
      </button>
    </div>
  );

  // COLLECTION ROW RENDERER - Display collection information based on screen size
  const renderCategoryRow = (category) => {
    if (isMobile) {
      return (
        <div key={category.id} className="data-card-mobile">
          <div className="category-card-header">
            <div className="category-id-mobile">
              Collection #{category.id}
            </div>
          </div>
          
          <div className="category-card-body">
            <div className="category-info-grid">
              <div className="category-info-item">
                <span className="info-label">Collection Name</span>
                <span className="info-value">{category.name}</span>
              </div>
              
              <div className="category-info-item">
                <span className="info-label">URL Slug</span>
                <div className="category-slug-mobile">
                  {category.slug || 'N/A'}
                </div>
              </div>
              
              <div className="category-info-item">
                <span className="info-label">Created Date</span>
                <div className="category-date-mobile">
                  {category.created_at ? new Date(category.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="category-card-actions">
            <ActionButtons category={category} />
          </div>
        </div>
      );
    }

    return (
      <tr key={category.id} className="category-row">
        <td className="category-id-cell">
          <strong>#{category.id}</strong>
        </td>
        <td className="category-name-cell">
          {category.name}
        </td>
        <td>
          <span className="category-slug-cell">
            {category.slug || 'N/A'}
          </span>
        </td>
        <td className="category-date-cell">
          {category.created_at ? new Date(category.created_at).toLocaleDateString('en-US') : 'N/A'}
        </td>
        <td className="actions-cell">
          <ActionButtons category={category} />
        </td>
      </tr>
    );
  };

  // LOADING STATE - Display during initial data fetch
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading fragrance collections...</p>
      </div>
    );
  }

  // MAIN COMPONENT RENDER - Collection management interface
  return (
    <div className="management-container">
      {/* FLOATING ACTION BUTTON - Quick access to add new collection */}
      <button 
        className="fixed-add-button"
        onClick={() => {
          setSelectedCategory(null);
          setFormData({
            name: '',
            slug: ''
          });
          setShowEditModal(true);
        }}
        title="Add New Collection"
      >
        +
      </button>

      {/* HEADER SECTION - Title and description */}
      <div className="management-card">
        <div className="management-header">
          <div className="header-title">
            <h1>Fragrance Collections Management</h1>
            <p className="header-subtitle">Manage your luxury fragrance collections and scent categories</p>
          </div>
        </div>

        {/* SEARCH SECTION - Collection filtering interface */}
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by collection ID, name, or URL slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <div className="search-actions">
              <button className="management-btn btn-primary btn-search" onClick={handleSearch}>
                Search Collections
              </button>
              <button className="management-btn btn-secondary" onClick={() => {
                setSearchQuery('');
                fetchAllCategories();
              }}>
                Show All Collections
              </button>
            </div>
          </div>
          <div className="search-tips">
            Search tips: Enter collection ID, name, or URL slug to find specific fragrance collections
          </div>
        </div>
      </div>

      {/* EDIT/ADD COLLECTION MODAL - Form for creating/updating collections */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedCategory ? `Edit Collection #${selectedCategory.id}` : 'Add New Fragrance Collection'}</h3>
              <button className="modal-close" onClick={closeModals}>Close</button>
            </div>
            
            <form onSubmit={handleSubmit} className="management-form">
              {selectedCategory && (
                <div className="form-group full-width">
                  <label>Collection ID</label>
                  <input
                    type="text"
                    value={selectedCategory.id}
                    disabled
                    className="form-input"
                  />
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label>Collection Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter collection name (e.g., Floral, Woody, Citrus)"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>URL Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter URL-friendly slug (e.g., floral-scents)"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="management-btn btn-secondary" 
                  onClick={closeModals}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="management-btn btn-primary"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <span className="loading-content">
                      <div className="loading-spinner-small"></div>
                      Saving Collection...
                    </span>
                  ) : (
                    selectedCategory ? 'Update Collection' : 'Add Collection'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL - Collection deletion safety check */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Delete Fragrance Collection</h3>
              <button className="modal-close" onClick={closeModals}>Close</button>
            </div>
            
            <div className="delete-modal-content">
              <div className="delete-icon">⚠️</div>
              <h4>Confirm Collection Deletion</h4>
              <p>
                Are you sure you want to delete the fragrance collection <strong>"{selectedCategory?.name}"</strong> (ID: {selectedCategory?.id})?
              </p>
              <div className="delete-warning">
                ⚠️ This action cannot be undone! All fragrances in this collection will remain but will lose their category assignment.
              </div>
              
              <div className="delete-actions">
                <button 
                  className="management-btn btn-secondary" 
                  onClick={closeModals}
                  disabled={formLoading}
                >
                  Keep Collection
                </button>
                <button 
                  className="management-btn btn-danger" 
                  onClick={handleDelete}
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <span className="loading-content">
                      <div className="loading-spinner-small"></div>
                      Deleting...
                    </span>
                  ) : (
                    'Delete Collection'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COLLECTIONS LIST SECTION - Main collections display area */}
      <div className="management-card">
        <div className="section-header">
          <h3>Fragrance Collections</h3>
          <div className="products-count">
            {totalCategories} collection{totalCategories !== 1 ? 's' : ''} in your luxury portfolio
          </div>
        </div>
        
        {categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌸</div>
            <h4>No Fragrance Collections Found</h4>
            <p>
              {searchQuery 
                ? `No fragrance collections found for "${searchQuery}"`
                : 'Start building your luxury fragrance portfolio by creating your first collection.'
              }
            </p>
            {!searchQuery && (
              <button 
                className="management-btn btn-primary"
                onClick={() => setShowEditModal(true)}
              >
                Create Your First Collection
              </button>
            )}
          </div>
        ) : (
          <>
            {isMobile ? (
              <div className="data-grid-mobile">
                {categories.map(category => renderCategoryRow(category))}
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Collection ID</th>
                      <th>Collection Name</th>
                      <th>URL Slug</th>
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(category => renderCategoryRow(category))}
                  </tbody>
                </table>
              </div>
            )}
            
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoriesManagement;