'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Loader2,
  Calendar,
  DollarSign,
  FileText,
  User,
  Tag,
  Plus,
  AlertCircle,
  ArrowLeft,
  Edit,
  Trash2,
  Filter,
  X,
  Download,
} from 'lucide-react'
import { useProyectStore } from '@/store/proyectStore'
import { useCostStore } from '@/store/costStore'
import { useCompensationStore } from '@/store/compensationStore'
import type { CreateProyectCostInput, ProyectCost } from '@/store/costStore'
import type { CreateProyectCompensationInput, ProyectCompensation } from '@/store/compensationStore'
import * as XLSX from 'xlsx'

// Componentes
import { AddCostPopup } from './AddCostPopup'
import FilterPanel from './FilterPanel'
import CostosTable from './CostosTable'
import CostosMetrics from './CostosMetrics'
import CostosCharts from './CostosCharts'
import CompensacionesTable from './CompensacionesTable'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import { FilterValues, FormattingFunctions, FilterOptions } from './types'

export default function CostosProyectoPage() {
  const searchParams = useSearchParams()
  const slug = searchParams?.get('slug')

  // Stores
  const {
    currentProyect,
    isLoading: isLoadingProyect,
    error: storeError,
    fetchProyectBySlug,
  } = useProyectStore()

  const {
    projectCosts,
    metrics,
    isLoading: isLoadingCosts,
    error: costError,
    fetchCostsByProyectSlug,
    createCost,
    deleteCost,
  } = useCostStore()

  const {
    projectCompensations,
    metrics: compensationMetrics,
    isLoading: isLoadingCompensations,
    error: compensationError,
    fetchCompensationsByProyectSlug,
    createCompensation,
    deleteCompensation,
  } = useCompensationStore()

  // Estado local
  const [error, setError] = useState('')
  const [showAddCostPopup, setShowAddCostPopup] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean
    costId: number | null
    compensationId: number | null
    type: 'costo' | 'compensacion'
  }>({
    show: false,
    costId: null,
    compensationId: null,
    type: 'costo'
  })

  // Estado para los filtros
  const [filters, setFilters] = useState<FilterValues>({
    rubro: '',
    inversor: '',
    mes: '',
    año: '',
  })
  
  // Formulario para nuevo costo
  const [formData, setFormData] = useState<{
    fecha: string
    tipo: string
    rubro: string
    rubroPersonalizado: string
    proveedor: string
    detalle: string
    importePesos: string
    precioDolarBlue: string
    importeDolar: string
    inversor: string
    inversorPersonalizado: string
    inversorDestino: string
    inversorDestinoPersonalizado: string
  }>({
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'costo',
    rubro: '',
    rubroPersonalizado: '',
    proveedor: '',
    detalle: '',
    importePesos: '',
    precioDolarBlue: '',
    importeDolar: '',
    inversor: '',
    inversorPersonalizado: '',
    inversorDestino: '',
    inversorDestinoPersonalizado: '',
  })

  // Datos compartidos
  const rubros = [
    'Materiales',
    'Mano Obra',
    'Remuneraciones',
    'Seguros',
    'Planos / Escrituras',
    'Bienes de Uso',
    'Logística',
    'Marketing',
    'Otros',
  ]

  const inversores = ['Oscar Andereggen', 'Agustín Andereggen', 'Otro']

  // Cargar el proyecto si se proporciona un slug
  useEffect(() => {
    if (slug) {
      fetchProyectBySlug(slug)
      fetchCostsByProyectSlug(slug)
      fetchCompensationsByProyectSlug(slug)
    }
  }, [slug, fetchProyectBySlug, fetchCostsByProyectSlug, fetchCompensationsByProyectSlug])

  // Actualizar el error local si hay error en el store
  useEffect(() => {
    if (storeError) {
      setError(storeError)
    }
    if (costError) {
      setError(costError)
    }
    if (compensationError) {
      setError(compensationError)
    }
  }, [storeError, costError, compensationError])

  // Cargar cotización del dólar blue cuando se abre el popup
  useEffect(() => {
    if (showAddCostPopup) {
      fetchDolarBlueRate()
    }
  }, [showAddCostPopup])

  // Formato de fechas y monedas (compartido entre componentes)
  const formatting: FormattingFunctions = {
    formatDate: (dateString: string) => {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date)
    },

    formatCurrency: (amount: number) => {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
      }).format(amount)
    },

    formatCurrencyUSD: (amount: number) => {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(amount)
    },

    getMonthName: (monthNumber: string) => {
      const monthNames = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ]
      return monthNames[parseInt(monthNumber)]
    },
  }

  // Extraer años y meses únicos de los costos para los filtros
  const filterOptions: FilterOptions = useMemo(() => {
    if (!projectCosts) {
      return {
        uniqueYears: [],
        uniqueMonths: [],
        uniqueRubros: [],
        uniqueInversores: [],
      }
    }

    const years = Array.from(
      new Set(
        projectCosts.map((cost) => {
          const date = new Date(cost.fecha)
          return date.getFullYear().toString()
        })
      )
    ).sort((a, b) => b.localeCompare(a)) // Ordenar años de forma descendente

    const months = Array.from(
      new Set(
        projectCosts.map((cost) => {
          const date = new Date(cost.fecha)
          return date.getMonth().toString()
        })
      )
    )

    const rubros = Array.from(new Set(projectCosts.map((cost) => cost.rubro)))

    const inversores = Array.from(
      new Set(
        projectCosts
          .filter((cost) => cost.inversor) // Filtrar registros con inversor definido
          .map((cost) => cost.inversor as string)
      )
    )

    return {
      uniqueYears: years,
      uniqueMonths: months,
      uniqueRubros: rubros,
      uniqueInversores: inversores,
    }
  }, [projectCosts])

  // Aplicar filtros a la lista de costos
  const filteredCosts = useMemo(() => {
    if (!projectCosts) {
      return []
    }

    return projectCosts.filter((cost) => {
      const costDate = new Date(cost.fecha)
      const costYear = costDate.getFullYear().toString()
      const costMonth = costDate.getMonth().toString()

      // Aplicar filtro por año si se ha seleccionado
      if (filters.año && costYear !== filters.año) {
        return false
      }

      // Aplicar filtro por mes si se ha seleccionado
      if (filters.mes && costMonth !== filters.mes) {
        return false
      }

      // Aplicar filtro por rubro si se ha seleccionado
      if (filters.rubro && cost.rubro !== filters.rubro) {
        return false
      }

      // Aplicar filtro por inversor si se ha seleccionado
      if (filters.inversor && cost.inversor !== filters.inversor) {
        return false
      }

      return true
    })
  }, [projectCosts, filters])

  // Aplicar filtros a la lista de compensaciones
  const filteredCompensations = useMemo(() => {
    if (!projectCompensations) {
      return []
    }

    return projectCompensations.filter((comp) => {
      const compDate = new Date(comp.fecha)
      const compYear = compDate.getFullYear().toString()
      const compMonth = compDate.getMonth().toString()

      // Aplicar filtro por año si se ha seleccionado
      if (filters.año && compYear !== filters.año) {
        return false
      }

      // Aplicar filtro por mes si se ha seleccionado
      if (filters.mes && compMonth !== filters.mes) {
        return false
      }

      // Aplicar filtro por inversor si se ha seleccionado
      if (filters.inversor && comp.inversorOrigen !== filters.inversor && comp.inversorDestino !== filters.inversor) {
        return false
      }

      return true
    })
  }, [projectCompensations, filters])

  // Calcular métricas filtradas
  const filteredMetrics = useMemo(() => {
    if (filteredCosts.length === 0) {
      return {
        totalPesos: 0,
        totalDolares: 0,
      }
    }

    return {
      totalPesos: filteredCosts.reduce(
        (sum, cost) => sum + Number(cost.importePesos),
        0
      ),
      totalDolares: filteredCosts.reduce(
        (sum, cost) => sum + Number(cost.importeDolar),
        0
      ),
    }
  }, [filteredCosts])

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setFilters({
      rubro: '',
      inversor: '',
      mes: '',
      año: '',
    })
  }

  // Manejar cambios en el formulario
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    // Actualizar el estado en una sola operación para evitar múltiples renderizados
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }

      // Calcular automáticamente el importe en dólares cuando cambian los valores
      if (name === 'importePesos' || name === 'precioDolarBlue') {
        const pesos =
          parseFloat(name === 'importePesos' ? value : newData.importePesos) ||
          0
        const cotizacion =
          parseFloat(
            name === 'precioDolarBlue' ? value : newData.precioDolarBlue
          ) || 0

        if (pesos > 0 && cotizacion > 0) {
          newData.importeDolar = (pesos / cotizacion).toFixed(2)
        }
      }

      return newData
    })
  }

  // Manejar cambios en los filtros
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // Función para obtener la cotización actual del dólar blue
  const fetchDolarBlueRate = async () => {
    try {
      const response = await fetch('/api/currencies')
      const data = await response.json()

      // Buscar la moneda "USD" o "USDBLUE" en los resultados
      const usdCurrency = data.find(
        (currency: any) =>
          currency.code === 'USD' ||
          currency.name?.toLowerCase().includes('dolar') ||
          currency.code === 'USDBLUE'
      )

      if (usdCurrency && usdCurrency.rate) {
        // Actualizar el estado del formulario con la cotización actual
        setFormData((prev) => {
          const newData = {
            ...prev,
            precioDolarBlue: usdCurrency.rate.toString(),
          }

          // Recalcular el importe en dólares si ya hay un importe en pesos
          if (prev.importePesos) {
            const pesos = parseFloat(prev.importePesos)
            const cotizacion = parseFloat(usdCurrency.rate)
            if (pesos > 0 && cotizacion > 0) {
              newData.importeDolar = (pesos / cotizacion).toFixed(2)
            }
          }

          return newData
        })
      }
    } catch (error) {
      console.error('Error al obtener la cotización del dólar blue:', error)
      // No mostramos error en UI para no interrumpir la experiencia
    }
  }

  // Guardar en la base de datos (costo o compensación)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentProyect) return

    try {
      setError('')
      const fechaObj = new Date(formData.fecha)
      const mes = `${fechaObj.getFullYear()}-${String(
        fechaObj.getMonth() + 1
      ).padStart(2, '0')}`

      // Si el tipo es compensación, registramos una compensación entre inversores
      if (formData.tipo === 'compensacion') {
        const compensationData: CreateProyectCompensationInput = {
          proyectId: currentProyect.id,
          fecha: formData.fecha,
          mes: mes,
          detalle: formData.detalle,
          importePesos: parseFloat(formData.importePesos),
          precioDolarBlue: parseFloat(formData.precioDolarBlue),
          importeDolar: parseFloat(formData.importeDolar),
          inversorOrigen:
            formData.inversor === 'Otro'
              ? formData.inversorPersonalizado
              : formData.inversor,
          inversorDestino:
            formData.inversorDestino === 'Otro'
              ? formData.inversorDestinoPersonalizado
              : formData.inversorDestino,
        }

        const success = await createCompensation(compensationData)

        if (success) {
          setShowAddCostPopup(false)
          // Recargar las compensaciones para actualizar la vista
          fetchCompensationsByProyectSlug(slug as string)
          // Limpiar el formulario
          resetForm()
        }
      } else {
        // Registramos un costo normal
        const costData: CreateProyectCostInput = {
          proyectId: currentProyect.id,
          fecha: formData.fecha,
          mes: mes,
          tipo: formData.tipo,
          rubro:
            formData.rubro === 'Otros'
              ? formData.rubroPersonalizado
              : formData.rubro,
          proveedor: formData.proveedor,
          detalle: formData.detalle,
          importePesos: parseFloat(formData.importePesos),
          precioDolarBlue: parseFloat(formData.precioDolarBlue),
          importeDolar: parseFloat(formData.importeDolar),
          inversor:
            formData.inversor === 'Otro'
              ? formData.inversorPersonalizado
              : formData.inversor
        }

        const success = await createCost(costData)

        if (success) {
          setShowAddCostPopup(false)
          // Recargar los costos para actualizar la vista
          fetchCostsByProyectSlug(slug as string)
          // Limpiar el formulario
          resetForm()
        }
      }
    } catch (err) {
      setError(
        'Error al guardar: ' +
          (err instanceof Error ? err.message : 'Error desconocido')
      )
    }
  }

  // Resetear el formulario
  const resetForm = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'costo',
      rubro: '',
      rubroPersonalizado: '',
      proveedor: '',
      detalle: '',
      importePesos: '',
      precioDolarBlue: '',
      importeDolar: '',
      inversor: '',
      inversorPersonalizado: '',
      inversorDestino: '',
      inversorDestinoPersonalizado: '',
    })
  }

  // Manejar la eliminación de un costo o compensación
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      setError('')

      let success = false;

      if (deleteConfirmation.type === 'costo' && deleteConfirmation.costId) {
        success = await deleteCost(deleteConfirmation.costId)
        
        if (success && slug) {
          await fetchCostsByProyectSlug(slug)
        }
      } else if (deleteConfirmation.type === 'compensacion' && deleteConfirmation.compensationId) {
        success = await deleteCompensation(deleteConfirmation.compensationId)
        
        if (success && slug) {
          await fetchCompensationsByProyectSlug(slug)
        }
      }

      if (success) {
        // Cerrar el modal de confirmación
        setDeleteConfirmation({ 
          show: false, 
          costId: null,
          compensationId: null,
          type: 'costo' 
        })
      } else {
        setError('No se pudo eliminar el registro. Intente nuevamente.')
      }
    } catch (err) {
      setError(
        'Error al eliminar: ' +
          (err instanceof Error ? err.message : 'Error desconocido')
      )
    } finally {
      setIsDeleting(false)
    }
  }

  // Mostrar confirmación antes de eliminar
  const showDeleteConfirmation = (id: number, type: 'costo' | 'compensacion' = 'costo') => {
    if (type === 'costo') {
      setDeleteConfirmation({
        show: true,
        costId: id,
        compensationId: null,
        type: 'costo'
      })
    } else {
      setDeleteConfirmation({
        show: true,
        costId: null,
        compensationId: id,
        type: 'compensacion'
      })
    }
  }

  // Cancelar la eliminación
  const cancelDelete = () => {
    setDeleteConfirmation({
      show: false,
      costId: null,
      compensationId: null,
      type: 'costo'
    })
  }

  // Función para exportar costos a Excel
  const exportToExcel = () => {
    // Datos que se exportarán
    const dataToExport = (
      Object.values(filters).some((v) => v !== '')
        ? filteredCosts
        : projectCosts || []
    ).map((cost: ProyectCost) => ({
      Fecha: formatting.formatDate(cost.fecha),
      Rubro: cost.rubro,
      Proveedor: cost.proveedor || '-',
      Detalle: cost.detalle || '-',
      'Importe ARS': cost.importePesos,
      'Cotización USD': cost.precioDolarBlue,
      'Importe USD': cost.importeDolar,
      Inversor: cost.inversor || '-',
      Usuario: cost.usuario?.name || cost.usuario?.email || '-',
    }))

    // Crear un nuevo libro de trabajo
    const wb = XLSX.utils.book_new()
    // Convertir los datos a una hoja de cálculo
    const ws = XLSX.utils.json_to_sheet(dataToExport)

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Costos')

    // Generar un nombre para el archivo
    const fileName = `Costos_${
      currentProyect?.title.replace(/\s+/g, '_') || 'Proyecto'
    }_${new Date().toISOString().split('T')[0]}.xlsx`

    // Escribir el libro y descargar
    XLSX.writeFile(wb, fileName)
  }

  // Verificar estado de carga
  const isLoading = isLoadingProyect || isLoadingCosts || isLoadingCompensations

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
          <p className="mt-2 text-slate-500">
            Cargando información del proyecto...
          </p>
        </div>
      </div>
    )
  }

  // Si no hay un slug o proyecto seleccionado, mostrar lista de proyectos
  if (!slug || !currentProyect) {
    return (
      <div className="container mx-auto py-8 px-4 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-slate-800">
            Costos de Proyectos
          </h1>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md mb-4">
          Por favor, seleccione un proyecto para gestionar sus costos desde la
          página de proyectos.
        </div>

        <Link
          href="/admin/dashboard/proyectos"
          className="inline-flex items-center text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a la lista de proyectos
        </Link>
      </div>
    )
  }

  // Verificar si hay filtros activos
  const isFiltered = Object.values(filters).some((v) => v !== '')
  // Costos a mostrar (filtrados o todos)
  const costsToShow = isFiltered ? filteredCosts : projectCosts || []
  // Métricas a mostrar
  const metricsToShow = isFiltered
    ? filteredMetrics
    : metrics || { totalPesos: 0, totalDolares: 0 }
  // Compensaciones a mostrar
  const compensationsToShow = isFiltered ? filteredCompensations : projectCompensations || []

  return (
    <div className="container mx-auto py-8 px-4 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            href="/admin/dashboard/proyectos"
            className="inline-flex items-center text-slate-700 hover:text-slate-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a proyectos
          </Link>
          <h1 className="text-2xl font-medium text-slate-800">
            Costos del Proyecto: {currentProyect.title}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium py-2 px-4 rounded-md transition-colors flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
          <button
            onClick={() => setShowAddCostPopup(true)}
            className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir Costo/Compensación
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar a Excel
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Panel de filtros (mostrar/ocultar) */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
          options={filterOptions}
          formatting={formatting}
          filteredCount={filteredCosts.length}
          totalCount={projectCosts?.length || 0}
        />
      )}

      {/* Sección de resumen de costos */}
      <CostosMetrics
        metrics={metricsToShow}
        formatting={formatting}
        isFiltered={isFiltered}
        totalCount={costsToShow.length}
        metrosConstruidos={currentProyect.proyectDetails?.surface}
        gastosPorInversor={costsToShow.reduce((acc, cost) => {
          if (cost.inversor) {
            acc[cost.inversor] = (acc[cost.inversor] || 0) + cost.importePesos
          }
          return acc
        }, {} as Record<string, number>)}	
      />

      {/* Sección de gráficos */}
      {costsToShow.length > 0 && (
        <CostosCharts costs={costsToShow} formatting={formatting} />
      )}

      {/* Lista de costos */}
      <CostosTable
        costs={costsToShow}
        showDeleteConfirmation={(id) => showDeleteConfirmation(id, 'costo')}
        formatting={formatting}
        isFiltered={isFiltered}
      />

      {/* Lista de compensaciones entre inversores */}
      {projectCompensations && (
        <CompensacionesTable
          compensations={compensationsToShow}
          showDeleteConfirmation={(id) => showDeleteConfirmation(id, 'compensacion')}
          formatting={formatting}
          isFiltered={isFiltered}
        />
      )}

      {/* Popup para añadir un nuevo costo o compensación */}
      {showAddCostPopup && currentProyect && (
        <AddCostPopup
          currentProyect={currentProyect}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setShowAddCostPopup={setShowAddCostPopup}
          rubros={rubros}
          inversores={inversores}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.show}
        costId={deleteConfirmation.costId}
        compensationId={deleteConfirmation.compensationId}
        type={deleteConfirmation.type}
        onDelete={handleDelete}
        onCancel={cancelDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
