"use client"

import { useState } from "react"
import { useDashboard, TeamMember } from "@/context/dashboard-context"
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
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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

export function TeamSection() {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useDashboard()
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: "",
    email: "",
    role: "Developer",
    position: "",
    birthdate: "",
    phone: "",
    projectId: "",
    isActive: true,
  })

  const handleAddClick = () => {
    setEditingMember(null)
    setFormData({
      name: "",
      email: "",
      role: "Developer",
      position: "",
      birthdate: "",
      phone: "",
      projectId: "",
      isActive: true,
    })
    setShowForm(true)
  }

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member)
    setFormData(member)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name?.trim() || !formData.email?.trim()) {
      alert("Por favor completa los campos requeridos")
      return
    }

    if (editingMember) {
      updateTeamMember(editingMember.userId, formData)
      setSuccessMessage("Miembro actualizado correctamente")
    } else {
      const newMember: TeamMember = {
        userId: `user-${Date.now()}`,
        name: formData.name || "",
        email: formData.email || "",
        role: formData.role || "Developer",
        position: formData.position || "",
        birthdate: formData.birthdate || "",
        phone: formData.phone || "",
        projectId: formData.projectId || "",
        isActive: formData.isActive ?? true,
      }
      addTeamMember(newMember)
      setSuccessMessage("Miembro agregado correctamente")
    }

    setTimeout(() => {
      setShowForm(false)
      setSuccessMessage("")
    }, 1500)
  }

  const handleDeleteClick = (userId: string) => {
    setMemberToDelete(userId)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (memberToDelete) {
      deleteTeamMember(memberToDelete)
      setShowDeleteConfirm(false)
      setMemberToDelete(null)
      setSuccessMessage("Miembro eliminado correctamente")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
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
          Agregar Miembro
        </Button>
      </div>

      {teamMembers.length === 0 ? (
        <Card>
          <CardContent className="pt-12">
            <p className="text-center text-slate-500">No hay miembros. Agrega uno nuevo.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.userId} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription>{member.position}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={member.isActive ? "default" : "secondary"}>
                    {member.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium text-slate-600">Email:</span> {member.email}
                  </p>
                  <p>
                    <span className="font-medium text-slate-600">Rol:</span> {member.role}
                  </p>
                  <p>
                    <span className="font-medium text-slate-600">Teléfono:</span> {member.phone || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium text-slate-600">Fecha de Nacimiento:</span>{" "}
                    {member.birthdate || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium text-slate-600">Proyecto:</span> {member.projectId || "Sin asignar"}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditClick(member)}
                    className="flex-1"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(member.userId)}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Formulario */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Editar Miembro" : "Agregar Nuevo Miembro"}
            </DialogTitle>
            <DialogDescription>Completa la información del miembro del equipo</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Juan Pérez"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="juan@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={formData.role || "Developer"} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                    <SelectItem value="Manager">Project Manager</SelectItem>
                    <SelectItem value="QA">QA Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Posición</Label>
                <Input
                  id="position"
                  value={formData.position || ""}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Frontend Developer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="birthdate">Fecha de Nacimiento</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate || ""}
                  onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="projectId">Proyecto</Label>
              <Input
                id="projectId"
                value={formData.projectId || ""}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                placeholder="ID del proyecto"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive ?? true}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-slate-300"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Miembro Activo
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingMember ? "Actualizar" : "Agregar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog para confirmar eliminación */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar miembro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El miembro será eliminado permanentemente.
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
