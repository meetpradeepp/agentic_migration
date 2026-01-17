/**
 * Task priority levels
 */
export type TaskPriority = 'none' | 'low' | 'medium' | 'high';

/**
 * Task status
 */
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

/**
 * Task interface
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  listId?: string; // Optional list association
}

/**
 * User List interface
 */
export interface UserList {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Filter options for tasks
 */
export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  tags?: string[];
  searchQuery?: string;
  hideCompleted?: boolean;
  listId?: string;
  sortBy?: 'priority' | 'dueDate' | 'createdAt' | 'title';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Task metrics for dashboard
 */
export interface TaskMetrics {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  byPriority: Record<TaskPriority, number>;
  completionRate: number;
}

/**
 * View types - System Views vs User Lists
 */
export type ViewType = 'system' | 'user-list';

/**
 * System view identifiers
 */
export type SystemView = 'dashboard' | 'calendar' | 'all-tasks';

/**
 * Route params
 */
export interface RouteParams {
  view?: SystemView;
  listId?: string;
}
