import { Listbox, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { BsChevronExpand } from 'react-icons/bs';
import { useGetGroupMembersQuery } from '../../redux/slices/api/groupApiSlice';
import clsx from 'clsx';
import { getInitials } from '../../utils';
import { MdCheck } from 'react-icons/md';

const UserList = ({ groupId, setTeam, team }) => {
    const {
        data: members,
        isLoading,
        error,
    } = useGetGroupMembersQuery(groupId);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        if (!isLoading && members) {
            if (team?.length > 0) {
                // Sinkronkan `team` dengan `members`
                const syncedUsers = members.filter((user) =>
                    team.includes(user.userId)
                );
                setSelectedUsers(syncedUsers);
            } else {
                setSelectedUsers([]);
            }
        }
    }, [team, members, isLoading]);

    const handleChange = (users) => {
        setSelectedUsers(users);
        setTeam(users.map((u) => u.userId)); // Kirim hanya userId
    };

    if (isLoading) return <p>Loading group members...</p>;
    if (error) return <p>Failed to fetch group members.</p>;

    return (
        <div>
            <p className="text-gray-700">Assign Task To:</p>
            <Listbox value={selectedUsers} onChange={handleChange} multiple>
                <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded bg-white pl-3 pr-10 text-left px-3 py-2.5 border border-gray-300 sm:text-sm">
                        <span className="block truncate">
                            {selectedUsers.length > 0
                                ? selectedUsers
                                      .map((user) => user.user.name)
                                      .join(', ')
                                : 'Select assignees'}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <BsChevronExpand
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {members.map((member) => (
                                <Listbox.Option
                                    key={member.userId}
                                    className={({ active }) =>
                                        clsx(
                                            'relative cursor-default select-none py-2 pl-10 pr-4',
                                            active
                                                ? 'bg-amber-100 text-amber-900'
                                                : 'text-gray-900'
                                        )
                                    }
                                    value={member}>
                                    {({ selected }) => (
                                        <>
                                            <div
                                                className={clsx(
                                                    'flex items-center gap-2 truncate',
                                                    selected
                                                        ? 'font-medium'
                                                        : 'font-normal'
                                                )}>
                                                <div className="w-6 h-6 rounded-full text-white flex items-center justify-center bg-blue-600">
                                                    <span className="text-center text-[10px]">
                                                        {getInitials(
                                                            member.user.name
                                                        )}
                                                    </span>
                                                </div>
                                                <span>{member.user.name}</span>
                                            </div>
                                            {selected && (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                    <MdCheck
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
};

export default UserList;
