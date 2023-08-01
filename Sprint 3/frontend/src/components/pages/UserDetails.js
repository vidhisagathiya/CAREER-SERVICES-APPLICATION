import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './UserList';
import UserProfile from './UserProfile';

const UserDetails = () => {
  // Assuming users is an array of user profiles with id, name, email, and other properties
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  useEffect(() => {
    // Fetch user profiles from the backend API or any data source
    axios.get('/api/users').then((response) => {
      setUsers(response.data);
    });
  }, []);

  useEffect(() => {
    // Fetch selected user details when selectedUserId changes
    if (selectedUserId) {
      axios.get(`/api/users/${selectedUserId}`).then((response) => {
        setSelectedUserDetails(response.data);
      });
    }
  }, [selectedUserId]);

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <UserList users={users} onSelectUser={handleSelectUser} />
      {selectedUserDetails && <UserProfile user={selectedUserDetails} />}
    </div>
  );
};

export default UserDetails;
