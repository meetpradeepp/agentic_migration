import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import './Sidebar.css';

/**
 * Sidebar component with navigation and list management
 * Provides system view navigation and custom list CRUD operations
 */
export function Sidebar() {
  const { lists, addList, updateList, deleteList } = useTasks();
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListName, setEditingListName] = useState('');

  /**
   * Handle new list creation
   */
  const handleAddList = () => {
    if (newListName.trim()) {
      addList({
        name: newListName.trim(),
        color: getRandomColor(),
      });
      setNewListName('');
      setIsAddingList(false);
    }
  };

  /**
   * Handle list rename
   */
  const handleRenameList = (listId: string) => {
    if (editingListName.trim()) {
      updateList(listId, { name: editingListName.trim() });
    }
    setEditingListId(null);
    setEditingListName('');
  };

  /**
   * Handle list deletion with confirmation
   */
  const handleDeleteList = (listId: string, listName: string) => {
    if (window.confirm(`Delete list "${listName}"? All tasks in this list will remain but be unassigned.`)) {
      deleteList(listId);
    }
  };

  /**
   * Start editing a list
   */
  const startEditing = (listId: string, currentName: string) => {
    setEditingListId(listId);
    setEditingListName(currentName);
  };

  /**
   * Get random color for new lists
   */
  const getRandomColor = (): string => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  /**
   * Handle Enter/Escape keys for forms
   */
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    } else if (e.key === 'Escape') {
      setIsAddingList(false);
      setEditingListId(null);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          <span className="app-icon">✓</span>
          Task Manager
        </h1>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h2 className="nav-section-title">System Views</h2>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/calendar" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📅</span>
            <span>Calendar</span>
          </NavLink>
          <NavLink 
            to="/all-tasks" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📋</span>
            <span>All Tasks</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <div className="nav-section-header">
            <h2 className="nav-section-title">My Lists</h2>
            <button
              type="button"
              className="add-list-button"
              onClick={() => setIsAddingList(true)}
              aria-label="Add new list"
              title="Add new list"
            >
              +
            </button>
          </div>

          {isAddingList && (
            <div className="list-form">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddList)}
                placeholder="List name"
                autoFocus
                className="list-input"
              />
              <div className="list-form-actions">
                <button
                  type="button"
                  onClick={handleAddList}
                  className="list-action-button save"
                  aria-label="Save list"
                >
                  ✓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingList(false);
                    setNewListName('');
                  }}
                  className="list-action-button cancel"
                  aria-label="Cancel"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="lists-container">
            {lists.length === 0 && !isAddingList && (
              <p className="empty-lists">No custom lists yet</p>
            )}
            {lists.map(list => (
              <div key={list.id} className="list-item">
                {editingListId === list.id ? (
                  <div className="list-form">
                    <input
                      type="text"
                      value={editingListName}
                      onChange={(e) => setEditingListName(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, () => handleRenameList(list.id))}
                      className="list-input"
                      autoFocus
                    />
                    <div className="list-form-actions">
                      <button
                        type="button"
                        onClick={() => handleRenameList(list.id)}
                        className="list-action-button save"
                        aria-label="Save"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingListId(null)}
                        className="list-action-button cancel"
                        aria-label="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <NavLink
                    to={`/list/${list.id}`}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="list-color" style={{ backgroundColor: list.color }}></span>
                    <span className="list-name">{list.name}</span>
                    <div className="list-actions">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          startEditing(list.id, list.name);
                        }}
                        className="list-action-icon"
                        aria-label="Edit list"
                        title="Edit list"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteList(list.id, list.name);
                        }}
                        className="list-action-icon delete"
                        aria-label="Delete list"
                        title="Delete list"
                      >
                        🗑
                      </button>
                    </div>
                  </NavLink>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
