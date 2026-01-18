import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { useTasks } from '../contexts/TaskContext';
import './TaskForm.css';

interface TaskFormProps {
  taskToEdit?: Task;
  onClose: () => void;
  defaultListId?: string;
}

/**
 * TaskForm component for creating and editing tasks
 * 
 * @param taskToEdit - Optional task to edit. If provided, form is in edit mode
 * @param onClose - Callback when form is closed
 * @param defaultListId - Optional default list ID to pre-select in the dropdown
 */
export function TaskForm({ taskToEdit, onClose, defaultListId }: TaskFormProps) {
  const { addTask, updateTask, lists } = useTasks();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('none');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [listId, setListId] = useState<string>('');

  // Initialize form with task data if editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setTags(taskToEdit.tags.join(', '));
      setDueDate(taskToEdit.dueDate ? formatDateForInput(taskToEdit.dueDate) : '');
      setListId(taskToEdit.listId || '');
    } else if (defaultListId) {
      // Set default list ID when creating a new task
      setListId(defaultListId);
    }
  }, [taskToEdit, defaultListId]);

  /**
   * Format date for input field (YYYY-MM-DD)
   */
  const formatDateForInput = (date: Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * Parse tags from comma-separated string
   */
  const parseTags = (tagString: string): string[] => {
    return tagString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      tags: parseTags(tags),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      listId: listId || undefined,
    };

    if (taskToEdit) {
      // Update existing task
      updateTask(taskToEdit.id, taskData);
    } else {
      // Create new task
      addTask(taskData);
    }

    onClose();
  };

  /**
   * Handle cancel action
   */
  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="task-form-overlay" onClick={handleCancel}>
      <div className="task-form" onClick={(e) => e.stopPropagation()}>
        <div className="task-form-header">
          <h2>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
          <button 
            type="button" 
            className="close-button" 
            onClick={handleCancel}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="list">List</label>
              <select
                id="list"
                value={listId}
                onChange={(e) => setListId(e.target.value)}
              >
                <option value="">No List</option>
                {lists.map(list => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated tags (e.g., work, urgent)"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="button-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="button-primary">
              {taskToEdit ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
