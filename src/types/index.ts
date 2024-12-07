import { ReactNode } from 'react'

export interface Feature {
  name: string
  description: string
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  screen: (props: {
    animated?: boolean
    custom?: CustomAnimationProps
  }) => JSX.Element
}

export interface CustomAnimationProps {
  isForwards: boolean
  changeCount: number
}
