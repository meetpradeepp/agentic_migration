import { useMemo } from 'react';
import { Task } from '../types';

/**
 * Sort criteria for tasks
 */
export type SortBy = 'dueDate' | 'priority' | 'createdAt' | 'title';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Priority order mapping for sorting
 */
const PRIORITY_ORDER: Record<string, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
};

/**
 * Custom hook to sort tasks by various criteria
 * @param tasks - Array of tasks to sort
 * @param sortBy - Sort criterion
 * @param direction - Sort direction (ascending or descending)
 * @returns Sorted array of tasks
 */
export function useTaskSort(
  tasks: Task[],
  sortBy: SortBy,
  direction: SortDirection = 'asc'
): Task[] {
  return useMemo(() => {
    const sorted = [...tasks];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'dueDate': {
          // Tasks with no due date go to the end
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = a.dueDate.getTime() - b.dueDate.getTime();
          break;
        }

        case 'priority': {
          const aPriority = PRIORITY_ORDER[a.priority] ?? 0;
          const bPriority = PRIORITY_ORDER[b.priority] ?? 0;
          comparison = aPriority - bPriority;
          break;
        }

        case 'createdAt': {
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
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
  }, [tasks, sortBy, direction]);
}
