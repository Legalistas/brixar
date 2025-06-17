'use client'
import { useEffect, useState } from "react";

import { HeroSectionCalculadora } from "@/components/HeroSectionCalculadora";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UVAData {
    fecha: string
    valor: number
}

interface LoanCalculation {
    monthlyPaymentUVA: number
    monthlyPaymentPesos: number
    totalPayments: number
    totalAmountUVA: number
    totalAmountPesos: number
    interestRate: number
    requiredIncome: number
}

interface PaymentSchedule {
    month: number
    capitalUVA: number
    interestUVA: number
    totalUVA: number
    totalPesos: number
    remainingBalanceUVA: number
}

export default function Page() {
    const [uvaValue, setUvaValue] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [propertyValue, setPropertyValue] = useState("")
    const [loanAmount, setLoanAmount] = useState("")
    const [loanTerm, setLoanTerm] = useState("")
    const [purpose, setPurpose] = useState("")
    const [bnaSalary, setBnaSalary] = useState("")
    const [calculation, setCalculation] = useState<LoanCalculation | null>(null)
    const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule[]>([])
    const [showSchedule, setShowSchedule] = useState(false)

    // Fetch current UVA value
    useEffect(() => {
        const fetchUVAValue = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_UVA}`);
                const data: UVAData[] = await response.json();

                if (data && data.length > 0) {
                    const today = new Date();
                    const dd = String(today.getDate()).padStart(2, "0");
                    const mm = String(today.getMonth() + 1).padStart(2, "0");
                    const yyyy = today.getFullYear();
                    const todayFormatted = `${dd}-${mm}-${yyyy}`;

                    console.log("Hoy formateado:", todayFormatted);

                    const todayValue = data.find(entry => entry.fecha === todayFormatted);

                    if (todayValue) {
                        setUvaValue(todayValue.valor);
                    } else {
                        const latestUVA = data[data.length - 1];
                        setUvaValue(latestUVA.valor);
                    }
                }
            } catch (error) {
                console.error("Error fetching UVA value:", error);
                setUvaValue(1530.69);
            } finally {
                setLoading(false);
            }
        };

        fetchUVAValue();
    }, []);



    const [uvaData, setUvaData] = useState<UVAData[]>([])
    const [loanCalculation, setLoanCalculation] = useState<LoanCalculation>()

    const calculateLoan = () => {
        if (!propertyValue || !loanAmount || !loanTerm || !purpose || !bnaSalary || !uvaValue) {
            return
        }

        const propertyValueNum = Number.parseFloat(propertyValue.replace(/[.,]/g, ""))
        const loanAmountNum = Number.parseFloat(loanAmount.replace(/[.,]/g, ""))
        const termYears = Number.parseInt(loanTerm)
        const termMonths = termYears * 12

        // Determine interest rate based on purpose and BNA salary
        let annualRate = 8.0 // Default rate
        if (purpose === "primera_vivienda" && bnaSalary === "si") {
            annualRate = 4.5 // Preferential rate
        }



        const monthlyRate = annualRate / 100 / 12
        const loanAmountUVA = loanAmountNum / uvaValue

        // Calculate monthly payment in UVA using standard loan formula
        const monthlyPaymentUVA =
            (loanAmountUVA * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
            (Math.pow(1 + monthlyRate, termMonths) - 1)

        const monthlyPaymentPesos = monthlyPaymentUVA * uvaValue
        const totalAmountUVA = monthlyPaymentUVA * termMonths
        const totalAmountPesos = totalAmountUVA * uvaValue
        const requiredIncome = monthlyPaymentPesos * 4 // 4x income requirement

        const calc: LoanCalculation = {
            monthlyPaymentUVA,
            monthlyPaymentPesos,
            totalPayments: termMonths,
            totalAmountUVA,
            totalAmountPesos,
            interestRate: annualRate,
            requiredIncome,
        }

        setCalculation(calc)
        generatePaymentSchedule(loanAmountUVA, monthlyRate, termMonths, monthlyPaymentUVA)
    }

    const generatePaymentSchedule = (
        principal: number,
        monthlyRate: number,
        termMonths: number,
        monthlyPayment: number,
    ) => {
        const schedule: PaymentSchedule[] = []
        let remainingBalance = principal

        for (let month = 1; month <= Math.min(termMonths, 12); month++) {
            // Show first 12 months
            const interestPayment = remainingBalance * monthlyRate
            const capitalPayment = monthlyPayment - interestPayment
            remainingBalance -= capitalPayment

            schedule.push({
                month,
                capitalUVA: capitalPayment,
                interestUVA: interestPayment,
                totalUVA: monthlyPayment,
                totalPesos: monthlyPayment * uvaValue,
                remainingBalanceUVA: remainingBalance,
            })
        }

        setPaymentSchedule(schedule)
    }

    const formatNumber = (num: number, decimals = 2) => {
        return new Intl.NumberFormat("es-AR", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num)
    }

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Calculator className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-lg text-gray-600">Cargando valor UVA actual...</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <HeroSectionCalculadora />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Calculadora de Créditos UVA</h1>
                        <p className="text-lg text-gray-600">Banco de la Nación Argentina</p>
                        <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <span className="font-semibold">Valor UVA actual: {formatNumber(uvaValue)}</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Input Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="h-5 w-5" />
                                    Datos del Préstamo
                                </CardTitle>
                                <CardDescription>Completá los datos para calcular tu crédito UVA</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="propertyValue">Valor de la Propiedad</Label>
                                    <Input
                                        id="propertyValue"
                                        placeholder="Ej: 50000000"
                                        value={propertyValue}
                                        onChange={(e) => setPropertyValue(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="loanAmount">Monto del Préstamo</Label>
                                    <Input
                                        id="loanAmount"
                                        placeholder="Ej: 40000000"
                                        value={loanAmount}
                                        onChange={(e) => setLoanAmount(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="loanTerm">Plazo (años)</Label>
                                    <Select value={loanTerm} onValueChange={setLoanTerm}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar plazo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[5, 10, 15, 20, 25, 30].map((years) => (
                                                <SelectItem key={years} value={years.toString()}>
                                                    {years} años
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="purpose">Destino</Label>
                                    <Select value={purpose} onValueChange={setPurpose}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar destino" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="primera_vivienda">Primera Vivienda</SelectItem>
                                            <SelectItem value="segunda_vivienda">Segunda Vivienda</SelectItem>
                                            <SelectItem value="construccion">Construcción</SelectItem>
                                            <SelectItem value="ampliacion">Ampliación</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bnaSalary">¿Cobrás tu sueldo en BNA?</Label>
                                    <Select value={bnaSalary} onValueChange={setBnaSalary}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar opción" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="si">Sí</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button onClick={calculateLoan} className="w-full" size="lg">
                                    <Calculator className="h-4 w-4 mr-2" />
                                    Calcular Préstamo
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Results */}
                        {calculation && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Resultado del Cálculo
                                    </CardTitle>
                                    <CardDescription>Detalles de tu crédito UVA</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <p className="text-sm text-gray-600">Cuota Mensual</p>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {formatCurrency(calculation.monthlyPaymentPesos)}
                                                </p>
                                                <p className="text-sm text-gray-500">{formatNumber(calculation.monthlyPaymentUVA)} UVAs</p>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <p className="text-sm text-gray-600">Tasa Anual</p>
                                                <p className="text-2xl font-bold text-green-600">{calculation.interestRate}%</p>
                                                <Badge variant={calculation.interestRate === 4.5 ? "default" : "secondary"}>
                                                    {calculation.interestRate === 4.5 ? "Tasa Preferencial" : "Tasa Estándar"}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total a Pagar:</span>
                                                <span className="font-semibold">{formatCurrency(calculation.totalAmountPesos)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Cantidad de Cuotas:</span>
                                                <span className="font-semibold">{calculation.totalPayments}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Ingresos Requeridos:</span>
                                                <span className="font-semibold">{formatCurrency(calculation.requiredIncome)}</span>
                                            </div>
                                        </div>

                                        <Button onClick={() => setShowSchedule(!showSchedule)} variant="outline" className="w-full">
                                            {showSchedule ? "Ocultar" : "Ver"} Cronograma de Pagos
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Payment Schedule */}
                    {showSchedule && paymentSchedule.length > 0 && (
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle>Cronograma de Pagos (Primeros 12 meses)</CardTitle>
                                <CardDescription>Detalle de capital e intereses por cuota</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Cuota</TableHead>
                                                <TableHead>Capital (UVA)</TableHead>
                                                <TableHead>Interés (UVA)</TableHead>
                                                <TableHead>Total (UVA)</TableHead>
                                                <TableHead>Total (Pesos)</TableHead>
                                                <TableHead>Saldo (UVA)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paymentSchedule.map((payment) => (
                                                <TableRow key={payment.month}>
                                                    <TableCell className="font-medium">{payment.month}</TableCell>
                                                    <TableCell>{formatNumber(payment.capitalUVA)}</TableCell>
                                                    <TableCell>{formatNumber(payment.interestUVA)}</TableCell>
                                                    <TableCell>{formatNumber(payment.totalUVA)}</TableCell>
                                                    <TableCell>{formatCurrency(payment.totalPesos)}</TableCell>
                                                    <TableCell>{formatNumber(payment.remainingBalanceUVA)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Information */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Información Importante</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Créditos UVA</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Las cuotas se ajustan mensualmente según el valor UVA</li>
                                        <li>• Tasa fija en UVAs durante toda la vida del préstamo</li>
                                        <li>• Ideal para financiación a largo plazo</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Requisitos</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Ingresos demostrables 4 veces la cuota</li>
                                        <li>• Tasa preferencial para clientes BNA</li>
                                        <li>• Seguro de vida e incendio obligatorio</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}