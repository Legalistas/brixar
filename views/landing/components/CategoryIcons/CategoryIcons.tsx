export default function CategoryIcons() {
    return (
        <div className="flex justify-between items-center mt-12 overflow-x-auto py-4">
            {['Phone', 'Shopping', 'Wine', 'Game', 'Sport', 'Pet'].map((category, i) => (
                <button
                    key={i}
                    className="flex-shrink-0 w-16 h-16 rounded-full bg-[#DD1031] text-white flex items-center justify-center"
                >
                    <div className="text-center text-xs">{category}</div>
                </button>
            ))}
        </div>
    )
}