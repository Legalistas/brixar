export default function PropertyDescription({ description }: { description: string | null }) {
    if (!description) return null

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
            <p className="text-gray-700">{description}</p>
        </div>
    )
}

