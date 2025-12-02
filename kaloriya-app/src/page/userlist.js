import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    console.log("Selected user ID:", id);
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
    });

    fetchUsers();
  };

  // Update user
  const updateUser = async () => {
    await fetch(`http://localhost:5000/users/${editUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editUser),
    });

    setEditUser(null);
    fetchUsers();
  };

  return (
     <DashboardLayout>
    <div style={{ padding: "20px" }}>
      <h2>All Users</h2>

      {/* UPDATE FORM (only when editing) */}
      {editUser && (
        <div style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "10px" }}>
          <h3>Edit User</h3>
          <input
            value={editUser.username}
            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
            placeholder="Username"
          />
          <input
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            placeholder="Email"
          />
          <button onClick={updateUser} style={{ marginLeft: "10px" }}>Save</button>
          <button onClick={() => setEditUser(null)} style={{ marginLeft: "5px" }}>Cancel</button>
        </div>
      )}

      {/* USER TABLE */}
      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th width="200px">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>

                <td>
                  <button
                    onClick={() => setEditUser(user)}
                    style={{ marginRight: "10px" }}
                  >
                    Update
                  </button>

                  <button
                    onClick={() => {
                        console.log("Selected user ID:", user.id);
                        deleteUser(user.id)}}
                    style={{ background: "red", color: "white" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    </DashboardLayout>
  );
}
