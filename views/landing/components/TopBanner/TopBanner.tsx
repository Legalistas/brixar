export default function TopBanner() {
    return (
        <div className="bg-[#003087] text-white p-2 text-center">
            <div className="container mx-auto flex items-center justify-between">
                <span className="text-sm">Termina em:</span>
                <div className="flex gap-2">
                    <div className="bg-[#001c4d] p-1 rounded">2</div>
                    <div className="bg-[#001c4d] p-1 rounded">4</div>
                    <div className="bg-[#001c4d] p-1 rounded">12</div>
                    <div className="bg-[#001c4d] p-1 rounded">8</div>
                </div>
                <span className="text-sm">14→17/NOV</span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">ATÉ 50% OFF</span>
            </div>
        </div>
    )
}