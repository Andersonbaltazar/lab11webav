"use client"

import { useState } from "react"
import { useDashboard, Task } from "@/context/dashboard-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const ITEMS_PER_PAGE = 5

export function TasksSection() {
  const { tasks, addTask, updateTask, deleteTask } = useDashboard()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [formData, setFormData] = useState<Partial<Task>>({
    description: "",
    projectId: "",
    status: "Pendiente",
    priority: "Media",
    userId: "",
    dateline: "",
  })

  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedTasks = tasks.slice(startIndex, endIndex)

  const handleAddClick = () => {
    setEditingTask(null)
    setFormData({
      description: "",
      projectId: "",
      status: "Pendiente",
      priority: "Media",
      userId: "",
      dateline: "",
    })
    setShowForm(true)
  }

  const handleEditClick = (task: Task) => {
    setEditingTask(task)
    setFormData(task)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description?.trim()) {
      alert("Por favor completa la descripción")
      return
    }

    if (editingTask) {
      updateTask(editingTask.id, formData)
      setSuccessMessage("Tarea actualizada correctamente")
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        description: formData.description || "",
        projectId: formData.projectId || "",
        status: formData.status || "Pendiente",
        priority: formData.priority || "Media",
        userId: formData.userId || "",
        dateline: formData.dateline || "",
      }
      addTask(newTask)
      setSuccessMessage("Tarea agregada correctamente")
    }

    setTimeout(() => {
      setShowForm(false)
      setCurrentPage(1)
      setSuccessMessage("")
    }, 1500)
  }

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete)
      setShowDeleteConfirm(false)
      setTaskToDelete(null)
      setSuccessMessage("Tarea eliminada correctamente")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Pendiente": "bg-gradient-to-r from-gray-500 to-slate-600 text-white",
      "En Progreso": "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
      "En Revisión": "bg-gradient-to-r from-yellow-500 to-orange-600 text-white",
      "Completada": "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
    }
    return colors[status] || colors["Pendiente"]
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      "Baja": "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
      "Media": "bg-gradient-to-r from-blue-500 to-cyan-600 text-white",
      "Alta": "bg-gradient-to-r from-orange-500 to-red-600 text-white",
      "Urgente": "bg-gradient-to-r from-red-600 to-pink-700 text-white shadow-lg animate-pulse",
    }
    return colors[priority] || colors["Media"]
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900">Éxito</AlertTitle>
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700">
          Nueva Tarea
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="pt-12">
            <p className="text-center text-slate-500">No hay tareas. Crea una nueva.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Tareas ({tasks.length})</CardTitle>
              <CardDescription>
                Página {currentPage} de {totalPages}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Fecha Límite</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.description}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{task.dateline || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditClick(task)}
                            >
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteClick(task.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Modal de Formulario */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
            <DialogDescription>Completa la información de la tarea</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción *</Label>
              <textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe la tarea..."
                className="w-full rounded-md border border-slate-300 p-2 min-h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status || "Pendiente"} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En Progreso">En Progreso</SelectItem>
                    <SelectItem value="En Revisión">En Revisión</SelectItem>
                    <SelectItem value="Completada">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select value={formData.priority || "Media"} onValueChange={(value) => setFormData({ ...formData, priority: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="projectId">Proyecto ID</Label>
                <Input
                  id="projectId"
                  value={formData.projectId || ""}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  placeholder="ID del proyecto"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="userId">Usuario ID</Label>
                <Input
                  id="userId"
                  value={formData.userId || ""}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="ID del usuario asignado"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateline">Fecha Límite</Label>
              <Input
                id="dateline"
                type="date"
                value={formData.dateline || ""}
                onChange={(e) => setFormData({ ...formData, dateline: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingTask ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La tarea será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
