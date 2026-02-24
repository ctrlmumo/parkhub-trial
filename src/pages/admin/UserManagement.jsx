import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, MoreVertical, Edit2, Ban, Trash2, Eye } from 'lucide-react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  /* Load users on mount */
  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Load all users
   * TODO: Replace with API call
   */
  const loadUsers = () => {
    setTimeout(() => {
      // TODO: Replace with real API call
      // const response = await api.get('/admin/users');
      // setUsers(response.data);
      
      // Empty state - no mock data
      setUsers([]);
      setFilteredUsers([]);
      setLoading(false);
    }, 500);
  };

  /* Handle search and filters */
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, statusFilter, users]);

  /* Action handlers */
  const handleViewUser = (user) => {
    alert(`View user: ${user.name}\n\nUser details modal coming soon!`);
  };

  const handleEditUser = (user) => {
    alert(`Edit user: ${user.name}\n\nEdit user modal coming soon!`);
  };

  const handleBanUser = (user) => {
    if (window.confirm(`Are you sure you want to ban ${user.name}?`)) {
      // TODO: Call API to ban user
      alert(`User ${user.name} banned`);
    }
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?\n\nThis action cannot be undone.`)) {
      // TODO: Call API to delete user
      setUsers(prev => prev.filter(u => u.id !== user.id));
    }
  };

  /* Get role badge class */
  const getRoleBadgeClass = (role) => {
    const classes = {
      driver: 'role-driver',
      manager: 'role-manager',
      admin: 'role-admin'
    };
    return classes[role] || 'role-driver';
  };

  /* Get status badge class */
  const getStatusBadgeClass = (status) => {
    const classes = {
      active: 'status-active',
      banned: 'status-banned',
      suspended: 'status-suspended'
    };
    return classes[status] || 'status-active';
  };

  if (loading) {
    return (
      <div className="user-management-page">
        <AdminNavbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-page">
      <AdminNavbar />
      
      <div className="user-management-container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">Manage all platform users</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          {/* Search */}
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Role Filter */}
          <div className="filter-dropdown">
            <Filter size={18} className="filter-icon" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="driver">Drivers</option>
              <option value="manager">Managers</option>
              <option value="admin">Admins</option>
            </select>
            <ChevronDown size={18} className="dropdown-icon" />
          </div>

          {/* Status Filter */}
          <div className="filter-dropdown">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="suspended">Suspended</option>
            </select>
            <ChevronDown size={18} className="dropdown-icon" />
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-card">
          <div className="table-header">
            <h3 className="table-title">All Users ({filteredUsers.length})</h3>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Bookings</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <span className="user-name">{user.name}</span>
                      </td>
                      <td>
                        <span className="user-email">{user.email}</span>
                      </td>
                      <td>
                        <span className="user-phone">{user.phone}</span>
                      </td>
                      <td>
                        <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className="user-date">{user.joined}</span>
                      </td>
                      <td>
                        <span className="user-count">{user.bookings}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                            className="actions-btn"
                          >
                            <MoreVertical size={18} />
                          </button>
                          
                          {openDropdown === user.id && (
                            <div className="actions-dropdown">
                              <button 
                                onClick={() => handleViewUser(user)}
                                className="action-item"
                              >
                                <Eye size={16} />
                                <span>View Details</span>
                              </button>
                              <button 
                                onClick={() => handleEditUser(user)}
                                className="action-item"
                              >
                                <Edit2 size={16} />
                                <span>Edit User</span>
                              </button>
                              <button 
                                onClick={() => handleBanUser(user)}
                                className="action-item action-warning"
                              >
                                <Ban size={16} />
                                <span>Ban User</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user)}
                                className="action-item action-danger"
                              >
                                <Trash2 size={16} />
                                <span>Delete User</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Search size={48} className="empty-icon" />
              <p className="empty-text">No users found</p>
              <p className="empty-subtext">
                {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Users will appear here once registered'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;