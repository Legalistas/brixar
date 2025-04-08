import { getPosts, getCategories, getPostBySlug, getAuthor } from '@/utils/wp';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import Image from 'next/image';

// Definiendo interfaces para tipar correctamente los datos
interface Category {
  id: number;
  name: string;
  slug: string;
}

export default async function TestPage() {
  const posts = await getPosts();
  const categories = await getCategories() as Category[];
  
  // Obtener el primer post para mostrar detalles
  let featuredPost = null;
  let author = null;
  
  if (posts && posts.length > 0) {
    featuredPost = await getPostBySlug(posts[0].slug);
    
    if (featuredPost && featuredPost.author) {
      author = await getAuthor(featuredPost.author);
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Página de prueba del Blog</h1>
      <p className="mb-8 text-gray-600">Esta es una página de prueba que muestra la información del blog.</p>
      
      {/* Sección de categorías */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Categorías</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category: Category) => (
            <span 
              key={category.id} 
              className="bg-gray-200 px-3 py-1 rounded-full text-sm"
            >
              {category.name}
            </span>
          ))}
        </div>
      </div>
      
      {/* Post destacado */}
      {featuredPost && (
        <div className="mb-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Post destacado</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image 
                  src={featuredPost.imageUrl} 
                  alt={featuredPost.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-xl font-bold mb-2">{featuredPost.title}</h3>
              <div 
                className="text-gray-600 mb-3"
                dangerouslySetInnerHTML={{ __html: featuredPost.excerpt }}
              />
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>
                  {new Date(featuredPost.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                {author && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Por: {author.name}</span>
                  </>
                )}
              </div>
              <div 
                className="prose max-w-none mb-4"
                dangerouslySetInnerHTML={{ __html: featuredPost.content?.substring(0, 300) + '...' }}
              />
              <Link href={`/blog/${featuredPost.slug}`} className="text-blue-600 font-medium hover:underline">
                Leer más →
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Lista de posts recientes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Posts recientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 6).map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              imageUrl={post.imageUrl}
              slug={post.slug}
              date={post.date}
            />
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No hay posts disponibles.</p>
          </div>
        )}
      </div>
      
      {/* Información de depuración */}
      <div className="mt-10 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Información de debugging</h3>
        <div className="text-sm font-mono whitespace-pre-wrap break-words">
          <p className="mb-1">Total de posts: {posts.length}</p>
          <p className="mb-1">Total de categorías: {categories.length}</p>
          <p className="mb-1">API Base URL: {process.env.NEXT_PUBLIC_API_BASE_URL_WP || 'No configurado'}</p>
        </div>
      </div>
    </div>
  );
}
