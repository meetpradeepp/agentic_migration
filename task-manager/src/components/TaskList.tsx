import { Task } from '../types';
import { useTasks } from '../contexts/TaskContext';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  emptyMessage?: string;
}

/**
 * TaskList component with drag-and-drop reordering
 * 
 * @param tasks - Array of tasks to display
 * @param emptyMessage - Message to show when list is empty
 */
export function TaskList({ tasks, emptyMessage = 'No tasks to display' }: TaskListProps) {
  const { updateTask } = useTasks();

  /**
   * Handle drag end event
   * Reorders tasks based on drag operation
   */
  const handleDragEnd = (result: DropResult) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    // No movement
    if (sourceIndex === destIndex) {
      return;
    }

    // Create a copy of tasks array
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(sourceIndex, 1);
    reorderedTasks.splice(destIndex, 0, movedTask);

    // Update each task's order based on new position
    // We use updatedAt as a simple ordering mechanism
    reorderedTasks.forEach((task, index) => {
      updateTask(task.id, { 
        updatedAt: new Date(Date.now() + index) 
      });
    });
  };

  // Show empty state if no tasks
  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <EmptyState 
          icon="📋" 
          message={emptyMessage}
        />
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="task-list">
        {(provided, snapshot) => (
          <div
            className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable 
                key={task.id} 
                draggableId={task.id} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`task-list-item ${snapshot.isDragging ? 'dragging' : ''}`}
                  >
                    <div className="drag-handle" aria-label="Drag to reorder">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="4" cy="4" r="1.5" />
                        <circle cx="4" cy="8" r="1.5" />
                        <circle cx="4" cy="12" r="1.5" />
                        <circle cx="12" cy="4" r="1.5" />
                        <circle cx="12" cy="8" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                      </svg>
                    </div>
                    <TaskItem task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
