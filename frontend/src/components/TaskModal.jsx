import { useState, useEffect } from 'react';
import { X, Calendar, User, Flag } from 'lucide-react';
import api from '../api/axios';
import './TaskModal.css';

const TaskModal = ({ isOpen, onClose, onTaskCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        project: '',
        assignedTo: '',
        dueDate: ''
    });
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchProjects();
            fetchUsers();
        }
    }, [isOpen]);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data.data);
        } catch (err) {
            console.error('Error fetching projects:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            // For now, we'll use a simple approach - in a real app you'd have a users endpoint
            // For demo purposes, we'll create some sample users
            setUsers([
                { _id: '1', name: 'John Doe', email: 'john@example.com' },
                { _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
                { _id: '3', name: 'Bob Johnson', email: 'bob@example.com' }
            ]);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post('/tasks', formData);
            onTaskCreated(res.data.data);
            onClose();
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'todo',
                project: '',
                assignedTo: '',
                dueDate: ''
            });
        } catch (err) {
            console.error('Error creating task:', err);
            alert('Failed to create task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Task</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label htmlFor="title">Task Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter task title"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Enter task description"
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="review">Review</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="project">Project *</label>
                        <select
                            id="project"
                            name="project"
                            value={formData.project}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a project</option>
                            {projects.map(project => (
                                <option key={project._id} value={project._id}>
                                    {project.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="assignedTo">Assign To</label>
                            <select
                                id="assignedTo"
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                            >
                                <option value="">Unassigned</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dueDate">Due Date</label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;