import Image from 'next/image';
import Link from 'next/link';

interface PostCardProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  slug: string;
  date?: string;
}

export default function PostCard({ title, excerpt, imageUrl, slug, date }: PostCardProps) {
  // Formatear fecha si existe
  const formattedDate = date ? new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/blog/${slug}`}>
        <div className="relative h-48 w-full">
          <Image 
            src={imageUrl} 
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          {formattedDate && (
            <p className="text-gray-500 text-sm mb-2">{formattedDate}</p>
          )}
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <div 
            className="text-gray-600 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
          <div className="mt-4">
            <span className="text-blue-600 font-medium">Leer más →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
