import { getPosts } from '@/utils/wp';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export default async function TestPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Página de prueba de Posts</h1>
      <p className="mb-8 text-gray-600">Esta es una página de prueba que muestra los posts del blog.</p>
      
      <Link href="/blog" className="inline-block mb-8 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
        Ver todos los posts
      </Link>
      
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
  );
}
