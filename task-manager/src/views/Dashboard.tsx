import { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { useTaskMetrics } from '../hooks/useTaskMetrics';
import { TaskItem } from '../components/TaskItem';
import { TaskForm } from '../components/TaskForm';
import { EmptyState } from '../components/EmptyState';
import './Dashboard.css';

/**
 * Dashboard view with task metrics and high-priority overview
 * Shows key statistics and tasks requiring immediate attention
 */
export function Dashboard() {
  const { tasks } = useTasks();
  const metrics = useTaskMetrics(tasks);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Get high-priority incomplete tasks
  const highPriorityTasks = tasks
    .filter(t => t.priority === 'high' && t.status !== 'completed')
    .sort((a, b) => {
      // Sort by due date (earliest first), then by creation date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 5); // Show top 5

  // Get overdue tasks
  const now = new Date();
  const overdueTasks = tasks
    .filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button 
          className="add-task-button"
          onClick={() => setShowTaskForm(true)}
        >
          + New Task
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon total">📊</div>
          <div className="metric-content">
            <div className="metric-value">{metrics.total}</div>
            <div className="metric-label">Total Tasks</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon todo">📋</div>
          <div className="metric-content">
            <div className="metric-value">{metrics.todo}</div>
            <div className="metric-label">To Do</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon in-progress">🔄</div>
          <div className="metric-content">
            <div className="metric-value">{metrics.inProgress}</div>
            <div className="metric-label">In Progress</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon completed">✅</div>
          <div className="metric-content">
            <div className="metric-value">{metrics.completed}</div>
            <div className="metric-label">Completed</div>
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="completion-section">
        <h2>Completion Rate</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${metrics.completionRate}%` }}
          >
            {metrics.completionRate > 10 && `${metrics.completionRate}%`}
          </div>
        </div>
        {metrics.completionRate <= 10 && (
          <span className="progress-label">{metrics.completionRate}%</span>
        )}
      </div>

      {/* Priority Breakdown */}
      <div className="priority-section">
        <h2>Tasks by Priority</h2>
        <div className="priority-grid">
          <div className="priority-item high">
            <span className="priority-badge">High</span>
            <span className="priority-count">{metrics.byPriority.high}</span>
          </div>
          <div className="priority-item medium">
            <span className="priority-badge">Medium</span>
            <span className="priority-count">{metrics.byPriority.medium}</span>
          </div>
          <div className="priority-item low">
            <span className="priority-badge">Low</span>
            <span className="priority-count">{metrics.byPriority.low}</span>
          </div>
          <div className="priority-item none">
            <span className="priority-badge">None</span>
            <span className="priority-count">{metrics.byPriority.none}</span>
          </div>
        </div>
      </div>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div className="tasks-section">
          <h2>⚠️ Overdue Tasks</h2>
          <div className="tasks-list">
            {overdueTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* High Priority Tasks */}
      <div className="tasks-section">
        <h2>🔥 High Priority Tasks</h2>
        {highPriorityTasks.length === 0 ? (
          <EmptyState 
            icon="🎉" 
            message="No high priority tasks - great job!"
          />
        ) : (
          <div className="tasks-list">
            {highPriorityTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm onClose={() => setShowTaskForm(false)} />
      )}
    </div>
  );
}
