import React, { useState } from 'react';
import Title from '../components/Title';
import Button from '../components/Button';
import { IoMdAdd } from 'react-icons/io';
import { getInitials } from '../utils/index';
import clsx from 'clsx';
import ConfirmatioDialog, { UserAction } from '../components/Dialogs';
import UpdateUser from '../components/UpdateUser';
import SearchUsers from '../components/SearchUsers';
import {
    useDeleteUserMutation,
    useUserActionMutation,
} from '../redux/slices/api/userApiSlice';
import {
    useAddUserToGroupMutation,
    useGetGroupMembersQuery,
    useRemoveUserFromGroupMutation,
} from '../redux/slices/api/groupApiSlice';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

const Users = ({}) => {
    const location = useLocation(); // Access the passed state
    const groupId = location.state?.groupId;

    const [openDialog, setOpenDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [openAction, setOpenAction] = useState(false);
    const [openSearchPopup, setOpenSearchPopup] = useState(false); // State untuk popup pencarian
    const [selected, setSelected] = useState(null);

    // Fetch members for the selected group
    const {
        data: members,
        isLoading,
        refetch,
    } = useGetGroupMembersQuery(groupId);
    const [removeUserFromGroup] = useRemoveUserFromGroupMutation();

    console.log('Users: members:', members);

    const [addUserToGroup] = useAddUserToGroupMutation();
    const [userAction] = useUserActionMutation();
    const [deleteUser] = useDeleteUserMutation();

    const handleAddUser = async (userId) => {
        try {
            console.log('Adding user to group:', userId);
            const result = await addUserToGroup({ groupId, userId }).unwrap();

            if (result.status) {
                toast.success(result.message);
            } else {
                toast.info(result.message); // User sudah ada di grup
            }

            refetch(); // Refresh group members after adding
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error(error?.data?.message || 'Failed to add user');
        }
    };

    const userActionHandler = async () => {
        try {
            console.log('Users: userActionHandler:', selected);
            const result = await userAction({
                isActive: !selected?.user.isActive,
                id: selected?.user.id,
            });
            refetch();
            console.log('Users: userActionHandler: result:', result);
            toast.success(result.data.message);
            setSelected(null);
            setTimeout(() => {
                setOpenAction(false);
            }, 500);
        } catch (error) {
            console.log('Users: userActionHandler: error:', error);
            toast.error(error?.data?.message || error.error);
        }
    };

    const deleteHandler = async () => {
        try {
            console.log('Deleting user:', selected);
            const result = await removeUserFromGroup({
                groupId,
                userId: selected?.user.id,
            }).unwrap();

            console.log('Delete result:', result);
            toast.success(result.message || 'User removed successfully.');
            setSelected(null);
            setOpenDialog(false);
            refetch(); // Refresh members list
        } catch (error) {
            console.log('Error deleting user:', error);
            toast.error(
                error?.data?.message || 'Failed to remove user from group.'
            );
        }
    };

    const deleteClick = (member) => {
        console.log('Users: deleteClick:', member);
        setSelected(member);
        setOpenDialog(true);
    };

    const userStatusClick = (member) => {
        console.log('Users: userStatusClick:', member);
        setSelected(member);
        setOpenAction(true);
    };

    const handleAddNewUserClick = () => {
        console.log('Users: handleAddNewUserClick');
        setOpenSearchPopup(true); // Buka popup pencarian
    };

    const TableHeader = () => (
        <thead className="w-full border-b border-gray-300">
            <tr className="w-full text-black text-left">
                <th className="py-4 px-5">Full Name</th>
                <th className="py-4 px-5">Username</th>
                <th className="py-4 px-5">Title</th>
                <th className="py-4 px-5">Email</th>
                <th className="py-4 px-5">Role</th>
                <th className="py-4 px-5">Active</th>
                <th className="py-4 px-5">Action</th>
            </tr>
        </thead>
    );

    const TableRow = ({ member }) => (
        <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
            <td className="p-2">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
                        <span className="text-xs md:text-sm text-center">
                            {getInitials(member.user.name)}
                        </span>
                    </div>
                    {member.user.name}
                </div>
            </td>
            <td className="py-4 px-5">{member.user.username}</td>
            <td className="py-4 px-5">{member.user.title}</td>
            <td className="py-4 px-5">{member.user.email || 'N/A'}</td>
            <td className="py-4 px-5">{member.role}</td>

            <td>
                <button
                    onClick={() => userStatusClick(member)}
                    className={clsx(
                        'w-fit px-4 py-1 rounded-full',
                        member.user.isActive ? 'bg-blue-200' : 'bg-yellow-100'
                    )}>
                    {member.user.isActive ? 'Active' : 'Disabled'}
                </button>
            </td>

            <td className="p-2 flex gap-4 justify-end">
                <Button
                    className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
                    label="Delete"
                    type="button"
                    onClick={() => deleteClick(member)}
                />
            </td>
        </tr>
    );

    return (
        <>
            <div className="w-full md:px-1 px-0 mb-6">
                <div className="flex items-center justify-between mb-8">
                    <Title title="Team Members" />
                    <Button
                        label="Add New User"
                        icon={<IoMdAdd className="text-lg" />}
                        className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
                        onClick={handleAddNewUserClick} // Panggil handler untuk membuka popup
                    />
                </div>

                <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
                    <div className="overflow-x-auto">
                        <table className="w-full mb-5">
                            <TableHeader />
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-4">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : (
                                    members?.map((member, index) => (
                                        <TableRow key={index} member={member} />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <UpdateUser
                open={open}
                setOpen={setOpen}
                userData={selected?.user}
                key={new Date().getTime().toString()}
            />

            <ConfirmatioDialog
                open={openDialog}
                setOpen={setOpenDialog}
                onClick={deleteHandler}
            />

            <UserAction
                open={openAction}
                setOpen={setOpenAction}
                onClick={userActionHandler}
            />

            <SearchUsers
                isOpen={openSearchPopup}
                onClose={() => setOpenSearchPopup(false)} // Tutup popup
                onAddUser={(user) => handleAddUser(user.id)}
            />
        </>
    );
};

export default Users;
