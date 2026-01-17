import { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { TaskList } from '../components/TaskList';
import { FilterBar } from '../components/FilterBar';
import { TaskForm } from '../components/TaskForm';
import './AllTasks.css';

/**
 * AllTasks view with filtering, sorting, and search
 * Displays all tasks with comprehensive filtering options
 */
export function AllTasks() {
  const { getFilteredTasks } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);

  const filteredTasks = getFilteredTasks();

  return (
    <div className="all-tasks-view">
      <div className="all-tasks-header">
        <h1>All Tasks</h1>
        <button 
          className="add-task-button"
          onClick={() => setShowTaskForm(true)}
        >
          + New Task
        </button>
      </div>

      <FilterBar />

      <div className="all-tasks-content">
        <div className="tasks-count">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </div>
        
        <TaskList 
          tasks={filteredTasks} 
          emptyMessage="No tasks found. Create your first task to get started!"
        />
      </div>

      {showTaskForm && (
        <TaskForm onClose={() => setShowTaskForm(false)} />
      )}
    </div>
  );
}
