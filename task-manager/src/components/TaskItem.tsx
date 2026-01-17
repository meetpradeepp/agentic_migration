import { useState } from 'react';
import { Task } from '../types';
import { useTasks } from '../contexts/TaskContext';
import { formatDate } from '../utils/dateUtils';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
}

/**
 * TaskItem component for displaying individual task with inline editing
 */
export function TaskItem({ task }: TaskItemProps) {
  const { updateTask, deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  /**
   * Toggles task completion status
   */
  const handleToggleComplete = () => {
    updateTask(task.id, {
      status: task.status === 'completed' ? 'todo' : 'completed',
    });
  };

  /**
   * Handles title edit submission
   */
  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      updateTask(task.id, { title: editedTitle.trim() });
    } else {
      setEditedTitle(task.title); // Reset if empty or unchanged
    }
    setIsEditing(false);
  };

  /**
   * Handles Enter key to save, Escape to cancel
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setEditedTitle(task.title);
      setIsEditing(false);
    }
  };

  /**
   * Deletes the task
   */
  const handleDelete = () => {
    if (confirm(`Delete task "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  return (
    <div
      className={`task-item task-item--${task.priority} ${
        task.status === 'completed' ? 'task-item--completed' : ''
      }`}
    >
      <div className="task-item__main">
        <input
          type="checkbox"
          checked={task.status === 'completed'}
          onChange={handleToggleComplete}
          className="task-item__checkbox"
          aria-label={`Mark "${task.title}" as ${
            task.status === 'completed' ? 'incomplete' : 'complete'
          }`}
        />

        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleKeyDown}
            className="task-item__title-edit"
            autoFocus
            aria-label="Edit task title"
          />
        ) : (
          <div
            className="task-item__title"
            onClick={() => setIsEditing(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsEditing(true);
            }}
            aria-label="Click to edit task title"
          >
            {task.title}
          </div>
        )}

        <div className="task-item__actions">
          <button
            onClick={handleDelete}
            className="task-item__delete"
            aria-label="Delete task"
            type="button"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="task-item__meta">
        <span className={`task-item__priority task-item__priority--${task.priority}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="task-item__due-date">
            Due: {formatDate(task.dueDate, 'MMM d')}
          </span>
        )}
        {task.tags.length > 0 && (
          <div className="task-item__tags">
            {task.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="task-item__tag">
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="task-item__tag-more">+{task.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
