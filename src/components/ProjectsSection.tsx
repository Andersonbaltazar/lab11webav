"use client"

import { useState } from "react"
import { useDashboard } from "@/context/dashboard-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { ProjectFormDialog } from "./ProjectFormDialog"

export function ProjectsSection() {
  const { projects, deleteProject } = useDashboard()
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete)
      setShowDeleteConfirm(false)
      setProjectToDelete(null)
      setShowDetails(false)
      setDeleteSuccess(true)
      setTimeout(() => setDeleteSuccess(false), 3000)
    }
  }

  const openDetails = (project: any) => {
    setSelectedProject(project)
    setShowDetails(true)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Planificación": "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-900 border border-slate-300",
      "En Progreso": "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-900 border border-blue-300",
      "En Revisión": "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-900 border border-yellow-300",
      "Completado": "bg-gradient-to-r from-green-100 to-emerald-100 text-green-900 border border-green-300",
    }
    return colors[status] || colors["Planificación"]
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      "Baja": "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
      "Media": "bg-gradient-to-r from-blue-500 to-cyan-600 text-white",
      "Alta": "bg-gradient-to-r from-orange-500 to-red-600 text-white",
      "Urgente": "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg",
    }
    return colors[priority] || colors["Media"]
  }

  return (
    <div className="space-y-6">
      {deleteSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900">Proyecto eliminado</AlertTitle>
          <AlertDescription className="text-green-800">
            El proyecto ha sido eliminado correctamente.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <ProjectFormDialog />
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="pt-12">
            <p className="text-center text-slate-500">No hay proyectos. Crea uno nuevo para comenzar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <CardDescription className="flex items-center justify-between mt-2">
                  <span>{project.category}</span>
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{project.description}</p>

                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(project.priority)}>
                    Prioridad: {project.priority}
                  </Badge>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Progreso</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {project.members && project.members.length > 0 && (
                  <div>
                    <span className="text-sm text-slate-600">Miembros ({project.members.length})</span>
                    <div className="flex -space-x-2 mt-2">
                      {project.members.slice(0, 3).map((member: any, i: number) => (
                        <Avatar key={i} className="h-8 w-8 border-2 border-white">
                          <AvatarFallback className="text-xs">{member.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      ))}
                      {project.members.length > 3 && (
                        <Avatar className="h-8 w-8 border-2 border-white">
                          <AvatarFallback className="text-xs">+{project.members.length - 3}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDetails(project)}
                    className="flex-1"
                  >
                    Ver Detalles
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(project.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Detalles */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProject?.name}</DialogTitle>
            <DialogDescription>Detalles del proyecto</DialogDescription>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Estado</p>
                  <Badge variant="outline" className={getStatusColor(selectedProject.status)}>
                    {selectedProject.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Prioridad</p>
                  <Badge className={getPriorityColor(selectedProject.priority)}>
                    {selectedProject.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Descripción</p>
                <p className="text-sm">{selectedProject.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Categoría</p>
                <p className="text-sm">{selectedProject.category}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Progreso: {selectedProject.progress}%</p>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${selectedProject.progress}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Fecha de Creación</p>
                <p className="text-sm">{selectedProject.createdAt}</p>
              </div>

              {selectedProject.members && selectedProject.members.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Miembros del Equipo</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.members.map((member: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {member}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Cerrar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDetails(false)
                handleDeleteClick(selectedProject?.id)
              }}
            >
              Eliminar Proyecto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog para confirmar eliminación */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El proyecto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
