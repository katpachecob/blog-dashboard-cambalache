"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Save, ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"

interface BlogFormData {
  title: string
  content: string
  category: string
  isPublished: boolean
  featuredImage: string
}

interface FormErrors {
  title?: string
  content?: string
  category?: string
}

export default function NewBlogPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    category: "",
    isPublished: true,
    featuredImage: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido"
    } else if (formData.title.length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres"
    }

    if (!formData.content.trim()) {
      newErrors.content = "El contenido es requerido"
    } else if (formData.content.length < 50) {
      newErrors.content = "El contenido debe tener al menos 50 caracteres"
    }

    if (!formData.category) {
      newErrors.category = "La categoría es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setHasUnsavedChanges(true)
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
    setHasUnsavedChanges(true)
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }))
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublished: checked }))
    setHasUnsavedChanges(true)
  }

  const handleImageSelect = async () => {
    setIsImageLoading(true)
    try {
      // Simular carga de imagen
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setFormData((prev) => ({
        ...prev,
        featuredImage: `/placeholder.svg?height=400&width=600`,
      }))
      setHasUnsavedChanges(true)
      toast({
        title: "Imagen seleccionada",
        description: "La imagen destacada ha sido añadida a tu blog.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la imagen. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsImageLoading(false)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("¿Estás seguro de que deseas salir? Tienes cambios sin guardar.")) {
        router.push("/dashboard")
      }
    } else {
      router.push("/dashboard")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const storedBlogs = localStorage.getItem("blogs")
      const blogs = storedBlogs ? JSON.parse(storedBlogs) : []

      const newBlog = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        isPublished: formData.isPublished,
        featuredImage: formData.featuredImage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const updatedBlogs = [...blogs, newBlog]
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs))

      toast({
        title: "¡Éxito!",
        description: "Tu blog ha sido creado exitosamente.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error al crear el blog:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el blog. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl ">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCancel}
          className="flex items-center gap-1"
          aria-label="Volver al Dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Dashboard</span>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Nuevo Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Blog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ingresa el título del blog"
                value={formData.title}
                onChange={handleChange}
                required
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p id="title-error" className="text-sm text-red-500" role="alert">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Escribe tu contenido del blog aquí..."
                rows={10}
                value={formData.content}
                onChange={handleChange}
                className="min-h-[200px]"
                aria-invalid={!!errors.content}
                aria-describedby={errors.content ? "content-error" : undefined}
              />
              {errors.content && (
                <p id="content-error" className="text-sm text-red-500" role="alert">
                  {errors.content}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={handleSelectChange}
                  required
                >
                  <SelectTrigger id="category" aria-invalid={!!errors.category}>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Tecnología</SelectItem>
                    <SelectItem value="lifestyle">Vida</SelectItem>
                    <SelectItem value="travel">Viajes</SelectItem>
                    <SelectItem value="food">Comida</SelectItem>
                    <SelectItem value="health">Salud</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500" role="alert">
                    {errors.category}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Imagen Destacada</Label>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleImageSelect}
                    className="flex items-center gap-2"
                    disabled={isImageLoading}
                  >
                    {isImageLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                    <span>{isImageLoading ? "Cargando..." : "Seleccionar Imagen"}</span>
                  </Button>
                  {formData.featuredImage && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={formData.featuredImage}
                        alt="Vista previa de la imagen destacada"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="published" 
                checked={formData.isPublished} 
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="published">Publicar inmediatamente</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isSubmitting ? "Creando..." : "Crear Blog"}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

