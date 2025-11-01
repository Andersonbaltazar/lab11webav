"use client"

import { useState } from "react"
import { useDashboard, Project } from "@/context/dashboard-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface ProjectFormProps {
  editProject?: Project | null
}

export function ProjectFormDialog({ editProject }: ProjectFormProps) {
  const { addProject, updateProject } = useDashboard()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState<Partial<Project>>(
    editProject || {
      name: "",
      description: "",
      category: "",
      priority: "Media",
      members: [],
      status: "Planificación",
      progress: 0,
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!formData.name?.trim()) {
      setError("El nombre del proyecto es requerido")
      return
    }

    if (!formData.category) {
      setError("Debes seleccionar una categoría")
      return
    }

    try {
      if (editProject && editProject.id) {
        updateProject(editProject.id, formData)
        setSuccess(true)
      } else {
        const newProject: Project = {
          id: `proj-${Date.now()}`,
          name: formData.name,
          description: formData.description || "",
          category: formData.category || "",
          priority: formData.priority || "Media",
          members: formData.members || [],
          status: formData.status || "Planificación",
          progress: formData.progress || 0,
          createdAt: new Date().toISOString().split("T")[0],
        }
        addProject(newProject)
        setSuccess(true)
      }

      setTimeout(() => {
        setOpen(false)
        setFormData({
          name: "",
          description: "",
          category: "",
          priority: "Media",
          members: [],
          status: "Planificación",
          progress: 0,
        })
        setSuccess(false)
      }, 1500)
    } catch (err) {
      setError("Error al guardar el proyecto")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mr-2 h-4 w-4"
          >
            <path d="M5 12h14M12 5v14" />
          </svg>
          {editProject ? "Editar Proyecto" : "Nuevo Proyecto"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editProject ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</DialogTitle>
            <DialogDescription>
              Completa la información del proyecto
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Éxito</AlertTitle>
              <AlertDescription className="text-green-800">
                {editProject ? "Proyecto actualizado correctamente" : "Proyecto creado correctamente"}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Proyecto *</Label>
              <Input
                id="name"
                placeholder="Mi Proyecto"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-slate-300"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Descripción del proyecto..."
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select value={formData.category || ""} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Desarrollo Web</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="design">Diseño</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select value={formData.priority || "Media"} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
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
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status || "Planificación"} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planificación">Planificación</SelectItem>
                    <SelectItem value="En Progreso">En Progreso</SelectItem>
                    <SelectItem value="En Revisión">En Revisión</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="progress">Progreso (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress || 0}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                  className="border-slate-300"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editProject ? "Actualizar" : "Crear Proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
