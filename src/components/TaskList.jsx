import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchTaskQuery } from '../redux/slices/api/taskApiSlice';
import Loading from '../components/Loader';

const TaskList = () => {
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') || '';
    const priority = searchParams.get('priority') || '';
    const stage = searchParams.get('stage') || '';

    const { data, isLoading, isError } = useSearchTaskQuery({
        search,
        priority,
        stage,
    });

    if (isLoading) return <Loading />;
    if (isError) return <div>Error loading tasks!</div>;

    return (
        <div className="task-list">
            <h1 className="text-2xl font-bold">Task List</h1>
            <ul className="mt-4 space-y-4">
                {data?.tasks?.map((task) => (
                    <li
                        key={task.id}
                        className="p-4 border rounded shadow-sm bg-white">
                        <h2 className="text-lg font-bold">{task.title}</h2>
                        <p>Priority: {task.priority}</p>
                        <p>Stage: {task.stage}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
