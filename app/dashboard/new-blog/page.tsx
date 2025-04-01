"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Save, ImageIcon } from "lucide-react"

export default function NewBlogPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    isPublished: true,
    featuredImage: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublished: checked }))
  }

  const handleImageSelect = () => {
    // In a real app, this would open a file picker
    // For this demo, we'll just set a placeholder image
    setFormData((prev) => ({
      ...prev,
      featuredImage: `/placeholder.svg?height=400&width=600`,
    }))
    toast({
      title: "Image selected",
      description: "Featured image has been added to your blog post.",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.title.trim()) {
        toast({
          title: "Error",
          description: "Blog title is required",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Get existing blogs from localStorage
      const storedBlogs = localStorage.getItem("blogs")
      const blogs = storedBlogs ? JSON.parse(storedBlogs) : []

      // Create new blog
      const newBlog = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        category: formData.category,
        isPublished: formData.isPublished,
        featuredImage: formData.featuredImage,
        createdAt: new Date().toISOString(),
      }

      // Add new blog to the list
      const updatedBlogs = [...blogs, newBlog]
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs))

      // Show success message
      toast({
        title: "Success",
        description: "Your blog post has been created successfully.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating blog:", error)
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Create New Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Blog Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter blog title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your blog content here..."
                rows={10}
                value={formData.content}
                onChange={handleChange}
                className="min-h-[200px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={handleSelectChange}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleImageSelect}
                    className="flex items-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Select Image</span>
                  </Button>
                  {formData.featuredImage && <span className="text-sm text-muted-foreground">Image selected</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch id="published" checked={formData.isPublished} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? "Creating..." : "Create Blog"}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

