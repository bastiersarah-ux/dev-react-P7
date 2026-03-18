import nextConfig from "./../next.config";

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

export type UpdateProfileInput = {
  name?: string;
  email?: string;
};

export type UpdatePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type TokenResponse = {
  token: string;
  user: User;
};

export type ProjectMemberRole = "OWNER" | "ADMIN" | "CONTRIBUTOR";

export type ProjectMember = {
  id: string;
  role: ProjectMemberRole;
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

export type DashboardProject = {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  owner?: User;
  members?: ProjectMember[];
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
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

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: Date;
  projectId: string;
  project: Pick<Project, "id" | "description" | "name">;
  creatorId: string;
  assignees?: TaskAssignee[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
};

export type TaskInput = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
};

export type ProjectInput = {
  name: string;
  description?: string;
  contributors?: string[];
};

export type AddContributorInput = {
  userId: number;
  projectId: number;
  email?: string;
  name?: string;
  role: "CONTRIBUTOR" | "ADMIN";
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
