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
  X
} from 'lucide-react'
import { useProyectStore } from '@/store/proyectStore'
import { useCostStore } from '@/store/costStore'
import type { CreateProyectCostInput, ProyectCost } from '@/store/costStore'
import { AddCostPopup } from './AddCostPopup'

export default function CostosProyectoPage() {
  const searchParams = useSearchParams()
  const slug = searchParams?.get('slug')
  
  const { currentProyect, isLoading: isLoadingProyect, error: storeError, fetchProyectBySlug } = useProyectStore()
  const { 
    projectCosts, 
    metrics, 
    isLoading: isLoadingCosts, 
    error: costError,
    fetchCostsByProyectSlug,
    createCost
  } = useCostStore()
  
  const [error, setError] = useState('')
  const [showAddCostPopup, setShowAddCostPopup] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  // Estado para los filtros
  const [filters, setFilters] = useState({
    rubro: '',
    inversor: '',
    mes: '',
    año: ''
  })
  
  // Formulario para nuevo costo
  const [formData, setFormData] = useState<{
    fecha: string;
    rubro: string;
    rubroPersonalizado: string;
    proveedor: string;
    detalle: string;
    importePesos: string;
    precioDolarBlue: string;
    importeDolar: string;
    inversor: string;
    inversorPersonalizado: string;
  }>({
    fecha: new Date().toISOString().split('T')[0],
    rubro: '',
    rubroPersonalizado: '',
    proveedor: '',
    detalle: '',
    importePesos: '',
    precioDolarBlue: '',
    importeDolar: '',
    inversor: '',
    inversorPersonalizado: ''
  })

  // Lista de rubros predefinidos
  const rubros = ['Materiales', 'Mano Obra', 'Seguros', 'Planos / Escrituras', 'Otros']
  
  // Lista de inversores predefinidos
  const inversores = ['Oscar Andereggen', 'Agustín Andereggen', 'Otro']

  // Cargar el proyecto si se proporciona un slug
  useEffect(() => {    
    if (slug) {
      fetchProyectBySlug(slug)
      fetchCostsByProyectSlug(slug)
    }
  }, [slug, fetchProyectBySlug, fetchCostsByProyectSlug])

  // Actualizar el error local si hay error en el store
  useEffect(() => {
    console.log('Error en el store:', storeError, costError)
    
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

  // Extraer años y meses únicos de los costos para los filtros
  const { uniqueYears, uniqueMonths, uniqueRubros, uniqueInversores } = useMemo(() => {
    if (!projectCosts) {
      return { uniqueYears: [], uniqueMonths: [], uniqueRubros: [], uniqueInversores: [] }
    }
    
    const years = Array.from(new Set(projectCosts.map(cost => {
      const date = new Date(cost.fecha)
      return date.getFullYear().toString()
    }))).sort((a, b) => b.localeCompare(a)) // Ordenar años de forma descendente
    
    const months = Array.from(new Set(projectCosts.map(cost => {
      const date = new Date(cost.fecha)
      return date.getMonth().toString()
    })))
    
    const rubros = Array.from(new Set(projectCosts.map(cost => cost.rubro)))
    
    const inversores = Array.from(new Set(projectCosts
      .filter(cost => cost.inversor) // Filtrar registros con inversor definido
      .map(cost => cost.inversor as string)
    ))
    
    return { 
      uniqueYears: years, 
      uniqueMonths: months, 
      uniqueRubros: rubros,
      uniqueInversores: inversores
    }
  }, [projectCosts])
  
  // Aplicar filtros a la lista de costos
  const filteredCosts = useMemo(() => {
    if (!projectCosts) {
      return []
    }
    
    return projectCosts.filter(cost => {
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
        totalDolares: 0
      }
    }
    
    return {
      totalPesos: filteredCosts.reduce((sum, cost) => sum + Number(cost.importePesos), 0),
      totalDolares: filteredCosts.reduce((sum, cost) => sum + Number(cost.importeDolar), 0)
    }
  }, [filteredCosts])

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setFilters({
      rubro: '',
      inversor: '',
      mes: '',
      año: ''
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatCurrencyUSD = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }
  
  // Obtener nombre del mes en español
  const getMonthName = (monthNumber: string) => {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    return monthNames[parseInt(monthNumber)]
  }
  
  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Actualizar el estado en una sola operación para evitar múltiples renderizados
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      
      // Calcular automáticamente el importe en dólares cuando cambian los valores
      if (name === 'importePesos' || name === 'precioDolarBlue') {
        const pesos = parseFloat(name === 'importePesos' ? value : newData.importePesos) || 0
        const cotizacion = parseFloat(name === 'precioDolarBlue' ? value : newData.precioDolarBlue) || 0
        
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
    setFilters(prev => ({ ...prev, [name]: value }))
  }
  
  // Guardar el costo en la base de datos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentProyect) return
    
    try {
      setError('')
      const fechaObj = new Date(formData.fecha)
      const mes = `${fechaObj.getFullYear()}-${String(fechaObj.getMonth() + 1).padStart(2, '0')}`
      
      const costData: CreateProyectCostInput = {
        proyectId: currentProyect.id,
        fecha: formData.fecha,
        mes: mes,
        rubro: formData.rubro === 'Otros' ? formData.rubroPersonalizado : formData.rubro,
        proveedor: formData.proveedor,
        detalle: formData.detalle,
        importePesos: parseFloat(formData.importePesos),
        precioDolarBlue: parseFloat(formData.precioDolarBlue),
        importeDolar: parseFloat(formData.importeDolar),
        inversor: formData.inversor === 'Otro' ? formData.inversorPersonalizado : formData.inversor
      }
      
      const success = await createCost(costData)
      
      if (success) {
        setShowAddCostPopup(false)
        // Recargar los costos para actualizar la vista
        fetchCostsByProyectSlug(slug as string)
        
        // Limpiar el formulario
        setFormData({
          fecha: new Date().toISOString().split('T')[0],
          rubro: '',
          rubroPersonalizado: '',
          proveedor: '',
          detalle: '',
          importePesos: '',
          precioDolarBlue: '',
          importeDolar: '',
          inversor: '',
          inversorPersonalizado: ''
        })
      }
    } catch (err) {
      setError('Error al guardar el costo: ' + (err instanceof Error ? err.message : 'Error desconocido'))
    }
  }
  
  // Función para obtener la cotización actual del dólar blue
  const fetchDolarBlueRate = async () => {
    try {
      const response = await fetch('/api/currencies');
      const data = await response.json();
      
      // Buscar la moneda "USD" o "USDBLUE" en los resultados
      const usdCurrency = data.find(
        (currency: any) => 
          currency.code === 'USD' || 
          currency.name?.toLowerCase().includes('dolar') ||
          currency.code === 'USDBLUE'
      );
      
      if (usdCurrency && usdCurrency.rate) {
        // Actualizar el estado del formulario con la cotización actual
        setFormData(prev => {
          const newData = {
            ...prev,
            precioDolarBlue: usdCurrency.rate.toString()
          };
          
          // Recalcular el importe en dólares si ya hay un importe en pesos
          if (prev.importePesos) {
            const pesos = parseFloat(prev.importePesos);
            const cotizacion = parseFloat(usdCurrency.rate);
            if (pesos > 0 && cotizacion > 0) {
              newData.importeDolar = (pesos / cotizacion).toFixed(2);
            }
          }
          
          return newData;
        });
      }
    } catch (error) {
      console.error('Error al obtener la cotización del dólar blue:', error);
      // No mostramos error en UI para no interrumpir la experiencia
    }
  };

  // Componente para el panel de filtros
  const FilterPanel = () => {
    return (
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-slate-800">Filtros</h2>
          <button 
            onClick={clearFilters}
            className="text-sm text-slate-600 hover:text-slate-800 flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar filtros
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filtro por rubro */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Rubro
            </label>
            <select
              name="rubro"
              value={filters.rubro}
              onChange={handleFilterChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="">Todos los rubros</option>
              {uniqueRubros.map(rubro => (
                <option key={rubro} value={rubro}>{rubro}</option>
              ))}
            </select>
          </div>
          
          {/* Filtro por inversor */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Inversor
            </label>
            <select
              name="inversor"
              value={filters.inversor}
              onChange={handleFilterChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="">Todos los inversores</option>
              {uniqueInversores.map(inversor => (
                <option key={inversor} value={inversor}>{inversor}</option>
              ))}
            </select>
          </div>
          
          {/* Filtro por mes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mes
            </label>
            <select
              name="mes"
              value={filters.mes}
              onChange={handleFilterChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="">Todos los meses</option>
              {uniqueMonths.map(month => (
                <option key={month} value={month}>{getMonthName(month)}</option>
              ))}
            </select>
          </div>
          
          {/* Filtro por año */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Año
            </label>
            <select
              name="año"
              value={filters.año}
              onChange={handleFilterChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="">Todos los años</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-slate-600">
          Mostrando {filteredCosts.length} de {projectCosts?.length || 0} registros
        </div>
      </div>
    )
  }
  
  const isLoading = isLoadingProyect || isLoadingCosts

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
          <p className="mt-2 text-slate-500">Cargando información del proyecto...</p>
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
          Por favor, seleccione un proyecto para gestionar sus costos desde la página de proyectos.
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
            Añadir Costo
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
      {showFilters && <FilterPanel />}

      {/* Sección de resumen de costos */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium text-slate-800 mb-4">Resumen de Costos {Object.values(filters).some(v => v !== '') ? '(Filtrados)' : ''}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Total en ARS</h3>
            <p className="text-2xl font-bold text-slate-800">
              {Object.values(filters).some(v => v !== '')
                ? formatCurrency(filteredMetrics.totalPesos)
                : formatCurrency(metrics?.totalPesos || 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Total en USD</h3>
            <p className="text-2xl font-bold text-slate-800">
              {Object.values(filters).some(v => v !== '')
                ? formatCurrencyUSD(filteredMetrics.totalDolares)
                : formatCurrencyUSD(metrics?.totalDolares || 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Cantidad de registros</h3>
            <p className="text-2xl font-bold text-slate-800">
              {Object.values(filters).some(v => v !== '')
                ? filteredCosts.length
                : projectCosts?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de costos */}
      <div className="overflow-x-auto rounded-md border border-slate-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm">
              <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Fecha
                </div>
              </th>
              <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Rubro / Proveedor
                </div>
              </th>
              <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Detalle
                </div>
              </th>
              <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Importe ARS
                </div>
              </th>
              <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Cotización USD
                </div>
              </th>
              <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Importe USD
                </div>
              </th>
              <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Usuario
                </div>
              </th>
              <th className="py-3 px-4 border-b border-slate-200 text-center font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {Object.values(filters).some(v => v !== '')
              ? (filteredCosts.length > 0 ? (
                  filteredCosts.map((cost: ProyectCost) => (
                    <tr key={cost.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">{formatDate(cost.fecha)}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{cost.rubro}</div>
                        <div className="text-sm text-slate-500">{cost.proveedor}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs truncate">{cost.detalle || '-'}</div>
                      </td>
                      <td className="py-3 px-4">{formatCurrency(cost.importePesos)}</td>
                      <td className="py-3 px-4">{formatCurrency(cost.precioDolarBlue)}</td>
                      <td className="py-3 px-4">{formatCurrencyUSD(cost.importeDolar)}</td>
                      <td className="py-3 px-4">
                        {cost.usuario?.name || cost.usuario?.email || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan={8} className="py-8 text-slate-500">
                      No hay registros que coincidan con los filtros aplicados
                    </td>
                  </tr>
                )
              )
              : (
                projectCosts && projectCosts.length > 0 ? (
                  projectCosts.map((cost: ProyectCost) => (
                    <tr key={cost.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">{formatDate(cost.fecha)}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{cost.rubro}</div>
                        <div className="text-sm text-slate-500">{cost.proveedor}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs truncate">{cost.detalle || '-'}</div>
                      </td>
                      <td className="py-3 px-4">{formatCurrency(cost.importePesos)}</td>
                      <td className="py-3 px-4">{formatCurrency(cost.precioDolarBlue)}</td>
                      <td className="py-3 px-4">{formatCurrencyUSD(cost.importeDolar)}</td>
                      <td className="py-3 px-4">
                        {cost.usuario?.name || cost.usuario?.email || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan={8} className="py-8 text-slate-500">
                      No hay registros de costos para este proyecto
                    </td>
                  </tr>
                )
              )
            }
          </tbody>
        </table>
      </div>

      {/* Usar el componente AddCostPopup importado en lugar del componente interno */}
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
    </div>
  )
}