"use client"

import React, { useState, useRef } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const tasksData = [
  { id: 1, status: 'To Do', title: 'Task 1' },
  { id: 2, status: 'In Progress', title: 'Task 2' },
  { id: 3, status: 'Done', title: 'Task 3' }
];

const Card = ({ task, handleDelete, moveTask, findTask }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'CARD',
    hover(item) {
      if (!ref.current) {
        return;
      }
      const { index: draggedIndex } = item;
      const { index: hoverIndex } = findTask(task.id);
      if (draggedIndex !== hoverIndex) {
        moveTask(draggedIndex, hoverIndex);
        item.index = hoverIndex;
      }
    }
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { id: task.id, index: findTask(task.id).index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  drag(drop(ref));
  const opacity = isDragging ? 0.5 : 1;
  return (
    <div
      ref={ref}
      className="p-4 m-2 bg-white shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      style={{ opacity }}
      tabIndex={0}
    >
      <div className="flex justify-between">
        <h3 className="font-bold text-lg">{task.title}</h3>
        <button onClick={() => handleDelete(task.id)} aria-label="Delete task" className="text-red-500">
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState(tasksData);
  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  };
  const findTask = id => {
    const task = tasks.filter(t => t.id === id)[0];
    return {
      task,
      index: tasks.indexOf(task)
    };
  };
  const handleDelete = id => setTasks(tasks.filter(task => task.id !== id));
  const handleAdd = () => {
    const newTask = { id: tasks.length + 1, status: 'To Do', title: `Task ${tasks.length + 1}` };
    setTasks([...tasks, newTask]);
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Task Board</h1>
            <button onClick={handleAdd} aria-label="Add task" className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded shadow">
              <FiPlus className="mr-2" /> Add Task
            </button>
          </div>
          <div className="grid gap-4 grid-cols-3">
            {tasks.map((task, index) => (
              <Card
                key={task.id}
                task={task}
                handleDelete={handleDelete}
                moveTask={moveTask}
                findTask={findTask}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default TaskBoard;
