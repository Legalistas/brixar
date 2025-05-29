import React, { forwardRef, ReactNode } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import IconBrixarSingle from './IconBrixarSingle'

function Logo(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <Image
            src="/images/logos/isonaranja.png"
            alt="Logo"
            width={48}
            height={48}
            className='w-12 h-12'
        />
    )
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
    return null
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
    return null
}

interface AppScreenProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

export function AppScreen({ children, className, ...props }: AppScreenProps) {
    return (
        <div className={clsx('flex flex-col', className)} {...props}>
            <div className="flex justify-between px-2.5 pt-4">
                <MenuIcon className="h-6 w-6 flex-none" />
                <Image
                    src="/images/logos/BRIXAR_png-isologo-08.png"
                    alt="Logo"
                    width={48}
                    height={48}
                    className="w-12 h-12 flex-none"
                />
                <UserIcon className="h-6 w-6 flex-none" />
            </div>
            {children}
        </div>
    )
}

interface ForwardRefProps<T> {
    children: ReactNode
    className?: string
}

AppScreen.Header = forwardRef<HTMLDivElement, ForwardRefProps<HTMLDivElement>>(
    function AppScreenHeader({ children }, ref) {
        return (
            <div ref={ref} className="mt-6 px-4 text-white">
                {children}
            </div>
        )
    }
)

AppScreen.Title = forwardRef<HTMLDivElement, ForwardRefProps<HTMLDivElement>>(
    function AppScreenTitle({ children }, ref) {
        return (
            <div ref={ref} className="text-2xl text-white">
                {children}
            </div>
        )
    }
)

AppScreen.Subtitle = forwardRef<HTMLDivElement, ForwardRefProps<HTMLDivElement>>(
    function AppScreenSubtitle({ children }, ref) {
        return (
            <div ref={ref} className="text-sm text-gray-500">
                {children}
            </div>
        )
    }
)

AppScreen.Body = forwardRef<HTMLDivElement, ForwardRefProps<HTMLDivElement>>(
    function AppScreenBody({ children, className }, ref) {
        return (
            <div
                ref={ref}
                className={clsx('mt-6 flex-auto rounded-t-2xl bg-white', className)}
            >
                {children}
            </div>
        )
    }
)