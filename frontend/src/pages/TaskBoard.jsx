import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    MessageSquare,
    Paperclip,
    Clock
} from 'lucide-react';
import api from '../api/axios';
import TaskModal from '../components/TaskModal';
import './TaskBoard.css';

const TaskBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggedTask, setDraggedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        { id: 'todo', title: 'To Do', color: 'var(--text-dim)' },
        { id: 'in-progress', title: 'In Progress', color: 'var(--primary)' },
        { id: 'review', title: 'Review', color: 'var(--warning)' },
        { id: 'done', title: 'Done', color: 'var(--success)' },
    ];

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get('/tasks');
                setTasks(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'var(--danger)';
            case 'medium': return 'var(--warning)';
            case 'low': return 'var(--success)';
            default: return 'var(--text-dim)';
        }
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();

        if (!draggedTask || draggedTask.status === newStatus) return;

        try {
            // Update task status in backend
            const res = await api.put(`/tasks/${draggedTask._id}`, {
                status: newStatus
            });

            // Update local state
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === draggedTask._id
                        ? { ...task, status: newStatus }
                        : task
                )
            );

            setDraggedTask(null);
        } catch (err) {
            console.error('Error updating task:', err);
            alert('Failed to update task status');
        }
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleTaskCreated = (newTask) => {
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    return (
        <div className="taskboard-page animate-fade-in">
            <header className="page-header">
                <div>
                    <h1>Task Board</h1>
                    <p className="text-muted">Manage your workload across different stages.</p>
                </div>
                <div className="board-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input type="text" placeholder="Search tasks..." />
                    </div>
                    <button className="btn btn-outline">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                    <button className="btn btn-primary" onClick={handleOpenModal}>
                        <Plus size={18} />
                        <span>New Task</span>
                    </button>
                </div>
            </header>

            <div className="kanban-board">
                {columns.map(column => (
                    <div key={column.id} className="kanban-column">
                        <div className="column-header">
                            <div className="column-title">
                                <span className="status-dot" style={{ background: column.color }}></span>
                                <h3>{column.title}</h3>
                                <span className="task-count">{tasks.filter(t => t.status === column.id).length}</span>
                            </div>
                            <button className="icon-btn"><MoreHorizontal size={18} /></button>
                        </div>

                        <div
                            className={`column-body ${draggedTask ? 'drag-over' : ''}`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column.id)}
                        >
                            {tasks.filter(t => t.status === column.id).map(task => (
                                <div
                                    key={task._id}
                                    className={`task-card glass-card ${draggedTask && draggedTask._id === task._id ? 'dragging' : ''}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <div className="task-card-header">
                                        <span className="priority-badge" style={{ color: getPriorityColor(task.priority), background: `${getPriorityColor(task.priority)}20` }}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <h4>{task.title}</h4>
                                    <p>{task.description}</p>

                                    <div className="task-card-footer">
                                        <div className="task-meta">
                                            <div className="meta-item">
                                                <Clock size={14} />
                                                <span>2 days left</span>
                                            </div>
                                        </div>
                                        <div className="assignees">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="user" className="mini-avatar" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="add-task-btn">
                                <Plus size={18} />
                                <span>Add Task</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onTaskCreated={handleTaskCreated}
            />
        </div>
    );
};

export default TaskBoard;
