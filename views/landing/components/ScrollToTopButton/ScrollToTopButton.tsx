import { ArrowUp } from 'lucide-react'

interface ScrollToTopButtonProps {
    show: boolean
}

export default function ScrollToTopButton({ show }: ScrollToTopButtonProps) {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!show) return null

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-[#FF0099] via-[#FF0000] to-[#FF6600] text-white p-3 rounded-full shadow-lg hover:opacity-90 transition-all"
        >
            <ArrowUp className="h-6 w-6" />
        </button>
    )
}