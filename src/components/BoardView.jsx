import React from 'react';
import TaskCard from './TaskCard';

const BoardView = ({ tasks = [] }) => {
    const todoTasks = tasks.filter((task) => task.stage === 'TODO');
    const inProgressTasks = tasks.filter(
        (task) => task.stage === 'IN_PROGRESS'
    );
    const completedTasks = tasks.filter((task) => task.stage === 'COMPLETED');

    const handleDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        // If there is no destination (dropped outside the list)
        if (!destination) return;

        // If the task is dropped in the same column
        if (source.droppableId === destination.droppableId) return;

        // Call the function to update the task status
        onUpdateTaskStatus(draggableId, destination.droppableId);
    };

    return (
        <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10">
            {tasks &&
                tasks.map((task, index) => (
                    <TaskCard task={task} key={index} />
                ))}
        </div>
    );
};

export default BoardView;
