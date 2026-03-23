export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'Todo' | 'In-Progress' | 'Completed' | 'Upcoming';
export type Category = 'Work' | 'Personal' | 'Admin' | 'Finance' | 'Wellness' | 'General';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  category: Category;
  project?: string;
  time?: string;
  date?: string;
}

export interface Activity {
  id: string;
  type: 'Completion' | 'Insight' | 'Milestone' | 'Update';
  title: string;
  user?: string;
  content: string;
  timeAgo: string;
  project?: string;
  progress?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Finalize Architectural Proposal for Q4',
    description: 'Review the structural blueprints and ensure cost estimates align with the vendor\'s updated pricing.',
    priority: 'High',
    status: 'Todo',
    category: 'Work',
    project: 'Q4 Planning',
    time: '09:00 AM'
  },
  {
    id: '2',
    title: 'Weekly Meal Prep & Grocery',
    description: 'Focus on high-protein options for the upcoming training block. Check local market for fresh kale.',
    priority: 'Medium',
    status: 'Todo',
    category: 'Personal',
    project: 'Wellness',
    time: '05:30 PM'
  },
  {
    id: '3',
    title: 'Inbox Zero: Clear Weekend Emails',
    description: '',
    priority: 'Low',
    status: 'Completed',
    category: 'Admin',
    project: 'General',
    time: 'COMPLETED'
  },
  {
    id: '4',
    title: 'Sync with Engineering on v2.0 API',
    description: 'Discuss the new authentication flow and token expiration logic with the backend lead.',
    priority: 'High',
    status: 'Todo',
    category: 'Work',
    project: 'Internal API',
    time: '02:00 PM'
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'Completion',
    title: 'Task Completion',
    user: 'Julian Pierce',
    content: 'completed: Finalize architectural blueprints for the Riverside Project.',
    timeAgo: '2m ago'
  },
  {
    id: '2',
    type: 'Insight',
    title: 'Performance Insight',
    content: 'Your productivity peak was between 9 AM and 11 AM today. You completed 4 deep-work cycles during this window.',
    timeAgo: '45m ago'
  },
  {
    id: '3',
    type: 'Milestone',
    title: 'Project Milestone',
    project: 'Project X',
    content: 'is now 75% complete. Only 4 high-priority items remain in the backlog.',
    timeAgo: '2h ago',
    progress: 75
  }
];
