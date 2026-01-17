import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, UserList, TaskFilter } from '../types';
import { TaskStorage, ListStorage } from '../utils/storage';

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

    return filtered;
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
