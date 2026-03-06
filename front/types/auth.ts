export type LoginForm = {
  email: string;
  password: string;
};

export type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TokenResponse = {
  token: string;
  user: User;
};

export type ProjectMember = {
  id: string;
  role: "OWNER" | "ADMIN" | "CONTRIBUTOR";
  user: User;
  joinedAt: Date;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  owner?: User;
  members?: ProjectMember[];
  createdAt: Date;
  updatedAt: Date;
};

export type TaskAssignee = {
  id: string;
  userId: string;
  taskId: string;
  user?: User;
  assignedAt?: Date;
};

export type Comment = {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author?: User;
  createdAt: Date;
  updatedAt: Date;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: Date;
  projectId: string;
  creatorId: string;
  assignees?: TaskAssignee[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
};

export type ErrorResponse = {
  success: boolean;
  message: string;
  error?: string;
  details?: Array<{ field: string; message: string }>;
};

export type SuccessResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};
