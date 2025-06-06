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
  ChevronDown,
} from 'lucide-react'
import { useProyectStore } from '@/store/proyectStore'
import { useCostStore } from '@/store/costStore'
import { useCompensationStore } from '@/store/compensationStore'
import type { CreateProyectCostInput, ProyectCost } from '@/store/costStore'
import type {
  CreateProyectCompensationInput,
  ProyectCompensation,
} from '@/store/compensationStore'
import * as XLSX from 'xlsx'

// Componentes
import { AddCostPopup } from './AddCostPopup'
import { EditCompensationPopup } from './EditCompensationPopup'
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
  } = useCompensationStore()  // Estado local
  const [error, setError] = useState('')
  const [showAddCostPopup, setShowAddCostPopup] = useState(false)
  const [showEditCompensationPopup, setShowEditCompensationPopup] = useState(false)
  const [selectedCompensation, setSelectedCompensation] = useState<ProyectCompensation | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showExportDropdown, setShowExportDropdown] = useState(false)
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
    type: 'costo',
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
    'Servicios',
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
  }, [
    slug,
    fetchProyectBySlug,
    fetchCostsByProyectSlug,
    fetchCompensationsByProyectSlug,
  ])

  // Actualizar el error local si hay error en el store
  useEffect(() => {
    if (storeError) {
      setError(storeError)
    }
    if (costError) {
      setError(costError)
    }
  }, [storeError, costError])
  // Cargar cotización del dólar blue cuando se abre el popup
  useEffect(() => {
    if (showAddCostPopup) {
      fetchDolarBlueRate()
    }
  }, [showAddCostPopup])
  // Función para refrescar los datos después de agregar una compensación
  const handleDataRefresh = () => {
    if (slug) {
      fetchCostsByProyectSlug(slug)
      fetchCompensationsByProyectSlug(slug)
    }
  }

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showExportDropdown && !target.closest('.export-dropdown-container')) {
        setShowExportDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showExportDropdown])

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

      const dolarInfo = data[1];

      if (dolarInfo) {
        // Actualizar el estado del formulario con la cotización actual
        setFormData((prev) => {
          const newData = {
            ...prev,
            precioDolarBlue: dolarInfo.rate.toString() || '1200',
          }

          // Recalcular el importe en dólares si ya hay un importe en pesos
          if (prev.importePesos) {
            const pesos = parseFloat(prev.importePesos)
            const cotizacion = parseFloat(dolarInfo.rate)
            if (pesos > 0 && cotizacion > 0) {
              newData.importeDolar = (pesos / cotizacion).toFixed(2)
            }
          }

          return newData
        })
      }
    } catch (error) {
      console.error('Error al obtener la cotización del dólar:', error)
      // No mostramos error en UI para no interrumpir la experiencia
    }
  }
  // Guardar el costo en la base de datos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentProyect) return

    try {
      setError('')
      const fechaObj = new Date(formData.fecha)
      const mes = `${fechaObj.getFullYear()}-${String(
        fechaObj.getMonth() + 1
      ).padStart(2, '0')}`

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
            : formData.inversor,
        inversorDestino:
          formData.tipo === 'compensacion'
            ? formData.inversorDestino === 'Otro'
              ? formData.inversorDestinoPersonalizado
              : formData.inversorDestino
            : undefined,
      }

      const success = await createCost(costData)

      if (success) {
        setShowAddCostPopup(false)
        // Recargar los costos para actualizar la vista
        fetchCostsByProyectSlug(slug as string) // Limpiar el formulario
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
    } catch (err) {
      setError(
        'Error al guardar el costo: ' +
        (err instanceof Error ? err.message : 'Error desconocido')
      )    }
  }

  // Función para mostrar el popup de edición de compensación
  const showEditCompensation = (compensation: ProyectCompensation) => {
    setSelectedCompensation(compensation)
    setShowEditCompensationPopup(true)
  }

  // Manejar la eliminación de un costo o compensación
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      setError('')

      let success = false

      if (deleteConfirmation.type === 'costo' && deleteConfirmation.costId) {
        success = await deleteCost(deleteConfirmation.costId)

        if (success && slug) {
          await fetchCostsByProyectSlug(slug)
        }
      } else if (
        deleteConfirmation.type === 'compensacion' &&
        deleteConfirmation.compensationId
      ) {
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
          type: 'costo',
        })
      } else {
        setError(
          `No se pudo eliminar el ${deleteConfirmation.type}. Intente nuevamente.`
        )
      }
    } catch (err) {
      setError(
        `Error al eliminar el ${deleteConfirmation.type}: ` +
        (err instanceof Error ? err.message : 'Error desconocido')
      )
    } finally {
      setIsDeleting(false)
    }
  }
  // Mostrar confirmación antes de eliminar
  const showDeleteConfirmation = (
    id: number,
    type: 'costo' | 'compensacion' = 'costo'
  ) => {
    setDeleteConfirmation({
      show: true,
      costId: type === 'costo' ? id : null,
      compensationId: type === 'compensacion' ? id : null,
      type,
    })
  }

  // Cancelar la eliminación
  const cancelDelete = () => {
    setDeleteConfirmation({
      show: false,
      costId: null,
      compensationId: null,
      type: 'costo',
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
    const fileName = `Costos_${currentProyect?.title.replace(/\s+/g, '_') || 'Proyecto'
      }_${new Date().toISOString().split('T')[0]}.xlsx`

    // Escribir el libro y descargar
    XLSX.writeFile(wb, fileName)
  }
  // Función para exportar compensaciones a Excel
  const exportCompensationsToExcel = () => {
    const dataToExport = (projectCompensations || []).map((compensation: ProyectCompensation) => ({
      Fecha: formatting.formatDate(compensation.fecha),
      'Inversor Origen': compensation.inversorOrigen || '-',
      'Inversor Destino': compensation.inversorDestino || '-',
      'Importe ARS': compensation.importePesos,
      'Cotización USD': compensation.precioDolarBlue,
      'Importe USD': compensation.importeDolar,
      Detalle: compensation.detalle || '-',
      Usuario: compensation.usuario?.name || compensation.usuario?.email || '-',
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(dataToExport)
    XLSX.utils.book_append_sheet(wb, ws, 'Compensaciones')

    const fileName = `Compensaciones_${currentProyect?.title.replace(/\s+/g, '_') || 'Proyecto'
      }_${new Date().toISOString().split('T')[0]}.xlsx`

    XLSX.writeFile(wb, fileName)
  }

  // Función para exportar ambos (costos y compensaciones) a Excel
  const exportBothToExcel = () => {
    // Datos de costos
    const costsDataToExport = (
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

    // Datos de compensaciones
    const compensationsDataToExport = (projectCompensations || []).map((compensation: ProyectCompensation) => ({
      Fecha: formatting.formatDate(compensation.fecha),
      'Inversor Origen': compensation.inversorOrigen || '-',
      'Inversor Destino': compensation.inversorDestino || '-',
      'Importe ARS': compensation.importePesos,
      'Cotización USD': compensation.precioDolarBlue,
      'Importe USD': compensation.importeDolar,
      Detalle: compensation.detalle || '-',
      Usuario: compensation.usuario?.name || compensation.usuario?.email || '-',
    }))

    // Crear un nuevo libro de trabajo
    const wb = XLSX.utils.book_new()
    
    // Agregar hoja de costos
    const wsCosts = XLSX.utils.json_to_sheet(costsDataToExport)
    XLSX.utils.book_append_sheet(wb, wsCosts, 'Costos')
    
    // Agregar hoja de compensaciones
    const wsCompensations = XLSX.utils.json_to_sheet(compensationsDataToExport)
    XLSX.utils.book_append_sheet(wb, wsCompensations, 'Compensaciones')    // Generar un nombre para el archivo
    const fileName = `Costos_y_Compensaciones_${currentProyect?.title.replace(/\s+/g, '_') || 'Proyecto'
      }_${new Date().toISOString().split('T')[0]}.xlsx`

    // Escribir el libro y descargar
    XLSX.writeFile(wb, fileName)
  }

  // Función para calcular la equalización entre inversores
  const calculateEqualization = useMemo(() => {
    if (!projectCosts || !projectCompensations) return null

    // Calcular gastos totales por inversor
    const expensesByInvestor: { [key: string]: number } = {}
    
    // Sumar costos por inversor
    projectCosts.forEach((cost) => {
      const investor = cost.inversor || 'Sin especificar'
      expensesByInvestor[investor] = (expensesByInvestor[investor] || 0) + cost.importePesos
    })

    // Ajustar con compensaciones
    projectCompensations.forEach((compensation) => {
      const origen = compensation.inversorOrigen || 'Sin especificar'
      const destino = compensation.inversorDestino || 'Sin especificar'
      
      // El inversor origen "paga" la compensación (reduce su gasto neto)
      expensesByInvestor[origen] = (expensesByInvestor[origen] || 0) - compensation.importePesos
      // El inversor destino "recibe" la compensación (aumenta su gasto neto)
      expensesByInvestor[destino] = (expensesByInvestor[destino] || 0) + compensation.importePesos
    })

    // Calcular gasto promedio
    const investors = Object.keys(expensesByInvestor).filter(inv => inv !== 'Sin especificar')
    if (investors.length < 2) return null

    const totalExpenses = investors.reduce((sum, inv) => sum + expensesByInvestor[inv], 0)
    const averageExpense = totalExpenses / investors.length

    // Calcular cuánto debe pagar/recibir cada inversor para equalizar
    const equalization = investors.map(investor => ({
      investor,
      currentExpense: expensesByInvestor[investor],
      targetExpense: averageExpense,
      difference: expensesByInvestor[investor] - averageExpense,
      shouldPay: expensesByInvestor[investor] > averageExpense,
    }))

    return equalization
  }, [projectCosts, projectCompensations])

  // Verificar estado de carga
  const isLoading = isLoadingProyect || isLoadingCosts

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
            Añadir
          </button>          <div className="relative export-dropdown-container">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar a Excel
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      exportToExcel()
                      setShowExportDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-3" />
                    Exportar solo costos
                  </button>
                  <button
                    onClick={() => {
                      exportCompensationsToExcel()
                      setShowExportDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-3" />
                    Exportar solo compensaciones
                  </button>
                  <button
                    onClick={() => {
                      exportBothToExcel()
                      setShowExportDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-3" />
                    Exportar costos y compensaciones
                  </button>
                </div>
              </div>
            )}
          </div>
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
      )}      {/* Sección de resumen de costos */}
      <CostosMetrics
        metrics={metricsToShow}
        formatting={formatting}
        isFiltered={isFiltered}
        totalCount={costsToShow.length}
        metrosConstruidos={currentProyect.proyectDetails?.surface}
        gastosPorInversor={costsToShow.reduce((acc, cost) => {
          if (cost.inversor) {
            acc[cost.inversor] = (acc[cost.inversor] || 0) + Number(cost.importePesos)
          }
          return acc
        }, {} as Record<string, number>)}
        compensations={projectCompensations}
        compensationMetrics={compensationMetrics ? {
          totalPesos: compensationMetrics.totalPesos,
          totalDolares: compensationMetrics.totalDolares
        } : undefined}
      />

      {/* Lista de costos */}
      <div className="my-6">
        <h2 className="text-xl font-medium text-slate-800 mb-4">
          Costos del proyecto
        </h2>        <CostosTable
          costs={costsToShow}
          showDeleteConfirmation={showDeleteConfirmation}
          formatting={formatting}
          isFiltered={isFiltered}
          currentProyect={currentProyect}
          onCostUpdated={() => fetchCostsByProyectSlug(slug as string)}
          rubros={rubros}
          inversores={inversores}
        />
      </div>      {/* Lista de compensaciones */}
      {projectCompensations.length > 0 && (
        <CompensacionesTable
          compensations={projectCompensations}
          showDeleteConfirmation={(compensationId, type) =>
            setDeleteConfirmation({
              show: true,
              compensationId,
              costId: null,
              type: 'compensacion',
            })
          }
          showEditCompensation={showEditCompensation}
          formatting={formatting}
          isFiltered={isFiltered}
        />
      )}

      {/* Sección de gráficos */}
      {costsToShow.length > 0 && (
        <CostosCharts costs={costsToShow} formatting={formatting} />
      )}      {/* Popup para añadir un nuevo costo */}
      {showAddCostPopup && currentProyect && (
        <AddCostPopup
          currentProyect={currentProyect}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setShowAddCostPopup={setShowAddCostPopup}
          rubros={rubros}
          inversores={inversores}
          onCompensationAdded={handleDataRefresh}
        />      )}

      {/* Popup para editar compensación */}
      {showEditCompensationPopup && currentProyect && selectedCompensation && (
        <EditCompensationPopup
          currentProyect={currentProyect}
          compensation={selectedCompensation}
          setShowEditCompensationPopup={setShowEditCompensationPopup}
          inversores={inversores}
          onUpdate={handleDataRefresh}
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
