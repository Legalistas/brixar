"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
    onImagesSelected: (files: File[]) => void
    existingImages?: any[]
    onRemoveExistingImage?: (index: number) => void
    maxImages?: number
}

export default function ImageUpload({
    onImagesSelected,
    existingImages = [],
    onRemoveExistingImage,
    maxImages = 10,
}: ImageUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        if (files.length === 0) return

        // Limit the number of images
        const totalImages = selectedFiles.length + existingImages.length + files.length
        const filesToAdd = files.slice(0, Math.max(0, maxImages - selectedFiles.length - existingImages.length))

        if (totalImages > maxImages) {
            alert(`Solo puedes subir un máximo de ${maxImages} imágenes`)
        }

        // Create preview URLs
        const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file))

        // Update state
        setSelectedFiles((prev) => [...prev, ...filesToAdd])
        setPreviews((prev) => [...prev, ...newPreviews])

        // Notify parent component
        onImagesSelected([...selectedFiles, ...filesToAdd])

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleRemoveFile = (index: number) => {
        // Remove file and preview
        const newFiles = [...selectedFiles]
        const newPreviews = [...previews]

        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(previews[index])

        newFiles.splice(index, 1)
        newPreviews.splice(index, 1)

        setSelectedFiles(newFiles)
        setPreviews(newPreviews)
        onImagesSelected(newFiles)
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="space-y-4">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Existing images */}
                {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative aspect-square rounded-md overflow-hidden border">
                        <div className="w-full h-full relative">
                            <Image
                                src={image.url || "/placeholder.svg"}
                                alt={image.alt || `Image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {onRemoveExistingImage && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 rounded-full"
                                onClick={() => onRemoveExistingImage(index)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                        {index === 0 && (
                            <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                Principal
                            </div>
                        )}
                    </div>
                ))}

                {/* New image previews */}
                {previews.map((preview, index) => (
                    <div key={`preview-${index}`} className="relative aspect-square rounded-md overflow-hidden border">
                        <div className="w-full h-full relative">
                            <Image src={preview || "/placeholder.svg"} alt={`New image ${index + 1}`} fill className="object-cover" />
                        </div>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 rounded-full"
                            onClick={() => handleRemoveFile(index)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ))}

                {/* Add image button */}
                {existingImages.length + selectedFiles.length < maxImages && (
                    <div className="relative aspect-square">
                        <Button
                            type="button"
                            variant="outline"
                            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-md hover:bg-muted/50"
                            onClick={handleButtonClick}
                        >
                            <Plus className="h-6 w-6 mb-1" />
                            <span className="text-xs text-center">Añadir imagen</span>
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>
                    {existingImages.length + selectedFiles.length} de {maxImages} imágenes
                </span>
                {selectedFiles.length > 0 && <span>{selectedFiles.length} nuevas imágenes seleccionadas</span>}
            </div>
        </div>
    )
}
