# Specification: Enterprise Task Manager Application

## Overview

This specification describes the implementation of a complete Enterprise Task Manager single-page application (SPA) built from scratch using React. The application provides comprehensive task management capabilities including system views (Dashboard with metrics, Monthly Calendar, All Tasks list), user-created custom lists, full CRUD operations, drag-and-drop task reordering, inline editing, context-aware task creation, advanced filtering/sorting, dark mode theming, URL-driven routing, and local-first data persistence. This greenfield implementation will transform the existing Vite React boilerplate into a production-ready task management system with 20+ components and a robust state management architecture.

## Workflow Type

**Type**: feature

**Rationale**: This is a greenfield feature implementation building a complete application from scratch. While the boilerplate exists (Vite + React setup), we are creating an entirely new feature set with multiple interconnected views, comprehensive state management, routing infrastructure, and persistent storage. The scope includes 15-20+ new files across views, components, hooks, and utilities, making this a substantial feature addition rather than a refactor or simple change.

## Task Scope

### Services Involved
- **task-manager** (primary) - React SPA implementation with all views, components, state management, routing, and storage logic

### This Task Will:
- [x] Implement three system views: Dashboard (with task metrics), Calendar (monthly view with date navigation), and All Tasks (comprehensive list)
- [x] Implement user-created custom lists with full CRUD operations (create, edit, rename, delete lists)
- [x] Implement complete task CRUD operations with inline editing capabilities
- [x] Implement drag-and-drop task reordering within lists using @hello-pangea/dnd
- [x] Implement context-aware task creation that inherits list/date from current view
- [x] Implement advanced filtering system (hide completed, priority levels, tags, search)
- [x] Implement multiple sorting options (due date, priority, creation date, alphabetical)
- [x] Implement dark mode with semantic CSS custom properties and smooth transitions
- [x] Implement fully responsive UI supporting mobile (320px+), tablet, and desktop
- [x] Implement URL-driven routing with react-router-dom for bookmarkable views
- [x] Implement local-first storage using localStorage with error handling
- [x] Create 10+ reusable components (Sidebar, TaskList, TaskItem, TaskForm, FilterBar, etc.)
- [x] Create custom hooks for business logic (useTaskMetrics, useTaskSort)
- [x] Handle edge cases: quota exceeded, corrupted data, concurrent tabs, empty states
- [x] Ensure WCAG AA accessibility compliance for dark mode and keyboard navigation

### Out of Scope:
- Backend API integration or server-side persistence
- User authentication or multi-user support
- Real-time collaboration or WebSocket synchronization
- Export/import functionality (CSV, JSON)
- Task reminders or notifications
- File attachments to tasks
- Undo/redo functionality (deferred to Phase 2)
- Keyboard shortcuts (deferred to Phase 2)
- Bulk operations/multi-select (deferred to Phase 2)
- Progressive Web App (PWA) features (deferred)

## Service Context

### task-manager

**Tech Stack:**
- Language: TypeScript 5.9.3
- Framework: React 19.2.0
- Router: react-router-dom 7.12.0
- Build Tool: Vite (rolldown-vite 7.2.5)
- Package Manager: npm
- Linting: ESLint with TypeScript support
- Styling: Vanilla CSS with CSS custom properties

**Entry Point:** `src/main.tsx`

**How to Run:**
```bash
cd task-manager
npm run dev
```

**Port:** 5173 (Vite default)

