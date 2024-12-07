import { SVGProps } from 'react'

export interface ChartProps extends SVGProps<SVGSVGElement> {
  className?: string
  activePointIndex: number | null
  onChangeActivePointIndex: (index: number | null) => void
  width: number
  height: number
  paddingX?: number
  paddingY?: number
  gridLines?: number
}

export interface Point {
  x: number
  y: number
}
