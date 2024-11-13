// taskDetail.jsx

import clsx from 'clsx';
import moment from 'moment';
import React, { useState } from 'react';
import { FaBug, FaTasks, FaThumbsUp, FaUser } from 'react-icons/fa';
import { GrInProgress } from 'react-icons/gr';
import {
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
    MdOutlineDoneAll,
    MdOutlineMessage,
    MdTaskAlt,
} from 'react-icons/md';
import { RxActivityLog } from 'react-icons/rx';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Tabs from '../components/Tabs';
import { PRIOTITYSTYLES, TASK_TYPE, formatStage, getInitials } from '../utils';
import Loading from '../components/Loader';
import Button from '../components/Button';
import {
    useGetSingleTaskQuery,
    usePostTaskActivityMutation,
} from '../redux/slices/api/taskApiSlice';
import { HiMinusSm } from 'react-icons/hi';

const ICONS = {
    high: <MdKeyboardDoubleArrowUp className="text-red-600" />,
    medium: <MdKeyboardArrowUp className="text-yellow-600" />,
    normal: <HiMinusSm className="text-gray-600" />,
    low: <MdKeyboardArrowDown className="text-blue-600" />,
};

const bgColor = {
    high: 'bg-red-100',
    medium: 'bg-yellow-100',
    normal: 'bg-gray-100',
    low: 'bg-blue-100',
};

const TABS = [
    { title: 'Task Detail', icon: <FaTasks /> },
    { title: 'Activities/Timeline', icon: <RxActivityLog /> },
];

// Menambahkan pemetaan label untuk tipe aktivitas
const typeLabels = {
    Commented: 'Commented',
    Started: 'Started',
    Assigned: 'Assigned',
    Bug: 'Bug',
    Completed: 'Completed',
    IN_PROGRESS: 'In-Progress', // Displayed label updated
};

// Memastikan semua kunci sesuai dengan ActivityType yang didefinisikan di enum
const TASKTYPEICON = {
    Commented: (
        <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
            <MdOutlineMessage />
        </div>
    ),
    Started: (
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <FaThumbsUp size={20} />
        </div>
    ),
    Assigned: (
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
            <FaUser size={14} />
        </div>
    ),
    Bug: (
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
            <FaBug size={24} />
        </div>
    ),
    Completed: (
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
            <MdOutlineDoneAll size={24} />
        </div>
    ),
    IN_PROGRESS: (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white">
            <GrInProgress size={16} />
        </div>
    ),
};

const act_types = [
    'Started',
    'Completed',
    'IN_PROGRESS',
    'Commented',
    'Bug',
    'Assigned',
];

