"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock blog data type
interface Blog {
  id: string
  title: string
  content: string
  category?: string
  isPublished?: boolean
  featuredImage?: string
  createdAt: string
  updatedAt?: string
}

export default function Dashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load blogs from localStorage on component mount
    const storedBlogs = localStorage.getItem("blogs")
    if (storedBlogs) {
      try {
        setBlogs(JSON.parse(storedBlogs))
      } catch (e) {
        console.error("Failed to parse stored blogs", e)
        // Reset if data is corrupted
        localStorage.removeItem("blogs")
      }
    } else {
      // Set some example blogs for first-time users
      const exampleBlogs: Blog[] = [
        {
          id: "1",
          title: "Getting Started with Next.js",
          content: "Next.js is a React framework that enables server-side rendering and static site generation...",
          createdAt: new Date().toISOString(),
          category: "technology",
          isPublished: true,
        },
      ]
      setBlogs(exampleBlogs)
      localStorage.setItem("blogs", JSON.stringify(exampleBlogs))
    }
  }, [])

  const handleDeleteBlog = (id: string) => {
    const updatedBlogs = blogs.filter((blog) => blog.id !== id)
    setBlogs(updatedBlogs)
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs))
  }

  const handleEditBlog = (id: string) => {
    router.push(`/dashboard/edit-blog/${id}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tus Publicaciones</h1>
        <Button onClick={() => router.push("/dashboard/new-blog")} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Nueva publicación</span>
        </Button>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tienes ninguna publicación. Crea tu primera publicación!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
                <CardDescription>
                  {formatDate(blog.createdAt)}
                  {blog.category && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                      {blog.category}
                    </span>
                  )}
                  {blog.isPublished === false && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-medium">
                      Draft
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">{blog.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleEditBlog(blog.id)}
                >
                  <Edit className="h-4 w-4" />
                  <span>Editar</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleDeleteBlog(blog.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

