import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay as dateFnsIsSameDay,
  isSameMonth,
  addMonths,
  subMonths,
} from 'date-fns';

/**
 * Calendar day representation
 */
export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

/**
 * Generates a calendar grid for a given month
 * Returns array of weeks, each containing 7 days
 * @param date - Reference date for the month
 * @returns 2D array representing calendar grid (weeks x days)
 */
export function getMonthGrid(date: Date): CalendarDay[][] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const today = new Date();

  const calendarDays: CalendarDay[] = days.map(day => ({
    date: day,
    dayOfMonth: day.getDate(),
    isCurrentMonth: isSameMonth(day, date),
    isToday: dateFnsIsSameDay(day, today),
  }));

  // Split into weeks (7 days each)
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return weeks;
}

/**
 * Formats a date to a human-readable string
 * @param date - Date to format
 * @param formatStr - Format string (default: 'MMM d, yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: Date, formatStr = 'MMM d, yyyy'): string {
  return format(date, formatStr);
}

/**
 * Checks if two dates represent the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates are on the same day
 */
export function isSameDay(date1: Date | undefined, date2: Date | undefined): boolean {
  if (!date1 || !date2) return false;
  return dateFnsIsSameDay(date1, date2);
}

/**
 * Gets the next month from a given date
 * @param date - Current date
 * @returns Date object for next month
 */
export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

/**
 * Gets the previous month from a given date
 * @param date - Current date
 * @returns Date object for previous month
 */
export function getPrevMonth(date: Date): Date {
  return subMonths(date, 1);
}

/**
 * Gets the current month name and year
 * @param date - Date to format
 * @returns String like "January 2024"
 */
export function getMonthYearLabel(date: Date): string {
  return format(date, 'MMMM yyyy');
}

/**
 * Checks if a date is in the past (before today)
 * @param date - Date to check
 * @returns True if date is in the past
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}

/**
 * Checks if a date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export function isToday(date: Date): boolean {
  return dateFnsIsSameDay(date, new Date());
}
