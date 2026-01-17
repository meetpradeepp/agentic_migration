import { useMemo } from 'react';
import type { Task, TaskMetrics, TaskPriority } from '../types';

/**
 * Custom hook to calculate task metrics from a list of tasks
 * @param tasks - Array of tasks to calculate metrics from
 * @returns TaskMetrics object with computed statistics
 */
export function useTaskMetrics(tasks: Task[]): TaskMetrics {
  return useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;

    // Calculate tasks by priority
    const byPriority: Record<TaskPriority, number> = {
      none: tasks.filter(t => t.priority === 'none').length,
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
    };

    // Calculate completion rate as percentage
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      todo,
      byPriority,
      completionRate,
    };
  }, [tasks]);
}
