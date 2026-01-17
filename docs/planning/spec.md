# Fix CSS Variable Naming Inconsistencies

## Objective
Update all component CSS files to use correct variable names defined in index.css, eliminating undefined variable warnings and restoring proper UI rendering.

## Current State
Component CSS files reference outdated variable names (--background-*, --text-*, etc.) while index.css defines new naming scheme (--color-bg-*, --color-text-*, etc.), causing UI rendering issues and browser console warnings.

## Required Change
Replace all outdated CSS variable references with their correct counterparts across 13 CSS files using the following mapping:
- `--background-*` → `--color-bg-*`
- `--text-*` → `--color-text-*`
- `--border-color` → `--color-border-primary`
- `--accent-color` → `--color-primary`
- `--success-color` → `--color-success`
- `--warning-color` → `--color-warning`
- `--danger-color` → `--color-danger`
- `--info-color` → `--color-primary`

## Files to Modify
- `task-manager/src/components/Sidebar.css`: Update variable references
- `task-manager/src/components/EmptyState.css`: Update variable references
- `task-manager/src/components/TaskList.css`: Update variable references
- `task-manager/src/components/FilterBar.css`: Update variable references
- `task-manager/src/components/TaskItem.css`: Update variable references
- `task-manager/src/components/TaskForm.css`: Update variable references
- `task-manager/src/components/ThemeToggle.css`: Update variable references
- `task-manager/src/App.css`: Update variable references
- `task-manager/src/views/UserListView.css`: Update variable references
- `task-manager/src/views/AllTasks.css`: Update variable references
- `task-manager/src/views/Dashboard.css`: Update variable references
- `task-manager/src/views/Calendar.css`: Update variable references
- Check for inline styles or dynamic references (if any)

## Acceptance Criteria
- [ ] All CSS variables in component files match names defined in index.css
- [ ] No undefined CSS variable warnings in browser console
- [ ] UI renders correctly with proper colors and styling
- [ ] Both light and dark theme modes work correctly
- [ ] Dashboard, Calendar, and Task List components display properly

## Validation
- Visual: Verify UI appearance matches original design in both light/dark modes
- Console: Confirm no CSS variable warnings in browser DevTools
- Unit: CSS variable consistency check