const TaskDetails = () => {
    const { id } = useParams();
    const { data, isLoading, refetch } = useGetSingleTaskQuery(id);

    const [selected, setSelected] = useState(0);
    const task = data?.task;

    if (isLoading) {
        return (
            <div className="py-10">
                <Loading />
            </div>
        );
    }

    if (!task) {
        return (
            <div className="py-10">
                <p className="text-center text-gray-500">
                    Task not found or loading...
                </p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
            <h1 className="text-2xl text-gray-600 font-bold">{task?.title}</h1>

            <Tabs tabs={TABS} setSelected={setSelected}>
                {selected === 0 ? (
                    <>
                        <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md p-8 overflow-y-auto">
                            {/* LEFT */}
                            <div className="w-full md:w-1/2 space-y-8">
                                <div className="flex items-center gap-5">
                                    <div
                                        className={clsx(
                                            'flex gap-2 items-center text-base font-semibold px-3 py-1 rounded-full',
                                            bgColor[
                                                task?.priority.toLowerCase()
                                            ]
                                        )}>
                                        <span className="text-lg">
                                            {
                                                ICONS[
                                                    task?.priority.toLowerCase()
                                                ]
                                            }
                                        </span>
                                        <span
                                            className={clsx(
                                                'uppercase',
                                                PRIOTITYSTYLES[
                                                    task?.priority.toLowerCase()
                                                ]
                                            )}>
                                            {task?.priority} Priority
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div
                                            className={clsx(
                                                'w-4 h-4 rounded-full',
                                                TASK_TYPE[task?.stage]
                                            )}
                                        />
                                        <span className="text-black uppercase">
                                            {formatStage(task?.stage) ||
                                                'No Stage'}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-500">
                                    Created At :{' '}
                                    {new Date(task?.date).toDateString()}
                                </p>

                                <div className="flex items-center gap-8 p-4 border-y border-gray-200">
                                    <div className="space-x-2">
                                        <span className="font-semibold">
                                            Assets :
                                        </span>
                                        <span>{task?.assets?.length || 0}</span>
                                    </div>

                                    <span className="text-gray-400">|</span>

                                    <div className="space-x-2">
                                        <span className="font-semibold">
                                            Sub-Task :
                                        </span>
                                        <span>
                                            {task?.subTasks?.length || 0}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 py-6">
                                    <p className="text-gray-600 font-semibold test-sm">
                                        TASK TEAM
                                    </p>
                                    <div className="space-y-3">
                                        {task?.team?.map((m, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-4 py-2 items-center border-t border-gray-200">
                                                <div
                                                    className={
                                                        'w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600'
                                                    }>
                                                    <span className="text-center">
                                                        {getInitials(m?.name)}
                                                    </span>
                                                </div>

                                                <div>
                                                    <p className="text-lg font-semibold">
                                                        {m?.name}
                                                    </p>
                                                    <span className="text-gray-500">
                                                        {m?.title}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 py-6">
                                    <p className="text-gray-500 font-semibold text-sm">
                                        SUB-TASKS
                                    </p>
                                    <div className="space-y-8">
                                        {task?.subTasks?.map((el, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100">
                                                    <MdTaskAlt
                                                        className="text-blue-600"
                                                        size={26}
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex gap-2 items-center">
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(
                                                                el?.date
                                                            ).toDateString()}
                                                        </span>

                                                        <span className="px-2 py-0.5 text-center text-sm rounded-full bg-blue-100 text-blue-700 font-semibold">
                                                            {el?.tag}
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-700">
                                                        {el?.title}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* RIGHT */}
                            <div className="w-full md:w-1/2 space-y-8">
                                <p className="text-lg font-semibold">ASSETS</p>

                                <div className="w-full grid grid-cols-2 gap-4">
                                    {task?.assets?.map((el, index) => (
                                        <img
                                            key={index}
                                            src={el}
                                            alt={task?.title}
                                            className="w-full rounded h-28 md:h-36 2xl:h-52 cursor-pointer transition-all duration-700 hover:scale-125 hover:z-50"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Activities
                            activity={task?.activities}
                            id={id}
                            refetch={refetch}
                        />
                    </>
                )}
            </Tabs>
        </div>
    );
};

// Tambahkan definisi komponen Activities di bawah TaskDetails
const Activities = ({ activity, id, refetch }) => {
    const [selected, setSelected] = useState(act_types[0]);
    const [text, setText] = useState('');

    const [postTaskActivity, { isLoading, error }] =
        usePostTaskActivityMutation();

    const handleSubmit = async () => {
        try {
            const activityData = {
                type: selected,
                activity: text,
            };

            const result = await postTaskActivity({
                data: activityData,
                id,
            }).unwrap();

            setText('');
            toast.success(result?.message);
            refetch();
        } catch (error) {
            console.log(error);
            toast.error(error?.data?.message || error.error);
        }
    };

    const Card = ({ item }) => {
        return (
            <div className="flex space-x-4">
                <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center">
                        {TASKTYPEICON[item?.type]}
                    </div>
                    <div className="w-full flex items-center">
                        <div className="w-0.5 bg-gray-300 h-full"></div>
                    </div>
                </div>

                <div className="flex flex-col gap-y-1 mb-8">
                    <p className="font-semibold">{item?.by?.name}</p>
                    <div className="text-gray-500 space-y-2">
                        <span>{typeLabels[item?.type]}</span>{' '}
                        <span className="text-sm">
                            {moment(item?.date).fromNow()}
                        </span>
                    </div>
                    <div className="text-gray-700">{item?.activity}</div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full flex gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-white shadow rounded-md justify-between overflow-y-auto">
            <div className="w-full md:w-1/2">
                <h4 className="text-gray-600 font-semibold text-lg mb-5">
                    Activities
                </h4>

                <div className="w-full">
                    {activity?.map((el, index) => (
                        <Card
                            key={index}
                            item={el}
                            isConnected={index < activity.length - 1}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full md:w-1/3">
                <h4 className="text-gray-600 font-semibold text-lg mb-5">
                    Add Activity
                </h4>
                <div className="w-full flex flex-wrap gap-5">
                    {act_types.map((item) => (
                        <div key={item} className="flex gap-2 items-center">
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={selected === item}
                                onChange={() => setSelected(item)}
                            />
                            <p>{typeLabels[item]}</p>
                        </div>
                    ))}
                    <textarea
                        rows={10}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type ......"
                        className="bg-white w-full mt-10 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500"></textarea>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <Button
                            type="button"
                            label="Submit"
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white rounded"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