**Build Commands:**
```bash
npm run dev      # Development server with HMR
npm run build    # TypeScript compilation + production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Files to Modify

| File | Service | What to Change |
|------|---------|---------------|
| `task-manager/src/App.tsx` | task-manager | Complete rewrite: Replace Vite boilerplate with BrowserRouter setup, main layout with Sidebar, and Routes for all views |
| `task-manager/src/main.tsx` | task-manager | Wrap App with ThemeProvider and TaskProvider context providers for global state |
| `task-manager/src/index.css` | task-manager | Replace default styles with semantic CSS custom properties for theming (light/dark mode), reset styles, and global layout styles |
| `task-manager/src/App.css` | task-manager | Remove Vite demo styles or repurpose for app shell layout (header, sidebar, main content area) |
| `task-manager/src/types/index.ts` | task-manager | Update TaskPriority to include 'none' option: `'none' \| 'low' \| 'medium' \| 'high'` (currently has 'urgent' instead of 'none') |
| `task-manager/src/utils/storage.ts` | task-manager | Add quota exceeded error handling in catch blocks, implement data recovery for corrupted localStorage |
| `task-manager/src/contexts/TaskContext.tsx` | task-manager | Add sorting logic, metrics calculation methods, and bulk task operations |
| `task-manager/src/contexts/ThemeContext.tsx` | task-manager | No changes needed - already implements light/dark toggle with persistence |

## Files to Reference

These files show patterns to follow:

| File | Pattern to Copy |
|------|----------------|
| `task-manager/src/types/index.ts` | Type-driven development with JSDoc comments, union types for enums, comprehensive interfaces |
| `task-manager/src/utils/storage.ts` | Static class pattern for utilities, consistent CRUD methods, date serialization, try-catch error handling, immutable updates |
| `task-manager/src/contexts/TaskContext.tsx` | Context + Provider + custom hook pattern, useEffect for initial data loading, CRUD operations syncing state and storage |
| `task-manager/src/contexts/ThemeContext.tsx` | Minimal context pattern with lazy initialization, useEffect for side effects, simple toggle function |

## Patterns to Follow

### 1. Context + Provider + Custom Hook Pattern

From `task-manager/src/contexts/TaskContext.tsx`:

```typescript
// Define context type interface
interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  // ... other methods
}

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Provider component
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    setTasks(TaskStorage.getTasks()); // Load from storage
  }, []);
  
  const addTask = (taskData) => {
    const newTask = { ...taskData, id: crypto.randomUUID(), createdAt: new Date() };
    TaskStorage.addTask(newTask);
    setTasks(TaskStorage.getTasks());
  };
  
  return <TaskContext.Provider value={{ tasks, addTask }}>{children}</TaskContext.Provider>;
}

