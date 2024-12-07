import React from 'react'
import Link, { LinkProps } from 'next/link'
import clsx from 'clsx'

type BaseStyles = {
    solid: string
    outline: string
}

const baseStyles: BaseStyles = {
    solid:
        'inline-flex justify-center rounded-lg py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors',
    outline:
        'inline-flex justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors',
}

type VariantStyles = {
    solid: {
        cyan: string
        white: string
        gray: string
    }
    outline: {
        gray: string
    }
}

const variantStyles: VariantStyles = {
    solid: {
        cyan: 'relative overflow-hidden bg-cyan-500 text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-cyan-600 active:text-white/80 before:transition-colors',
        white:
            'bg-white text-cyan-900 hover:bg-white/90 active:bg-white/90 active:text-cyan-900/70',
        gray: 'bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-800 active:text-white/80',
    },
    outline: {
        gray: 'border-gray-300 text-gray-700 hover:border-gray-400 active:bg-gray-100 active:text-gray-700/80',
    },
}

type ButtonVariant = keyof typeof baseStyles
type ButtonColor = keyof (typeof variantStyles)['solid'] | keyof (typeof variantStyles)['outline']

type CommonProps = {
    className?: string
    variant?: ButtonVariant
    color?: ButtonColor
    children?: React.ReactNode
}

type ButtonAsButton = CommonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & {
    href?: undefined
}

type ButtonAsLink = CommonProps & Omit<LinkProps, 'color'> & {
    href: string
}

type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button({ className, variant = 'solid', color = 'gray', children, ...props }: ButtonProps) {
    const variantStyle = variant === 'outline' ? variantStyles.outline : variantStyles.solid
    const colorStyle = variantStyle[color as keyof typeof variantStyle]

    className = clsx(
        baseStyles[variant],
        colorStyle,
        className
    )

    if ('href' in props && props.href !== undefined) {
        return <Link className={className} {...props}>{children}</Link>
    }

    return <button className={className} {...props}>{children}</button>
}

