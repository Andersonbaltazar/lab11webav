"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface TeamMember {
  userId: string
  name: string
  email: string
  role: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  category: string
  priority: string
  members: string[] // Array de userIds
  status: "Planificación" | "En Progreso" | "En Revisión" | "Completado"
  progress: number
  createdAt: string
}

export interface Task {
  id: string
  description: string
  projectId: string
  status: "Pendiente" | "En progreso" | "Completado"
  priority: "Baja" | "Media" | "Alta" | "Urgente"
  userId: string
  dateline: string
}

interface DashboardContextType {
  projects: Project[]
  teamMembers: TeamMember[]
  tasks: Task[]
  addProject: (project: Project) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  addTeamMember: (member: TeamMember) => void
  updateTeamMember: (userId: string, member: Partial<TeamMember>) => void
  deleteTeamMember: (userId: string) => void
  addTask: (task: Task) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  getProjectStats: () => { total: number; inProgress: number; completed: number }
  getTaskStats: () => { total: number; pending: number; completed: number }
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

const initialProjects: Project[] = [
  {
    id: "proj-1",
    name: "E-commerce Platform",
    description: "Plataforma de compras en línea",
    category: "web",
    priority: "Alta",
    members: ["user-1", "user-2"],
    status: "En Progreso",
    progress: 75,
    createdAt: "2025-10-01",
  },
  {
    id: "proj-2",
    name: "Mobile App",
    description: "Aplicación móvil multiplataforma",
    category: "mobile",
    priority: "Media",
    members: ["user-3", "user-4"],
    status: "En Revisión",
    progress: 90,
    createdAt: "2025-09-15",
  },
]

const initialTeamMembers: TeamMember[] = [
  {
    userId: "user-1",
    name: "Juan Pérez",
    email: "juan@example.com",
    role: "Frontend Developer",
    position: "Senior",
    birthdate: "1990-05-12",
    phone: "555-0101",
    projectId: "proj-1",
    isActive: true,
  },
  {
    userId: "user-2",
    name: "María García",
    email: "maria@example.com",
    role: "Backend Developer",
    position: "Mid-Level",
    birthdate: "1992-08-25",
    phone: "555-0102",
    projectId: "proj-1",
    isActive: true,
  },
  {
    userId: "user-3",
    name: "Carlos Ruiz",
    email: "carlos@example.com",
    role: "UI/UX Designer",
    position: "Senior",
    birthdate: "1988-03-10",
    phone: "555-0103",
    projectId: "proj-2",
    isActive: true,
  },
]

const initialTasks: Task[] = [
  {
    id: "task-1",
    description: "Implementar autenticación",
    projectId: "proj-1",
    status: "En progreso",
    priority: "Alta",
    userId: "user-1",
    dateline: "2025-11-15",
  },
  {
    id: "task-2",
    description: "Diseñar pantalla de perfil",
    projectId: "proj-2",
    status: "Pendiente",
    priority: "Media",
    userId: "user-3",
    dateline: "2025-11-20",
  },
]

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const addProject = (project: Project) => {
    setProjects([...projects, project])
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id))
  }

  const addTeamMember = (member: TeamMember) => {
    setTeamMembers([...teamMembers, member])
  }

  const updateTeamMember = (userId: string, updates: Partial<TeamMember>) => {
    setTeamMembers(teamMembers.map((m) => (m.userId === userId ? { ...m, ...updates } : m)))
  }

  const deleteTeamMember = (userId: string) => {
    setTeamMembers(teamMembers.filter((m) => m.userId !== userId))
  }

  const addTask = (task: Task) => {
    setTasks([...tasks, task])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const getProjectStats = () => {
    return {
      total: projects.length,
      inProgress: projects.filter((p) => p.status === "En Progreso").length,
      completed: projects.filter((p) => p.status === "Completado").length,
    }
  }

  const getTaskStats = () => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "Pendiente").length,
      completed: tasks.filter((t) => t.status === "Completado").length,
    }
  }

  return (
    <DashboardContext.Provider
      value={{
        projects,
        teamMembers,
        tasks,
        addProject,
        updateProject,
        deleteProject,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        addTask,
        updateTask,
        deleteTask,
        getProjectStats,
        getTaskStats,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider")
  }
  return context
}
