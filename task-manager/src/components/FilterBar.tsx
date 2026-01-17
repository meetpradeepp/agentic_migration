import { useState, useEffect } from 'react';
import { TaskStatus, TaskPriority } from '../types';
import { useTasks } from '../contexts/TaskContext';
import './FilterBar.css';

/**
 * FilterBar component for task filtering and search
 * Provides controls for filtering by status, priority, tags, and search query
 */
export function FilterBar() {
  const { filter, setFilter } = useTasks();
  
  // Local state for form controls
  const [searchQuery, setSearchQuery] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | ''>('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | ''>('');

  // Initialize from filter context
  useEffect(() => {
    setSearchQuery(filter.searchQuery || '');
    setHideCompleted(filter.hideCompleted || false);
  }, [filter]);

  /**
   * Handle search query changes with debouncing
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter({
        ...filter,
        searchQuery: searchQuery.trim() || undefined,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * Handle status filter change
   */
  const handleStatusChange = (status: TaskStatus | '') => {
    setSelectedStatus(status);
    setFilter({
      ...filter,
      status: status ? [status] : undefined,
    });
  };

  /**
   * Handle priority filter change
   */
  const handlePriorityChange = (priority: TaskPriority | '') => {
    setSelectedPriority(priority);
    setFilter({
      ...filter,
      priority: priority ? [priority] : undefined,
    });
  };

  /**
   * Handle hide completed toggle
   */
  const handleHideCompletedToggle = () => {
    const newValue = !hideCompleted;
    setHideCompleted(newValue);
    setFilter({
      ...filter,
      hideCompleted: newValue,
    });
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setSearchQuery('');
    setHideCompleted(false);
    setSelectedStatus('');
    setSelectedPriority('');
    setFilter({});
  };

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = (): boolean => {
    return !!(
      searchQuery ||
      hideCompleted ||
      selectedStatus ||
      selectedPriority
    );
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-main">
        <div className="search-box">
          <svg 
            className="search-icon" 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
            aria-hidden="true"
          >
            <path 
              d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M10.5 10.5L14 14" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search tasks"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus | '')}
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="filter-select"
            value={selectedPriority}
            onChange={(e) => handlePriorityChange(e.target.value as TaskPriority | '')}
            aria-label="Filter by priority"
          >
            <option value="">All Priorities</option>
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={hideCompleted}
              onChange={handleHideCompletedToggle}
            />
            <span>Hide Completed</span>
          </label>

          {hasActiveFilters() && (
            <button
              type="button"
              className="clear-filters-button"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
