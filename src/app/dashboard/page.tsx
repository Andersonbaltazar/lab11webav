"use client"

import { useState } from "react"
import { useDashboard } from "@/context/dashboard-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProjectsSection } from "@/components/ProjectsSection"
import { TeamSection } from "@/components/TeamSection"
import { TasksSection } from "@/components/TasksSection"
import { SettingsSection } from "@/components/SettingsSection"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { projects, tasks, teamMembers, getProjectStats, getTaskStats } = useDashboard()
  const projectStats = getProjectStats()
  const taskStats = getTaskStats()

  const stats = [
    { label: "Total de Proyectos", value: projectStats.total.toString(), color: "bg-gradient-to-br from-blue-500 to-blue-600", icon: "📊" },
    { label: "En Progreso", value: projectStats.inProgress.toString(), color: "bg-gradient-to-br from-yellow-500 to-orange-600", icon: "⚡" },
    { label: "Completados", value: projectStats.completed.toString(), color: "bg-gradient-to-br from-green-500 to-emerald-600", icon: "✅" },
    { label: "Tareas Pendientes", value: taskStats.pending.toString(), color: "bg-gradient-to-br from-red-500 to-pink-600", icon: "⏰" },
  ]

  const recentActivities = [
    { name: "Juan Pérez", action: "Completó la tarea", project: "Sitio Web", time: "hace 2 horas" },
    { name: "María López", action: "Agregó un comentario", project: "App Mobile", time: "hace 3 horas" },
    { name: "Carlos García", action: "Comenzó proyecto", project: "Dashboard Admin", time: "hace 1 día" },
  ]

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Dashboard de Proyectos
        </h1>
        <p className="text-slate-600">
          Gestiona tus proyectos y tareas con shadcn/ui
        </p>
      </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-5 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border-2 border-purple-300 rounded-lg p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">📊 Resumen</TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">📁 Proyectos</TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">👥 Equipo</TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white">✅ Tareas</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white">⚙️ Configuración</TabsTrigger>
        </TabsList>        {/* Tab: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <CardDescription className="text-white">{stat.label}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-bold text-white">{stat.value}</div>
                    <div className={`${stat.color} w-16 h-16 rounded-lg flex items-center justify-center text-3xl shadow-lg`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas acciones del equipo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.name} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{activity.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{activity.name}</p>
                        <p className="text-xs text-slate-600">{activity.action} en {activity.project}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Projects */}
        <TabsContent value="projects" className="space-y-6">
          <ProjectsSection />
        </TabsContent>

        {/* Tab: Team */}
        <TabsContent value="team" className="space-y-6">
          <TeamSection />
        </TabsContent>

        {/* Tab: Tasks */}
        <TabsContent value="tasks" className="space-y-4">
          <TasksSection />
        </TabsContent>

        {/* Tab: Settings */}
        <TabsContent value="settings">
          <SettingsSection />
        </TabsContent>
      </Tabs>
    </main>
  )
}