// Custom hook with error boundary
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
}
```

**Key Points:**
- Separate context type from implementation
- Use `Omit` utility type to exclude auto-generated fields (id, timestamps)
- Sync state and localStorage after each mutation
- Custom hook throws error if used outside provider (ensures proper wrapping)

### 2. Static Class Pattern for Storage Utilities

From `task-manager/src/utils/storage.ts`:

```typescript
export class TaskStorage {
  static getTasks(): Task[] {
    try {
      const data = localStorage.getItem('enterprise_tasks');
      if (!data) return [];
      
      const tasks = JSON.parse(data);
      // Convert date strings back to Date objects
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }
  
  static saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem('enterprise_tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }
}
```

**Key Points:**
- Static class methods for utility functions (no instance needed)
- Consistent CRUD method naming: `getTasks()`, `saveTasks()`, `addTask()`, `updateTask()`, `deleteTask()`
- Date serialization: Convert Date objects to/from JSON strings
- Try-catch with console.error for all localStorage operations
- Return empty array on error (fail gracefully)

### 3. Type-Driven Development with TypeScript

From `task-manager/src/types/index.ts`:

```typescript
/**
 * Task priority levels
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

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
```

**Key Points:**
- JSDoc comments above type definitions for documentation
- Union types for enums (not TS enums)
- Optional properties marked with `?`
- Comprehensive interfaces with all required fields
- Separate domain types (Task, UserList) from UI types (TaskFilter, RouteParams)

### 4. React Component Structure

All new components should follow this pattern:

```typescript
import { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import './ComponentName.css';

interface ComponentNameProps {
  // Props interface
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  const { tasks, addTask } = useTasks();
  const [localState, setLocalState] = useState();
  
  const handleAction = () => {
    // Handler logic
  };
  
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
}
```

**Key Points:**
- Named exports (not default exports)
- Props interface defined separately
- Destructure props in function parameters
- Use custom hooks at top of component
- CSS imported from separate file
- CSS class names in kebab-case

## Requirements

### Functional Requirements

1. **Dashboard View with Task Metrics**
   - Description: Display overview page with key metrics: total tasks, completed count, pending count, high-priority count, and completion rate percentage
   - Acceptance: Dashboard displays accurate metrics that update in real-time as tasks change

2. **Monthly Calendar View**
   - Description: Display calendar grid showing tasks organized by due date, with month/year navigation controls and visual indicators for task counts per date
   - Acceptance: Calendar view shows tasks organized by due date with correct monthly navigation

3. **All Tasks View**
   - Description: Comprehensive list displaying all tasks with filtering, sorting, and search capabilities
   - Acceptance: All Tasks view displays all tasks with filtering and sorting applied correctly

4. **Custom User Lists with CRUD**
   - Description: Users can create named lists, rename them, change colors/icons, and delete them, with tasks assignable to lists
   - Acceptance: Users can create, edit, rename, and delete custom lists without errors

5. **Task CRUD Operations**
   - Description: Create tasks with title, description, priority, tags, due date, and list assignment; edit any property; delete tasks
   - Acceptance: All CRUD operations complete successfully without data loss

6. **Inline Task Editing**
   - Description: Click-to-edit mode for task title, description, priority, tags, and dates directly in task list
   - Acceptance: Inline editing saves changes immediately without page refresh

7. **Drag-and-Drop Reordering**
   - Description: Drag tasks to reorder them within lists, persisting the order
   - Acceptance: Drag-and-drop reordering persists task order within lists

8. **Context-Aware Task Creation**
   - Description: Task creation form inherits context from current view (e.g., calendar date, current list)
   - Acceptance: Tasks can be created from any view and inherit context (list/date) appropriately

9. **Advanced Filtering**
   - Description: Toggle to hide completed tasks, filter by priority level, filter by tags, search by title/description
   - Acceptance: Filter toggles work correctly - hide completed removes completed tasks, priority filter shows only selected priorities, tag filter shows only tasks with selected tags; search filters tasks in real-time as user types

10. **Task Sorting**
    - Description: Sort tasks by due date, priority level, creation date, or alphabetically by title
    - Acceptance: Sorting changes task order based on selected criteria (due date, priority, etc.)

11. **Dark Mode Implementation**
    - Description: Theme toggle switches between light and dark color schemes using CSS custom properties with smooth transitions
    - Acceptance: Dark mode toggle switches theme across entire application with smooth transition; theme preference persists across sessions

12. **Responsive UI Design**
    - Description: Mobile-first responsive design that adapts to screen sizes from 320px (mobile) to 4K desktop
    - Acceptance: UI is fully responsive and usable on screens from 320px to 4K resolution

13. **URL-Driven Routing**
    - Description: Each view and list has a unique URL, enabling bookmarks and browser back/forward navigation
    - Acceptance: URL changes when navigating between views and lists (bookmarkable URLs); browser back/forward buttons work correctly with routing

14. **Local-First Data Persistence**
    - Description: All task and list data persists in localStorage, surviving page refreshes and browser restarts
    - Acceptance: All data persists across page refreshes via localStorage; corrupted localStorage data recovers or resets to default state

15. **Visual Priority Indicators**
    - Description: Tasks display color-coded priority levels (none/low/medium/high) with distinct visual styling
    - Acceptance: Task priority levels are visually distinct (color-coded or icon-based)

16. **Tag Management**
    - Description: Create, assign, and filter by tags with color coding
    - Acceptance: Tags are displayed with colors and can be filtered; tasks can be assigned to multiple tags

17. **Empty State Messaging**
    - Description: Display helpful messages and CTAs when no tasks or lists exist
    - Acceptance: Empty states display helpful messages when no tasks/lists exist

### Edge Cases

1. **Task Without Due Date** - Tasks must support optional due dates (undefined/null allowed)
   - Handling: TaskForm makes due date field optional, displays tasks without dates in "No due date" section in calendar view

2. **Creating Tasks for Past Dates** - Calendar should allow task creation for historical dates
   - Handling: No date validation blocking past dates, calendar view shows all dates as selectable

3. **Deleting List with Tasks** - Handle task reassignment or deletion when parent list is deleted
   - Handling: Show confirmation dialog with two options: (1) Move tasks to "Unassigned" list, or (2) Delete all tasks in list

4. **No Filter Results** - Filtering with no matching tasks should show empty state
   - Handling: Display EmptyState component with message "No tasks match your filters" and option to clear filters

5. **Search with Special Characters** - Search input should handle regex special characters safely
   - Handling: Escape special regex characters in search query or use `String.includes()` instead of regex

6. **Dragging Between Lists** - Drag-drop should support moving tasks between different lists
   - Handling: Update task's `listId` when dropped in different list, re-render both source and destination lists

7. **Editing While Filters Active** - Task edits should maintain current filter state
   - Handling: Don't reset filters on task update, recalculate filtered tasks after each mutation

8. **Theme Switching with Open Modals** - Dark mode toggle should update all UI elements including modals
   - Handling: Apply theme via CSS custom properties on `:root`, ensuring all components inherit theme variables

9. **Long Task Titles/Descriptions** - Handle overflow for very long text content
   - Handling: Truncate titles with ellipsis in list view (max 2 lines), show full text on hover/focus

10. **Many Tags on Single Task** - Handle overflow when task has numerous tags
    - Handling: Show first 3 tags with "+N more" indicator, expand on hover or click

11. **Calendar Navigation to Far Future/Past** - Limit calendar range or handle large dates
    - Handling: Allow navigation ±10 years from current date, disable navigation buttons at limits

12. **localStorage Quota Exceeded** - Handle gracefully when storage limit reached (~5-10MB)
    - Handling: Catch QuotaExceededError, show user-friendly message, suggest deleting old completed tasks

13. **Corrupted localStorage Data** - Recover from invalid JSON or missing required fields
    - Handling: Try-catch around JSON.parse, validate data structure, reset to empty array if invalid

14. **Concurrent Tab Editing** - Multiple tabs modifying same data simultaneously
    - Handling: Listen for `storage` event, reload data when localStorage changes in other tabs

15. **Browser Without localStorage** - Fallback for browsers with storage disabled
    - Handling: Detect localStorage availability, show warning message if unavailable, fall back to in-memory state

16. **Performance with 1000+ Tasks** - Maintain responsiveness with large datasets
    - Handling: Virtualize long lists, debounce search input, use React.memo for TaskItem components

17. **Rapid Filter Toggling** - Prevent race conditions from quick filter changes
    - Handling: Debounce filter state updates (300ms delay), use single filter state object

18. **Deleting Currently Viewed List** - Handle navigation when active list is deleted
    - Handling: Detect deletion of current list, redirect to "All Tasks" view automatically

## Implementation Notes

### DO

- **Follow Context Pattern**: Use the Context + Provider + Custom Hook pattern from `TaskContext.tsx` for all new contexts
- **Use Static Storage Classes**: Follow the pattern in `storage.ts` for all localStorage interactions (static methods, try-catch, date serialization)
- **Type Everything**: Define TypeScript interfaces for all components' props, state shapes, and data structures
- **Add JSDoc Comments**: Document all types, interfaces, and public functions with JSDoc comments
- **Implement Error Boundaries**: Wrap context hooks with error checks (`if (!context) throw Error`)
- **Use Semantic HTML**: Use `<nav>`, `<main>`, `<article>`, `<section>` for accessibility
- **CSS Custom Properties**: Define all theme colors and spacing as CSS variables in `:root` and `[data-theme="dark"]`
- **Immutable Updates**: Always create new arrays/objects rather than mutating state (`[...tasks]`, `{...task}`)
- **Lazy Initialization**: Use `useState(() => initialValue)` when initial state requires computation
- **Cleanup Effects**: Return cleanup functions from useEffect for event listeners and timers

### DON'T

- **Don't Use Default Exports**: Use named exports for all components and utilities
- **Don't Mutate State**: Never use `.push()`, `.splice()`, or direct property assignment on state
- **Don't Skip Error Handling**: Always wrap localStorage operations in try-catch blocks
- **Don't Use TS Enums**: Use union types (`'low' | 'medium' | 'high'`) instead of TypeScript enums
- **Don't Inline Complex Logic**: Extract filtering, sorting, and metrics logic into custom hooks
- **Don't Create Multiple Context Instances**: Reuse existing TaskContext and ThemeContext
- **Don't Forget Date Serialization**: Always convert date strings to Date objects when reading from localStorage
- **Don't Use Any Type**: Avoid `any` type, use `unknown` or proper interfaces instead
- **Don't Skip Accessibility**: Always include ARIA labels, keyboard support, and semantic HTML
- **Don't Hardcode Values**: Use constants for storage keys, route paths, and configuration values

## Development Environment

### Start Services

```bash
# Install dependencies (if not already done)
cd task-manager
npm install

# Install new dependencies for this task
npm install date-fns @hello-pangea/dnd

# Start development server
npm run dev
```

### Service URLs
- **task-manager**: http://localhost:5173

### Required Environment Variables
None - this is a frontend-only application with no backend or API keys required.

### Browser DevTools Setup
- React DevTools extension recommended for debugging component state
- Use browser localStorage inspector to view persisted data
- Console should show no errors during normal usage

## Success Criteria

The task is complete when:

1. [x] Dashboard displays accurate metrics (total, completed, pending, high-priority, completion rate) that update in real-time
2. [x] Calendar view shows tasks organized by due date with month/year navigation working correctly
3. [x] All Tasks view displays all tasks with filtering and sorting applied correctly
4. [x] Users can create, edit, rename, and delete custom lists without errors
5. [x] Tasks can be created from any view and inherit context (list/date) appropriately
6. [x] Inline editing saves changes immediately without page refresh
7. [x] Drag-and-drop reordering persists task order within lists
8. [x] Filter toggles work correctly (hide completed, priority filter, tag filter, search)
9. [x] Sorting changes task order based on selected criteria
10. [x] Dark mode toggle switches theme across entire application with smooth transition
11. [x] UI is fully responsive and usable on screens from 320px to 4K resolution
12. [x] URL changes when navigating between views and lists (bookmarkable URLs)
13. [x] Browser back/forward buttons work correctly with routing
14. [x] All data persists across page refreshes via localStorage
15. [x] Task priority levels are visually distinct (color-coded or icon-based)
16. [x] Tags are displayed with colors and can be filtered
17. [x] Calendar dates show task counts and visual completion indicators
18. [x] Empty states display helpful messages when no tasks/lists exist
19. [x] Application loads within 2 seconds on typical broadband connection
20. [x] No console errors during normal usage
21. [x] All CRUD operations complete successfully without data loss
22. [x] Theme preference persists across sessions
23. [x] TypeScript compilation passes with no errors (`npm run build`)
24. [x] ESLint passes with no errors (`npm run lint`)

## QA Acceptance Criteria

**CRITICAL**: These criteria must be verified by the QA Agent before sign-off.

### Unit Tests

| Test | File | What to Verify |
|------|------|----------------|
| TaskStorage CRUD operations | `src/utils/storage.test.ts` | Verify getTasks(), saveTasks(), addTask(), updateTask(), deleteTask() work correctly with localStorage |
| Date serialization in storage | `src/utils/storage.test.ts` | Verify Date objects are correctly serialized to JSON and deserialized back to Date objects |
| Task filtering logic | `src/contexts/TaskContext.test.tsx` | Verify getFilteredTasks() correctly filters by status, priority, tags, listId, search query |
| Task metrics calculation | `src/hooks/useTaskMetrics.test.ts` | Verify metrics (total, completed, pending, byPriority, completionRate) are calculated correctly |
| Task sorting logic | `src/hooks/useTaskSort.test.ts` | Verify sorting by due date, priority, creation date, and title works correctly |
| Theme toggle functionality | `src/contexts/ThemeContext.test.tsx` | Verify theme switches between light/dark and persists to localStorage |
| Date utility functions | `src/utils/dateUtils.test.ts` | Verify calendar grid generation, date formatting, and date comparisons work correctly |

### Integration Tests

| Test | Services | What to Verify |
|------|----------|----------------|
| Task creation flow | TaskContext ↔ TaskStorage | Verify task created in context is persisted to localStorage and appears in task list |
| Task update flow | TaskContext ↔ TaskStorage | Verify task updates are synced to localStorage and reflected in UI |
| List deletion with tasks | TaskContext ↔ ListStorage | Verify deleting a list handles associated tasks correctly (reassignment or deletion) |
| Filter state persistence | TaskContext ↔ UI components | Verify filter changes update context state and UI reflects filtered results |
| Theme application | ThemeContext ↔ CSS | Verify theme toggle updates CSS custom properties and all components reflect theme change |
| Routing navigation | react-router ↔ views | Verify navigation between views updates URL and renders correct component |

### End-to-End Tests

| Flow | Steps | Expected Outcome |
|------|-------|------------------|
| Complete task lifecycle | 1. Create task in All Tasks view 2. Edit task inline 3. Drag to reorder 4. Mark as completed 5. Delete task | Task appears in list, edits save, order persists, completion toggles, task is removed |
| Custom list management | 1. Create new list 2. Create task in list 3. Navigate to list view 4. Rename list 5. Delete list | List appears in sidebar, tasks show in list view, rename updates sidebar, deletion redirects to safe view |
| Calendar task creation | 1. Navigate to Calendar view 2. Click on future date 3. Create task with inherited date 4. Verify task appears on calendar date | Task created with correct due date, calendar shows task count on that date |
| Filter and sort workflow | 1. Create tasks with different priorities 2. Apply priority filter 3. Apply hide completed filter 4. Sort by due date 5. Search by keyword | Filters combine correctly, search filters in real-time, sort order is correct |
| Dark mode persistence | 1. Toggle dark mode on 2. Refresh page 3. Verify dark theme persists 4. Navigate between views 5. Toggle back to light mode | Theme persists across refreshes, all views reflect theme, toggle works bidirectionally |
| Responsive layout | 1. Resize browser to mobile (320px) 2. Verify sidebar collapses to hamburger menu 3. Verify task list is scrollable 4. Create task on mobile 5. Resize to desktop | UI adapts to screen size, all features work on mobile, no horizontal scroll |

### Browser Verification

| Page/Component | URL | Checks |
|----------------|-----|--------|
| Dashboard | `http://localhost:5173/dashboard` | Metrics display correctly, charts/stats visible, responsive layout |
| Calendar | `http://localhost:5173/calendar` | Calendar grid renders, month navigation works, tasks appear on correct dates |
| All Tasks | `http://localhost:5173/all-tasks` | Task list displays, filters work, sorting works, search filters in real-time |
| Custom List View | `http://localhost:5173/list/:listId` | Tasks filtered to specific list, list name displays in header |
| Sidebar Navigation | All views | Sidebar links work, active view highlighted, list CRUD works |
| Task Form | All views | Form opens, all fields editable, validation works, submission creates/updates task |
| Dark Mode | All views | Theme toggle works, colors have proper contrast, transitions are smooth |

### Database Verification

Not applicable - this is a frontend-only application using localStorage (no database).

### localStorage Verification

| Check | Command | Expected |
|-------|---------|----------|
| Tasks persisted | Open DevTools → Application → Local Storage → `enterprise_tasks` | JSON array of tasks with correct structure |
| Lists persisted | Open DevTools → Application → Local Storage → `enterprise_lists` | JSON array of user lists with correct structure |
| Theme persisted | Open DevTools → Application → Local Storage → `enterprise_theme` | String value "light" or "dark" |
| Data structure valid | Parse localStorage data and validate against TypeScript types | All required fields present, dates are ISO strings, IDs are UUIDs |
| Quota handling | Create 1000+ tasks and verify graceful handling | Error message shown if quota exceeded, no data corruption |

### Performance Verification

| Check | Tool | Expected |
|-------|------|----------|
| Initial load time | Browser Network tab | FCP < 1.5s, LCP < 2.5s on 3G connection |
| Bundle size | `npm run build` + bundle analyzer | Total JS bundle < 500KB (excluding node_modules CDN) |
| Task list rendering | Browser Performance profiler | 1000 tasks render in < 500ms, no jank during scroll |
| Filter/search responsiveness | Manual testing | Filter updates in < 100ms, search debounced to 300ms |
| Drag-drop performance | Manual testing | Smooth 60fps drag animation, no lag with 100+ tasks |

### Accessibility Verification

| Check | Tool | Expected |
|-------|------|----------|
| Keyboard navigation | Manual testing | Tab order logical, all interactive elements focusable, Enter/Space activate buttons |
| Screen reader support | NVDA/JAWS | Semantic HTML announces correctly, ARIA labels present where needed |
| Color contrast | WebAIM Contrast Checker | All text meets WCAG AA (4.5:1 for normal text, 3:1 for large text) |
| Focus indicators | Manual testing | Visible focus outline on all interactive elements, 3:1 contrast minimum |
| Semantic HTML | HTML validator | Proper heading hierarchy (h1 → h2 → h3), landmarks (nav, main, aside) |

### QA Sign-off Requirements

- [x] All unit tests pass (`npm test`)
- [x] All integration tests pass
- [x] All E2E test flows complete successfully
- [x] Browser verification complete (Chrome, Firefox, Safari, Edge)
- [x] localStorage data verified as valid and persistent
- [x] Performance benchmarks met (load time, bundle size, rendering)
- [x] Accessibility checks pass (keyboard nav, screen reader, contrast, focus)
- [x] No regressions in existing functionality
- [x] Code follows established patterns (Context, Storage, TypeScript)
- [x] No security vulnerabilities introduced (no XSS in search, no eval)
- [x] No console errors or warnings during normal usage
- [x] TypeScript compilation passes (`npm run build`)
- [x] ESLint passes (`npm run lint`)
- [x] All edge cases handled gracefully (quota exceeded, corrupted data, empty states)
- [x] Responsive design verified on mobile, tablet, desktop
- [x] Dark mode verified across all views with proper contrast
