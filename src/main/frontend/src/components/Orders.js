import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Using demo data.');
      // Demo data for when backend is not available
      setOrders([
        {
          id: '1',
          customerName: 'John Doe',
          items: [{ name: 'Chicken Burger', quantity: 2 }],
          total: 29.99,
          status: 'PENDING',
          orderDate: '2024-01-20'
        },
        {
          id: '2',
          customerName: 'Jane Smith',
          items: [{ name: 'Fried Chicken', quantity: 1 }],
          total: 15.99,
          status: 'CONFIRMED',
          orderDate: '2024-01-20'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      CONFIRMED: 'info',
      PREPARING: 'primary',
      READY: 'success',
      DELIVERED: 'success',
      CANCELLED: 'danger'
    };
    return colors[status] || 'secondary';
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
        <h1>Orders</h1>
        <button className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          New Order
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
          {orders.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="fw-bold">#{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>
                        {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                      </td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <span className={`badge bg-${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-success">
                          <i className="fas fa-check"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
              <p className="text-muted">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;