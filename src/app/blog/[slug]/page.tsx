import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getAuthor, getRelatedPosts } from "@/utils/wp";
import PostCard from "@/components/PostCard";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Post no encontrado</h1>
        <p className="mb-8">El post que estás buscando no existe o ha sido eliminado.</p>
        <Link href="/blog" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
          Volver al blog
        </Link>
      </div>
    );
  }

  // Obtener información del autor si existe
  const author = post.author ? await getAuthor(post.author) : null;
  
  // Obtener posts relacionados
  const relatedPosts = await getRelatedPosts(post.id);
  
  // Formatear la fecha
  const formattedDate = new Date(post.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Encabezado del post */}
      <div className="max-w-3xl mx-auto mb-10">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-6">
          {author && <span className="mr-4">Por: {author.name}</span>}
          <span>{formattedDate}</span>
        </div>
      </div>
      
      {/* Imagen destacada */}
      <div className="max-w-4xl mx-auto mb-10 relative h-80">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
      </div>
      
      {/* Contenido del post */}
      <div 
        className="max-w-3xl mx-auto prose lg:prose-xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      {/* Posts relacionados */}
      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Posts relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost: any) => (
              <PostCard
                key={relatedPost.id}
                title={relatedPost.title}
                excerpt={relatedPost.excerpt}
                imageUrl={relatedPost.imageUrl}
                slug={relatedPost.slug}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
