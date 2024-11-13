import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import {
    MdAttachFile,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
} from 'react-icons/md';
import { useSelector } from 'react-redux';
import { BGS, PRIOTITYSTYLES, TASK_TYPE, formatDate } from '../utils';
import TaskDialog from './task/TaskDialog';
import { BiMessageAltDetail } from 'react-icons/bi';
import { FaList } from 'react-icons/fa';
import UserInfo from './UserInfo';
import { IoMdAdd } from 'react-icons/io';
import AddSubTask from './task/AddSubTask';
import {
    useCreateSubTaskMutation,
    useGetSubTaskQuery,
} from '../redux/slices/api/taskApiSlice';
import { HiMinusSm } from 'react-icons/hi';

// Fungsi ICONS berada di dalam file ini untuk menghindari error JSX
const ICONS = (priority) => {
    if (priority === 'HIGH') {
        return <MdKeyboardDoubleArrowUp className="text-red-600" />;
    } else if (priority === 'MEDIUM') {
        return <MdKeyboardArrowUp className="text-yellow-600" />;
    } else if (priority === 'LOW') {
        return <MdKeyboardArrowDown className="text-blue-600" />;
    } else {
        return <HiMinusSm className="text-gray-400" />;
    }
};

const TaskCard = ({ task }) => {
    const { user } = useSelector((state) => state.auth);
    const [open, setOpen] = useState(false);

    const { data: subTaskData, refetch: refetchSubTasks } = useGetSubTaskQuery(
        task.id
    );

    const [createSubTask] = useCreateSubTaskMutation();

    const handleCreateSubTask = async (data) => {
        try {
            await createSubTask({ data, id: task.id });
            refetchSubTasks();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        refetchSubTasks();
    }, [task]);

    return (
        <>
            <div className="w-full h-fit bg-white shadow-md p-4 rounded">
                <div className="w-full flex justify-between">
                    <div className="flex flex-1 items-center gap-2">
                        <span className="text-lg mb-1">
                            {ICONS(task?.priority)}
                        </span>
                        <span
                            className={clsx(
                                'uppercase text-sm font-medium px-1 py-1 rounded-lg flex items-center justify-center',
                                PRIOTITYSTYLES[task?.priority.toLowerCase()]
                            )}>
                            {task?.priority} Priority
                        </span>
                    </div>

                    {user?.isAdmin && <TaskDialog task={task} />}
                </div>

                <>
                    <div className="flex items-center gap-2">
                        <div
                            className={clsx(
                                'w-4 h-4 rounded-full',
                                TASK_TYPE[task?.stage]
                            )}
                        />
                        <h4 className="line-clamp-1 text-black  py-1 mt-[3px]">
                            {task?.title}
                        </h4>
                    </div>
                    <span className="text-sm text-gray-600">
                        {formatDate(new Date(task?.date))}
                    </span>
                </>

                <div className="w-full border-t border-gray-200 my-2" />
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1 items-center text-sm text-gray-600">
                            <BiMessageAltDetail />
                            <span>{task?.activities?.length}</span>
                        </div>
                        <div className="flex gap-1 items-center text-sm text-gray-600 ">
                            <MdAttachFile />
                            <span>{task?.assets?.length}</span>
                        </div>
                        <div className="flex gap-1 items-center text-sm text-gray-600 ">
                            <FaList />
                            <span>0/{task?.subTasks?.length}</span>
                        </div>
                    </div>

                    <div className="flex flex-row-reverse">
                        {task?.team?.map((m, index) => (
                            <div
                                key={index}
                                className={clsx(
                                    'w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1',
                                    BGS[index % BGS?.length]
                                )}>
                                <UserInfo user={m} />
                            </div>
                        ))}
                    </div>
                </div>

                {subTaskData?.subTasks?.length > 0 ? (
                    <div className="py-4 border-t border-gray-200">
                        {subTaskData?.subTasks.map((subTask, index) => (
                            <div key={index} className="mb-2">
                                <h5 className="text-base line-clamp-1 text-black">
                                    {subTask.title}
                                </h5>
                                <div className="p-4 space-x-8">
                                    <span className="text-sm text-gray-600">
                                        {formatDate(new Date(subTask.date))}
                                    </span>
                                    <span className="bg-blue-600/10 px-3 py-1 rounded-full text-blue-700 font-medium">
                                        {subTask.tag}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-4 border-t border-gray-200">
                        <span className="text-gray-500">No Sub Task</span>
                    </div>
                )}

                <div className="w-full pb-2">
                    <button
                        onClick={() => setOpen(true)}
                        disabled={user.isAdmin ? false : true}
                        className="w-full flex gap-4 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed disabled::text-gray-300">
                        <IoMdAdd className="text-lg" />
                        <span>ADD SUBTASK</span>
                    </button>
                </div>
            </div>

            <AddSubTask
                open={open}
                setOpen={setOpen}
                id={task.id}
                onCreateSubTask={handleCreateSubTask}
            />
        </>
    );
};

export default TaskCard;
