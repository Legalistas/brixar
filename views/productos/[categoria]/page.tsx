export default function CategoriaProductos({
  params,
}: {
  params: { categoria: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Productos en {params.categoria}
      </h1>
      {/* Agrega una lista o grid de productos de esta categoría */}
    </div>
  );
}
