// components/UpdateUsername.js
import React, { useState } from 'react';
import axios from 'axios';

const UpdateUsername = ({ userId, onUpdateUsername }) => {
    const [newUsername, setNewUsername] = useState('');

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`/user/update-username/${userId}`, {
                newUsername,
            });
            console.log(response.data); // Handle success
            onUpdateUsername(newUsername); // Notify parent component about the update
        } catch (error) {
            console.error('Error updating username:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
            />
            <button onClick={handleUpdate}>Update Username</button>
        </div>
    );
};

export default UpdateUsername;
