import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    useCreateGroupMutation,
    useGetUserGroupsQuery,
    useAddUserToGroupMutation,
} from '../redux/slices/api/groupApiSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdDelete, MdDetails } from 'react-icons/md';
import Button from '../components/Button';
import ModalWrapper from '../components/ModalWrapper';
import Textbox from '../components/Textbox';
import Loading from '../components/Loader';
import AddTask from '../components/task/AddTask';
import { formatDate } from '../utils';
import clsx from 'clsx';

const Teams = () => {
    const navigate = useNavigate();
    const {
        data: groupsData = {},
        isLoading,
        refetch,
    } = useGetUserGroupsQuery();
    const groups = groupsData.groups || [];

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [openTaskModal, setOpenTaskModal] = useState(false);

    const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation();

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            toast.error('Group name is required');
            return;
        }
        try {
            await createGroup({ name: groupName }).unwrap();
            toast.success('Group created successfully!');
            refetch();
            setOpenCreateModal(false);
            setGroupName('');
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to create group');
        }
    };

    const handleGroupAction = (action, group) => {
        if (action === 'createTask') {
            setSelectedGroup(group);
            setOpenTaskModal(true);
        } else if (action === 'leave') {
            toast.info(`Leaving group ${group.name}`);
            // Implement leave logic here
        } else if (action === 'details') {
            navigate(`/team`, { state: { groupId: group.id } }); // Navigate to Users with groupId
        }
    };

    const TableHeader = () => (
        <thead className="w-full border-b border-gray-300">
            <tr className="w-full text-black text-left">
                <th className="py-4 px-5"></th>
                <th className="py-4 px-5">Team Name</th>
                <th className="py-4 px-5">Created At</th>
                <th className="py-4 px-5">Members</th>
                <th className="py-4 px-5">Create Task</th>
                <th className="py-4 px-5">Leave Team</th>
                <th className="py-4 px-5">Details</th>
            </tr>
        </thead>
    );

    const TableRow = ({ group }) => (
        <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
            <td className="py-4 px-5">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    {group?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
            </td>
            <td className="py-4 px-5">
                <p className="text-base text-black font-semibold">
                    {group.name}
                </p>
            </td>
            <td className="py-4 px-5">
                <span className="text-sm text-gray-600">
                    {formatDate(new Date(group.createdAt))}
                </span>
            </td>
            <td className="py-4 px-5">
                <span className="text-sm text-gray-600">
                    {group.members?.length || 0} Members
                </span>
            </td>
            <td className="py-4 px-5 ">
                <Button
                    className="text-blue-600 hover:text-blue-500 text-sm md:text-base"
                    icon={<MdEdit size={20} />}
                    type="button"
                    onClick={() => handleGroupAction('createTask', group)}
                />
            </td>
            <td className="py-4 px-5">
                <Button
                    className="text-red-700 hover:text-red-500 text-sm md:text-base"
                    icon={<MdDelete size={20} />}
                    type="button"
                    onClick={() => handleGroupAction('leave', group)}
                />
            </td>
            <td className="py-4 px-5">
                <Button
                    className="text-gray-700 hover:text-gray-500 text-sm md:text-base"
                    icon={<MdDetails size={20} />}
                    type="button"
                    onClick={() => handleGroupAction('details', group)}
                />
            </td>
        </tr>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 md:px-10">
            <div className="flex items-center justify-between w-full max-w-6xl mb-6">
                {/* <h1 className="text-3xl font-bold">My Teams</h1> */}
                <Button
                    label="Create Team"
                    className="bg-blue-600 text-white px-6 py-2 rounded"
                    onClick={() => setOpenCreateModal(true)}
                />
            </div>

            {isLoading ? (
                <Loading />
            ) : (
                <div className="bg-white w-full max-w-6xl px-4 pt-6 pb-9 shadow-md rounded">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <TableHeader />
                            <tbody>
                                {groups.map((group) => (
                                    <TableRow key={group.id} group={group} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ModalWrapper open={openCreateModal} setOpen={setOpenCreateModal}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Create Team</h2>
                    <Textbox
                        placeholder="Enter group name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="mb-4 w-full"
                    />
                    <div className="flex justify-end gap-4">
                        <Button
                            label="Cancel"
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                            onClick={() => setOpenCreateModal(false)}
                        />
                        <Button
                            label={isCreating ? 'Creating...' : 'Create'}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                            disabled={isCreating}
                            onClick={handleCreateGroup}
                        />
                    </div>
                </div>
            </ModalWrapper>

            <AddTask
                open={openTaskModal}
                setOpen={setOpenTaskModal}
                task={null}
                groups={groups}
                groupId={selectedGroup?.id}
            />
        </div>
    );
};

export default Teams;
