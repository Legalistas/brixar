import { getPosts } from "@/utils/wp";
import PostCard from "@/components/PostCard";

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Nuestro Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
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
