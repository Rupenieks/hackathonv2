import React, { Component } from "react";

// Mock data type definitions
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  department?: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    department: "Engineering",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    department: "Marketing",
  },
  { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "user" },
];

interface UserFormState {
  users: User[];
  newUser: {
    name: string;
    email: string;
    role: "admin" | "user";
    department?: string;
  };
  errors: {
    name?: string;
    email?: string;
    role?: string;
  };
}

class UserManagement extends Component<{}, UserFormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      users: mockUsers,
      newUser: {
        name: "",
        email: "",
        role: "user",
        department: "",
      },
      errors: {},
    };
  }

  // Manual validation example
  validateForm = (): boolean => {
    const { name, email, role } = this.state.newUser;
    const errors: UserFormState["errors"] = {};

    // Name validation
    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format";
    }

    // Role validation
    if (!role) {
      errors.role = "Role is required";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newUser: {
        ...prevState.newUser,
        [name]: value,
      },
    }));
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (this.validateForm()) {
      const newUserId = Math.max(...this.state.users.map((u) => u.id)) + 1;
      const newUser: User = {
        id: newUserId,
        ...this.state.newUser,
      };

      this.setState((prevState) => ({
        users: [...prevState.users, newUser],
        newUser: {
          name: "",
          email: "",
          role: "user",
          department: "",
        },
        errors: {},
      }));
    }
  };

  render() {
    const { users, newUser, errors } = this.state;

    return (
      <div className="user-management">
        <h2>User Management</h2>

        {/* User List */}
        <div className="user-list">
          <h3>Current Users</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.department || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Form */}
        <div className="add-user-form">
          <h3>Add New User</h3>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={this.handleInputChange}
                />
              </label>
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={this.handleInputChange}
                />
              </label>
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div>
              <label>
                Role:
                <select
                  name="role"
                  value={newUser.role}
                  onChange={this.handleInputChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              {errors.role && <span className="error">{errors.role}</span>}
            </div>

            <div>
              <label>
                Department:
                <input
                  type="text"
                  name="department"
                  value={newUser.department}
                  onChange={this.handleInputChange}
                />
              </label>
            </div>

            <button type="submit">Add User</button>
          </form>
        </div>
      </div>
    );
  }
}

export default UserManagement;
