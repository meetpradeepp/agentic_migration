import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Task, UserList, TaskFilter, TaskMetrics } from '../types';
import { TaskStorage, ListStorage } from '../utils/storage';
import type { SortBy, SortDirection } from '../hooks/useTaskSort';

interface TaskContextType {
  tasks: Task[];
  lists: UserList[];
  filter: TaskFilter;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addList: (list: Omit<UserList, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateList: (id: string, updates: Partial<UserList>) => void;
  deleteList: (id: string) => void;
  setFilter: (filter: TaskFilter) => void;
  getFilteredTasks: () => Task[];
  sortTasks: (tasks: Task[], sortBy: SortBy, direction?: SortDirection) => Task[];
  getMetrics: (tasks?: Task[]) => TaskMetrics;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<UserList[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({});

  // Load initial data
  useEffect(() => {
    setTasks(TaskStorage.getTasks());
    setLists(ListStorage.getLists());
  }, []);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    TaskStorage.addTask(newTask);
    setTasks(TaskStorage.getTasks());
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    TaskStorage.updateTask(id, updates);
    setTasks(TaskStorage.getTasks());
  };

  const deleteTask = (id: string) => {
    TaskStorage.deleteTask(id);
    setTasks(TaskStorage.getTasks());
  };

  const addList = (listData: Omit<UserList, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newList: UserList = {
      ...listData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    ListStorage.addList(newList);
    setLists(ListStorage.getLists());
  };

  const updateList = (id: string, updates: Partial<UserList>) => {
    ListStorage.updateList(id, updates);
    setLists(ListStorage.getLists());
  };

  const deleteList = (id: string) => {
    ListStorage.deleteList(id);
    setLists(ListStorage.getLists());
  };

  const getFilteredTasks = (): Task[] => {
    let filtered = [...tasks];

    // Filter by status
    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter(t => filter.status!.includes(t.status));
    }

    // Filter by priority
    if (filter.priority && filter.priority.length > 0) {
      filtered = filtered.filter(t => filter.priority!.includes(t.priority));
    }

    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(t => 
        filter.tags!.some(tag => t.tags.includes(tag))
      );
    }

    // Filter by list
    if (filter.listId) {
      filtered = filtered.filter(t => t.listId === filter.listId);
    }

    // Hide completed
    if (filter.hideCompleted) {
      filtered = filtered.filter(t => t.status !== 'completed');
    }

    // Search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting if specified
    if (filter.sortBy) {
      filtered = sortTasks(filtered, filter.sortBy, filter.sortDirection || 'asc');
    }

    return filtered;
  };

  /**
   * Sort tasks by specified criteria
   * @param tasks - Tasks to sort
   * @param sortBy - Sort criterion
   * @param direction - Sort direction (default: 'asc')
   * @returns Sorted array of tasks
   */
  const sortTasks = (
    tasks: Task[], 
    sortBy: SortBy, 
    direction: SortDirection = 'asc'
  ): Task[] => {
    const PRIORITY_ORDER: Record<string, number> = {
      none: 0,
      low: 1,
      medium: 2,
      high: 3,
    };

    const sorted = [...tasks];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'dueDate': {
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        }

        case 'priority': {
          const aPriority = PRIORITY_ORDER[a.priority] ?? 0;
          const bPriority = PRIORITY_ORDER[b.priority] ?? 0;
          comparison = aPriority - bPriority;
          break;
        }

        case 'createdAt': {
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        }

        case 'title': {
          comparison = a.title.localeCompare(b.title, undefined, {
            sensitivity: 'base',
          });
          break;
        }

        default:
          comparison = 0;
      }

      return direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  };

  /**
   * Calculate metrics for tasks
   * @param tasksToAnalyze - Optional tasks array (defaults to all tasks)
   * @returns TaskMetrics object
   */
  const getMetrics = (tasksToAnalyze: Task[] = tasks): TaskMetrics => {
    const total = tasksToAnalyze.length;
    const completed = tasksToAnalyze.filter(t => t.status === 'completed').length;
    const inProgress = tasksToAnalyze.filter(t => t.status === 'in-progress').length;
    const todo = tasksToAnalyze.filter(t => t.status === 'todo').length;

    const byPriority = {
      none: tasksToAnalyze.filter(t => t.priority === 'none').length,
      low: tasksToAnalyze.filter(t => t.priority === 'low').length,
      medium: tasksToAnalyze.filter(t => t.priority === 'medium').length,
      high: tasksToAnalyze.filter(t => t.priority === 'high').length,
    };

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      todo,
      byPriority,
      completionRate,
    };
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      lists,
      filter,
      addTask,
      updateTask,
      deleteTask,
      addList,
      updateList,
      deleteList,
      setFilter,
      getFilteredTasks,
      sortTasks,
      getMetrics,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
}
