import type { Task, UserList } from '../types';

const STORAGE_KEYS = {
  TASKS: 'enterprise_tasks',
  LISTS: 'enterprise_lists',
  THEME: 'enterprise_theme',
} as const;

/**
 * Local storage utility for tasks
 */
export class TaskStorage {
  /**
   * Get all tasks from local storage
   */
  static getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!data) return [];
      
      const tasks = JSON.parse(data);
      // Convert date strings back to Date objects
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  /**
   * Save tasks to local storage
   */
  static saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Consider deleting old completed tasks.');
        alert('Storage limit reached. Please delete some completed tasks to free up space.');
      } else {
        console.error('Error saving tasks:', error);
      }
      throw error;
    }
  }

  /**
   * Add a new task
   */
  static addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  /**
   * Update an existing task
   */
  static updateTask(id: string, updates: Partial<Task>): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date() };
      this.saveTasks(tasks);
    }
  }

  /**
   * Delete a task
   */
  static deleteTask(id: string): void {
    const tasks = this.getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    this.saveTasks(filtered);
  }
}

/**
 * Local storage utility for user lists
 */
export class ListStorage {
  /**
   * Get all lists from local storage
   */
  static getLists(): UserList[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LISTS);
      if (!data) return [];
      
      const lists = JSON.parse(data);
      return lists.map((list: any) => ({
        ...list,
        createdAt: new Date(list.createdAt),
        updatedAt: new Date(list.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading lists:', error);
      return [];
    }
  }

  /**
   * Save lists to local storage
   */
  static saveLists(lists: UserList[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Unable to save lists.');
        alert('Storage limit reached. Please delete some data to free up space.');
      } else {
        console.error('Error saving lists:', error);
      }
      throw error;
    }
  }

  /**
   * Add a new list
   */
  static addList(list: UserList): void {
    const lists = this.getLists();
    lists.push(list);
    this.saveLists(lists);
  }

  /**
   * Update an existing list
   */
  static updateList(id: string, updates: Partial<UserList>): void {
    const lists = this.getLists();
    const index = lists.findIndex(l => l.id === id);
    if (index !== -1) {
      lists[index] = { ...lists[index], ...updates, updatedAt: new Date() };
      this.saveLists(lists);
    }
  }

  /**
   * Delete a list
   */
  static deleteList(id: string): void {
    const lists = this.getLists();
    const filtered = lists.filter(l => l.id !== id);
    this.saveLists(filtered);
  }
}

/**
 * Theme storage utility
 */
export class ThemeStorage {
  static getTheme(): 'light' | 'dark' {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      return (theme as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  }

  static setTheme(theme: 'light' | 'dark'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Unable to save theme preference.');
      } else {
        console.error('Error saving theme:', error);
      }
    }
  }
}
