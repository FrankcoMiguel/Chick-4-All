import React, { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: { city: '', state: '', street: '', zipCode: '' },
    platform: 'WHATSAPP'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('ALL');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers. Using demo data.');
      // Demo data for when backend is not available
      setCustomers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          address: { city: 'New York', state: 'NY', street: '123 Main St', zipCode: '10001' },
          platform: 'WHATSAPP',
          joinDate: '2024-01-15'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1987654321',
          address: { city: 'Los Angeles', state: 'CA', street: '456 Oak Ave', zipCode: '90210' },
          platform: 'INSTAGRAM',
          joinDate: '2024-01-10'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          phone: '+1555555555',
          address: { city: 'Chicago', state: 'IL', street: '789 Pine Rd', zipCode: '60601' },
          platform: 'FACEBOOK',
          joinDate: '2024-01-12'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCustomer = {
      ...formData,
      id: editingCustomer ? editingCustomer.id : Date.now().toString(),
      joinDate: editingCustomer ? editingCustomer.joinDate : new Date().toISOString().split('T')[0]
    };

    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? newCustomer : c));
    } else {
      setCustomers(prev => [...prev, newCustomer]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: { city: '', state: '', street: '', zipCode: '' },
      platform: 'WHATSAPP'
    });
    setEditingCustomer(null);
    setShowForm(false);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setShowForm(true);
  };

  const handleDelete = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'ALL' || customer.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

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
    <div className="container-fluid">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col">
          <h1 className="h3 mb-0 text-gray-800">
            <i className="fas fa-users me-2 text-primary"></i>
            Customer Management
          </h1>
          <p className="text-muted mb-0">Manage your restaurant customers</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-primary shadow-sm"
            onClick={() => setShowForm(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Add New Customer
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning border-left-warning shadow-sm mb-4" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="card shadow-sm mb-4">
        <div className="card-body py-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search customers by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
              >
                <option value="ALL">All Platforms</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="FACEBOOK">Facebook</option>
                <option value="PHONE">Phone</option>
              </select>
            </div>
            <div className="col-md-3 text-end">
              <span className="text-muted">
                <strong>{filteredCustomers.length}</strong> customers found
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Form Modal */}
      {showForm && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user-plus me-2"></i>
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h5>
                <button type="button" className="btn-close" onClick={resetForm}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone *</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Platform *</label>
                      <select
                        className="form-select"
                        name="platform"
                        value={formData.platform}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="WHATSAPP">WhatsApp</option>
                        <option value="INSTAGRAM">Instagram</option>
                        <option value="FACEBOOK">Facebook</option>
                        <option value="PHONE">Phone</option>
                      </select>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Street Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.street"
                        value={formData.address?.street || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.city"
                        value={formData.address?.city || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.state"
                        value={formData.address?.state || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Zip Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.zipCode"
                        value={formData.address?.zipCode || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-2"></i>
                    {editingCustomer ? 'Update' : 'Create'} Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="card shadow-sm">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            <i className="fas fa-table me-2"></i>
            Customer Directory
          </h6>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
              <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <p className="text-muted">Loading customers...</p>
              </div>
            </div>
          ) : filteredCustomers.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="border-0">Customer</th>
                    <th className="border-0">Contact</th>
                    <th className="border-0">Address</th>
                    <th className="border-0">Platform</th>
                    <th className="border-0">Joined</th>
                    <th className="border-0 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                            <i className="fas fa-user text-white"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{customer.name}</div>
                            <small className="text-muted">ID: {customer.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="text-dark">{customer.email}</div>
                          <small className="text-muted">{customer.phone}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          {customer.address?.street && (
                            <div className="text-dark">{customer.address.street}</div>
                          )}
                          <small className="text-muted">
                            {customer.address ? 
                              `${customer.address.city}, ${customer.address.state} ${customer.address.zipCode}` : 'No address'
                            }
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className={`badge px-3 py-2 ${
                          customer.platform === 'WHATSAPP' ? 'bg-success' :
                          customer.platform === 'INSTAGRAM' ? 'bg-danger' :
                          customer.platform === 'FACEBOOK' ? 'bg-primary' : 'bg-info'
                        }`}>
                          <i className={`fab fa-${
                            customer.platform === 'WHATSAPP' ? 'whatsapp' :
                            customer.platform === 'INSTAGRAM' ? 'instagram' :
                            customer.platform === 'FACEBOOK' ? 'facebook' : 'phone'
                          } me-1`}></i>
                          {customer.platform}
                        </span>
                      </td>
                      <td>
                        <span className="text-muted">
                          {new Date(customer.joinDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEdit(customer)}
                            title="Edit customer"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(customer.id)}
                            title="Delete customer"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-users fa-4x text-muted mb-4"></i>
              <h5 className="text-muted">No customers found</h5>
              <p className="text-muted mb-4">
                {searchTerm || filterPlatform !== 'ALL' ? 
                  'Try adjusting your search or filter criteria.' :
                  'Get started by adding your first customer!'
                }
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Add First Customer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Customers;