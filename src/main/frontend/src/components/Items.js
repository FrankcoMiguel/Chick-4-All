import React, { useState, useEffect } from 'react';
import { itemAPI } from '../services/api';

function Items() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await itemAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to load items. Using demo data.');
      // Demo data for when backend is not available
      setItems([
        {
          id: '1',
          name: 'Chicken Burger',
          description: 'Crispy chicken with fresh vegetables',
          price: 14.99,
          category: 'BURGERS',
          available: true
        },
        {
          id: '2',
          name: 'Fried Chicken',
          description: 'Golden fried chicken pieces',
          price: 12.99,
          category: 'CHICKEN',
          available: true
        },
        {
          id: '3',
          name: 'Chicken Wings',
          description: 'Spicy buffalo wings',
          price: 9.99,
          category: 'CHICKEN',
          available: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      BURGERS: 'primary',
      CHICKEN: 'warning',
      SIDES: 'info',
      DRINKS: 'success',
      DESSERTS: 'danger'
    };
    return colors[category] || 'secondary';
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Menu Items</h1>
        <button className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          Add Item
        </button>
      </div>

      {error && (
        <div className="alert alert-warning" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          {items.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-bold">{item.name}</td>
                      <td>{item.description}</td>
                      <td>
                        <span className={`badge bg-${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${item.available ? 'bg-success' : 'bg-danger'}`}>
                          {item.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-secondary me-2">
                          <i className={`fas ${item.available ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="fas fa-box fa-3x text-muted mb-3"></i>
              <p className="text-muted">No items found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Items;