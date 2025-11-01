"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function SettingsSection() {
  const [settings, setSettings] = useState({
    companyName: "Mi Empresa",
    email: "admin@miempresa.com",
    phone: "+1 (555) 000-0000",
    theme: "dark",
    language: "es",
    notifications: true,
    autoSave: true,
    backupDaily: true,
    maxTeamMembers: "50",
  })

  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Configuraciones guardadas:", settings)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {showSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900">Éxito</AlertTitle>
          <AlertDescription className="text-green-800">
            Las configuraciones han sido guardadas correctamente.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de Empresa */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Empresa</CardTitle>
            <CardDescription>Actualiza los datos básicos de tu empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="companyName">Nombre de la Empresa</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="Mi Empresa"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="admin@miempresa.com"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferencias de Aplicación */}
        <Card>
          <CardHeader>
            <CardTitle>Preferencias de Aplicación</CardTitle>
            <CardDescription>Personaliza la experiencia de uso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="theme">Tema</Label>
                <Select value={settings.theme} onValueChange={(value) => handleChange("theme", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="auto">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="language">Idioma</Label>
                <Select value={settings.language} onValueChange={(value) => handleChange("language", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle>Seguridad y Notificaciones</CardTitle>
            <CardDescription>Gestiona la seguridad y las notificaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Notificaciones por Email</Label>
                <p className="text-sm text-slate-600">Recibe alertas de actividad importante</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(value) => handleChange("notifications", value)}
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <Label className="font-medium">Guardado Automático</Label>
                <p className="text-sm text-slate-600">Guardar cambios automáticamente</p>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(value) => handleChange("autoSave", value)}
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <Label className="font-medium">Copia de Seguridad Diaria</Label>
                <p className="text-sm text-slate-600">Realizar backups automáticos cada día</p>
              </div>
              <Switch
                checked={settings.backupDaily}
                onCheckedChange={(value) => handleChange("backupDaily", value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Límites */}
        <Card>
          <CardHeader>
            <CardTitle>Límites y Cuotas</CardTitle>
            <CardDescription>Configura los límites del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="maxTeamMembers">Máximo de Miembros del Equipo</Label>
              <Input
                id="maxTeamMembers"
                type="number"
                value={settings.maxTeamMembers}
                onChange={(e) => handleChange("maxTeamMembers", e.target.value)}
                placeholder="50"
                min="1"
              />
              <p className="text-sm text-slate-600">
                Límite máximo de miembros que puedes agregar a tu equipo
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de Configuración Actual */}
        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle>Resumen de Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-slate-700">Empresa:</p>
                <p className="text-slate-600">{settings.companyName}</p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Tema:</p>
                <p className="text-slate-600 capitalize">
                  {settings.theme === "light" ? "Claro" : settings.theme === "dark" ? "Oscuro" : "Automático"}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Idioma:</p>
                <p className="text-slate-600 uppercase">{settings.language}</p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Notificaciones:</p>
                <p className="text-slate-600">{settings.notifications ? "Activadas" : "Desactivadas"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 w-full">
          Guardar Configuración
        </Button>
      </form>
    </div>
  )
}
