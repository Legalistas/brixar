import { Variants, TargetAndTransition } from 'framer-motion'

const maxZIndex = 2147483647

interface CustomProps {
  isForwards: boolean
  changeCount: number
}

export const useBodyAnimation = () => {
  const bodyVariantBackwards: TargetAndTransition = {
    opacity: 0.4,
    scale: 0.8,
    zIndex: 0,
    filter: 'blur(4px)',
    transition: { duration: 0.4 },
  }

  const bodyVariantForwards = (custom: CustomProps): TargetAndTransition => ({
    y: '100%',
    zIndex: maxZIndex - custom.changeCount,
    transition: { duration: 0.4 },
  })

  return {
    variants: {
      initial: (custom: CustomProps) =>
        custom.isForwards ? bodyVariantForwards(custom) : bodyVariantBackwards,
      animate: (custom: CustomProps): TargetAndTransition => ({
        y: '0%',
        opacity: 1,
        scale: 1,
        zIndex: maxZIndex / 2 - custom.changeCount,
        filter: 'blur(0px)',
        transition: { duration: 0.4 },
      }),
      exit: (custom: CustomProps) =>
        custom.isForwards ? bodyVariantBackwards : bodyVariantForwards(custom),
    },
  }
}

export const useHeaderAnimation = (): Variants => ({
  initial: { opacity: 0, transition: { duration: 0.3 } },
  animate: { opacity: 1, transition: { duration: 0.3, delay: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
})
