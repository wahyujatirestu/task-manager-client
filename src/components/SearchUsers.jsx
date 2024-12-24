import React, { useState, useEffect } from 'react';
import { useSearchUsersQuery } from '../redux/slices/api/userApiSlice';
import { getInitials } from '../utils';

const SearchUser = ({ isOpen, onClose, onAddUser }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { data, isLoading, refetch } = useSearchUsersQuery(searchQuery, {
        skip: !searchQuery || searchQuery.length < 2, // Skip jika query kosong atau kurang dari 2 karakter
    });

    useEffect(() => {
        if (data && data.data) {
            setSearchResults(data.data);
        }
    }, [data]);

    const handleAddUser = (user) => {
        onAddUser(user); // Callback untuk menambahkan user
        onClose(); // Tutup popup
    };

    if (!isOpen) return null; // Tidak render jika popup tidak terbuka

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => e.stopPropagation()} // Pastikan tidak menutup modal utama
        >
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add New User</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    autoFocus // Fokus otomatis pada `textbox`
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                />
                {isLoading && <p>Loading...</p>}
                {searchResults.length > 0 && (
                    <ul className="max-h-60 overflow-y-auto">
                        {searchResults.map((user) => (
                            <li
                                key={user.id}
                                className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleAddUser(user)}>
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                        {getInitials(user.name)}
                                    </div>
                                    <span className="ml-3 text-gray-800">
                                        {user.name}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {user.email}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
                {!isLoading && searchResults.length === 0 && searchQuery && (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchUser;
