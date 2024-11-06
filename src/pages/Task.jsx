import React, { useState } from 'react';
import { FaList } from 'react-icons/fa';
import { MdGridView } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loader';
import Title from '../components/Title';
import Button from '../components/Button';
import { IoMdAdd } from 'react-icons/io';
import Tabs from '../components/Tabs';
import TaskTitle from '../components/TaskTitle';
import BoardView from '../components/BoardView';
import Table from '../components/task/Table';
import AddTask from '../components/task/AddTask';
import { useGetAllTaskQuery } from '../redux/slices/api/taskApiSlice';

const TASK_TYPE = {
    TODO: 'bg-blue-600',
    IN_PROGRESS: 'bg-yellow-600',
    COMPLETED: 'bg-green-600',
};

const TABS = [
    { title: 'Board View', icon: <MdGridView /> },
    { title: 'List View', icon: <FaList /> },
];

const Tasks = () => {
    const params = useParams();
    const [selected, setSelected] = useState(0);
    const [open, setOpen] = useState(false);

    const status = params?.status || '';

    const { data, isLoading } = useGetAllTaskQuery({
        strQuery: status,
        isTrashed: '',
        search: '',
    });

    // Filter tasks based on status/stage
    const filteredTasks = status
        ? data?.tasks.filter((task) => task.stage === status)
        : data?.tasks;

    const handleCreateTaskClick = () => {
        setOpen(true);
    };

    return isLoading ? (
        <div className="py-10">
            <Loading />
        </div>
    ) : (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <Title title={status ? `${status} Tasks` : 'Tasks'} />

                {!status && (
                    <Button
                        onClick={handleCreateTaskClick}
                        label="Create Task"
                        icon={<IoMdAdd className="text-lg" />}
                        className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
                    />
                )}
            </div>

            <Tabs tabs={TABS} setSelected={setSelected} selected={selected}>
                {!status && (
                    <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
                        <TaskTitle label="To Do" className={TASK_TYPE.TODO} />
                        <TaskTitle
                            label="In Progress"
                            className={TASK_TYPE.IN_PROGRESS}
                        />
                        <TaskTitle
                            label="Completed"
                            className={TASK_TYPE.COMPLETED}
                        />
                    </div>
                )}

                {selected !== 1 ? (
                    <BoardView tasks={filteredTasks} />
                ) : (
                    <div className="w-full">
                        <Table tasks={filteredTasks} />
                    </div>
                )}
            </Tabs>

            <AddTask open={open} setOpen={setOpen} />
        </div>
    );
};

export default Tasks;
