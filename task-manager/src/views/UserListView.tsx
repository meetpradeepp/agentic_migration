import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import { TaskList } from '../components/TaskList';
import { FilterBar } from '../components/FilterBar';
import { TaskForm } from '../components/TaskForm';
import './UserListView.css';

/**
 * UserListView for displaying tasks from specific user lists
 * Shows tasks filtered by list ID from route parameters
 */
export function UserListView() {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { tasks, lists, filter, setFilter } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Find the list by ID
  const list = lists.find(l => l.id === listId);

  // Set filter to show only tasks from this list
  useEffect(() => {
    if (listId) {
      setFilter({ ...filter, listId });
    }
    
    // Cleanup: clear list filter when component unmounts
    return () => {
      setFilter({ ...filter, listId: undefined });
    };
  }, [listId]);

  // Redirect if list not found
  useEffect(() => {
    if (!list && listId) {
      navigate('/all-tasks');
    }
  }, [list, listId, navigate]);

  if (!list) {
    return null; // Will redirect
  }

  const listTasks = tasks.filter(t => t.listId === listId);

  return (
    <div className="user-list-view">
      <div className="user-list-header">
        <div className="list-title-section">
          <div 
            className="list-color-indicator" 
            style={{ backgroundColor: list.color }}
          />
          <div>
            <h1>{list.name}</h1>
            {list.description && (
              <p className="list-description">{list.description}</p>
            )}
          </div>
        </div>
        <button 
          className="add-task-button"
          onClick={() => setShowTaskForm(true)}
        >
          + New Task
        </button>
      </div>

      <FilterBar />

      <div className="user-list-content">
        <div className="tasks-count">
          {listTasks.length} {listTasks.length === 1 ? 'task' : 'tasks'} in this list
        </div>
        
        <TaskList 
          tasks={listTasks} 
          emptyMessage={`No tasks in "${list.name}". Add your first task!`}
        />
      </div>

      {showTaskForm && (
        <TaskForm 
          onClose={() => setShowTaskForm(false)} 
          defaultListId={listId}
        />
      )}
    </div>
  );
}
