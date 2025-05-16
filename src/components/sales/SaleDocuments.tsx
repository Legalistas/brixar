'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileUp, Trash2, FileText, Download, Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { Sale } from '@/store/saleStore'

interface SaleDocument {
  id: string
  name: string
  type: string
  url: string
  uploadDate: string
}

interface SaleDocumentsProps {
  sale: Sale
  onUpdate: (documents: SaleDocument[]) => Promise<void>
  isLoading?: boolean
}

export function SaleDocuments({ sale, onUpdate, isLoading = false }: SaleDocumentsProps) {
  const initialDocuments = sale.documents as SaleDocument[] || []
  const [documents, setDocuments] = useState<SaleDocument[]>(initialDocuments)
  const [uploadingFile, setUploadingFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingFile(e.target.files[0])
    }
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentType(e.target.value)
  }

  const handleUpload = async () => {
    if (!uploadingFile || !documentType) {
      toast({
        title: 'Error',
        description: 'Por favor seleccione un archivo y especifique el tipo de documento',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsLoading(true)
      
      // Aquí iría el código para subir el archivo a un servidor/almacenamiento
      // Por ahora simulamos la subida con un timeout
      
      // Simulación de carga
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Crear un nuevo documento
      const newDocument: SaleDocument = {
        id: Date.now().toString(), // ID temporal
        name: uploadingFile.name,
        type: documentType,
        url: URL.createObjectURL(uploadingFile), // URL temporal
        uploadDate: new Date().toISOString(),
      }
      
      const updatedDocuments = [...documents, newDocument]
      setDocuments(updatedDocuments)
      
      // Actualizar en el servidor
      await onUpdate(updatedDocuments)
      
      // Limpiar estado
      setUploadingFile(null)
      setDocumentType('')
      
      toast({
        title: 'Documento subido',
        description: 'El documento se ha subido correctamente.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo subir el documento. Intente nuevamente.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (documentId: string) => {
    try {
      setIsLoading(true)
      
      const updatedDocuments = documents.filter(doc => doc.id !== documentId)
      setDocuments(updatedDocuments)
      
      // Actualizar en el servidor
      await onUpdate(updatedDocuments)
      
      toast({
        title: 'Documento eliminado',
        description: 'El documento se ha eliminado correctamente.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el documento. Intente nuevamente.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const [isLoading, setIsLoading] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos de la Venta</CardTitle>
        <CardDescription>
          Gestione los documentos importantes relacionados con esta transacción
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Formulario de subida */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document-type">Tipo de documento</Label>
              <Input
                id="document-type"
                placeholder="Ej: Contrato, Escritura, DNI, etc."
                value={documentType}
                onChange={handleTypeChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-file">Archivo</Label>
              <div className="flex gap-2">
                <Input
                  id="document-file"
                  type="file"
                  onChange={handleFileChange}
                />
                <Button 
                  type="button" 
                  onClick={handleUpload}
                  disabled={!uploadingFile || !documentType || isLoading}
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  Subir
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Lista de documentos */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Documentos subidos</h3>
          
          {documents.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay documentos subidos para esta venta</p>
              <Button variant="outline" size="sm" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Añadir documento
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
