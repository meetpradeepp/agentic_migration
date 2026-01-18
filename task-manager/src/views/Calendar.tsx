import { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { 
  getMonthGrid, 
  getMonthYearLabel, 
  getNextMonth, 
  getPrevMonth,
  isSameDay,
} from '../utils/dateUtils';
import type { CalendarDay } from '../utils/dateUtils';
import type { Task } from '../types';
import { TaskItem } from '../components/TaskItem';
import { TaskForm } from '../components/TaskForm';
import './Calendar.css';

/**
 * Calendar view with monthly grid and task display
 * Shows tasks organized by due date in a calendar layout
 */
export function Calendar() {
  const { tasks } = useTasks();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskFormDate, setTaskFormDate] = useState<Date | null>(null);

  const monthGrid = getMonthGrid(currentMonth);
  const monthLabel = getMonthYearLabel(currentMonth);

  /**
   * Get tasks for a specific date
   */
  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  /**
   * Check if a date has incomplete tasks
   */
  const hasIncompleteTasks = (date: Date): boolean => {
    return tasks.some(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  /**
   * Navigate to previous month
   */
  const handlePrevMonth = () => {
    setCurrentMonth(getPrevMonth(currentMonth));
  };

  /**
   * Navigate to next month
   */
  const handleNextMonth = () => {
    setCurrentMonth(getNextMonth(currentMonth));
  };

  /**
   * Navigate to today
   */
  const handleToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  /**
   * Handle day click - toggle selection
   */
  const handleDayClick = (day: CalendarDay) => {
    // Toggle: if clicking the same date, clear it; otherwise select it
    setSelectedDate(selectedDate && isSameDay(day.date, selectedDate) ? null : day.date);
  };

  /**
   * Handle day double-click - create task with the selected date
   */
  const handleDayDoubleClick = (day: CalendarDay) => {
    setTaskFormDate(day.date);
    setShowTaskForm(true);
  };

  /**
   * Handle creating task - close form
   */
  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setTaskFormDate(null);
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h1>Calendar</h1>
        <div className="calendar-controls">
          <button 
            className="control-button"
            onClick={handleToday}
          >
            Today
          </button>
          <button 
            className="control-button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            ‹
          </button>
          <h2 className="month-label">{monthLabel}</h2>
          <button 
            className="control-button"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="calendar-content">
        {/* Calendar Grid */}
        <div className="calendar-grid-container">
          <div className="calendar-grid">
            {/* Weekday headers */}
            <div className="weekday-header">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="days-grid">
              {monthGrid.map((week, weekIdx) => (
                week.map((day, dayIdx) => {
                  const dayTasks = getTasksForDate(day.date);
                  const isSelected = selectedDate && isSameDay(day.date, selectedDate);
                  const hasIncomplete = hasIncompleteTasks(day.date);
                  
                  return (
                    <button
                      key={`${weekIdx}-${dayIdx}`}
                      className={`
                        calendar-day 
                        ${!day.isCurrentMonth ? 'other-month' : ''} 
                        ${day.isToday ? 'today' : ''}
                        ${isSelected ? 'selected' : ''}
                        ${dayTasks.length > 0 ? 'has-tasks' : ''}
                        ${hasIncomplete ? 'has-incomplete-tasks' : ''}
                      `}
                      onClick={() => handleDayClick(day)}
                      onDoubleClick={() => handleDayDoubleClick(day)}
                      title={hasIncomplete ? 'Has incomplete tasks - double-click to create task' : 'Double-click to create task'}
                    >
                      <span className="day-number">{day.dayOfMonth}</span>
                      {dayTasks.length > 0 && (
                        <span className="task-indicator">
                          {dayTasks.length}
                        </span>
                      )}
                    </button>
                  );
                })
              ))}
            </div>
          </div>
        </div>

        {/* Selected Date Tasks */}
        {selectedDate && (
          <div className="selected-date-panel">
            <h3>
              Tasks for {getMonthYearLabel(selectedDate).split(' ')[0]} {selectedDate.getDate()}
            </h3>
            {selectedDateTasks.length === 0 ? (
              <p className="no-tasks">No tasks scheduled for this date</p>
            ) : (
              <div className="tasks-list">
                {selectedDateTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {showTaskForm && taskFormDate && (
        <TaskForm 
          onClose={handleCloseTaskForm}
          defaultDueDate={taskFormDate}
        />
      )}
    </div>
  );
}
