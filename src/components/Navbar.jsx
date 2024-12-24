import React, { useState, useEffect } from 'react';
import { MdOutlineSearch } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSidebar } from '../redux/slices/authSlice';
import UserAvatar from './UserAvatar';
import NotificationPanel from './NotificationPanel';
import { useSearchTaskQuery } from '../redux/slices/api/taskApiSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const { data, isLoading } = useSearchTaskQuery(search, {
        skip: !search,
    }); // Panggil query API

    const handleSearchSelect = (task) => {
        setSearch(task.title);
        setShowSuggestions(false);
        // Navigasi ke detail tugas jika diperlukan
        // navigate(`/tasks/${task.id}`);
    };

    return (
        <div className="flex justify-between items-center shadow-sm bg-white px-4 py-3 2xl:py-4 sticky z-10 top-0">
            <div className="flex gap-4 relative">
                <button
                    onClick={() => dispatch(setOpenSidebar(true))}
                    className="text-2xl text-gray-500 block md:hidden">
                    ☰
                </button>

                <div className="relative w-64 2xl:w-[400px]">
                    <div className="flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6]">
                        <MdOutlineSearch className="text-gray-500 text-xl" />

                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() =>
                                setTimeout(() => setShowSuggestions(false), 200)
                            }
                            className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
                        />
                    </div>

                    {showSuggestions &&
                        !isLoading &&
                        data?.tasks?.length > 0 && (
                            <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-60 overflow-y-auto z-50">
                                {data.tasks.map((task) => (
                                    <li
                                        key={task.id}
                                        onClick={() => handleSearchSelect(task)}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        {task.title}
                                    </li>
                                ))}
                            </ul>
                        )}

                    {showSuggestions &&
                        !isLoading &&
                        data?.tasks?.length === 0 && (
                            <div className="absolute left-0 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 p-4 text-gray-500 text-sm">
                                No results found.
                            </div>
                        )}
                </div>
            </div>

            <div className="flex gap-2 items-center">
                <NotificationPanel />

                <UserAvatar />
            </div>
        </div>
    );
};

export default Navbar;
