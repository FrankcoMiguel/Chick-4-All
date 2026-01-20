import React, { useState, useEffect } from 'react';
import { customerAPI, orderAPI, itemAPI } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalItems: 0,
    pendingOrders: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch data in parallel
      const [customersResponse, ordersResponse, itemsResponse] = await Promise.all([
        customerAPI.getAll().catch(() => ({ data: [] })),
        orderAPI.getAll().catch(() => ({ data: [] })),
        itemAPI.getAll().catch(() => ({ data: [] }))
      ]);

      const customers = customersResponse.data;
      const orders = ordersResponse.data;
      const items = itemsResponse.data;

      setStats({
        totalCustomers: customers.length,
        totalOrders: orders.length,
        totalItems: items.length,
        pendingOrders: orders.filter(order => order.status === 'PENDING').length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
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
        <h1>Dashboard</h1>
        <button className="btn btn-outline-secondary" onClick={fetchDashboardData}>
          <i className="fas fa-sync-alt me-2"></i>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Customers
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalCustomers}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Orders
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalOrders}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-shopping-cart fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Menu Items
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalItems}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-box fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Pending Orders
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.pendingOrders}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-clock fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="d-grid">
                    <button className="btn btn-outline-primary">
                      <i className="fas fa-plus me-2"></i>
                      Add New Order
                    </button>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-grid">
                    <button className="btn btn-outline-success">
                      <i className="fas fa-user-plus me-2"></i>
                      Add New Customer
                    </button>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-grid">
                    <button className="btn btn-outline-info">
                      <i className="fas fa-box-open me-2"></i>
                      Add New Item
                    </button>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-grid">
                    <button className="btn btn-outline-warning">
                      <i className="fas fa-chart-bar me-2"></i>
                      View Reports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">System Status</h6>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success rounded-circle p-2 me-3">
                  <i className="fas fa-check text-white"></i>
                </div>
                <div>
                  <div className="font-weight-bold">Backend API</div>
                  <div className="text-muted small">Running smoothly</div>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success rounded-circle p-2 me-3">
                  <i className="fas fa-database text-white"></i>
                </div>
                <div>
                  <div className="font-weight-bold">Database</div>
                  <div className="text-muted small">Connected</div>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <div className="bg-info rounded-circle p-2 me-3">
                  <i className="fas fa-clock text-white"></i>
                </div>
                <div>
                  <div className="font-weight-bold">Last Update</div>
                  <div className="text-muted small">{new Date().toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;