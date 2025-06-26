import { cache } from 'react'

// Función para obtener la imagen de un post
async function getPostImage(mediaId: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/media/${mediaId}`,
      {
        headers: {
          Accept: 'application/json',
        },
        next: {
          revalidate: 3600,
        },
      },
    )

    if (!res.ok) {
      throw new Error(`Error fetching media: ${res.status} ${res.statusText}`)
    }

    const media = await res.json()

    // Verificar si existe source_url y usarlo preferentemente
    if (media.source_url) {
      return media.source_url
    } else if (media.guid && media.guid.rendered) {
      return media.guid.rendered
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching media:', error)
    return null
  }
}

// Función principal para obtener los posts con sus imágenes
export const getPosts = cache(async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts?_embed`,
      {
        headers: {
          Accept: 'application/json',
        },
        next: {
          revalidate: 3600,
        },
      },
    )

    if (!res.ok) {
      throw new Error(`Error fetching posts: ${res.status} ${res.statusText}`)
    }

    const posts = await res.json()

    // Obtener las imágenes para cada post
    const postsWithImages = await Promise.all(
      posts.map(async (post: any) => {
        let imageUrl = '/placeholder.svg'

        // Intentar obtener la imagen del _embedded
        if (
          post._embedded &&
          post._embedded['wp:featuredmedia'] &&
          post._embedded['wp:featuredmedia'][0]
        ) {
          const media = post._embedded['wp:featuredmedia'][0]
          if (media.source_url) {
            imageUrl = media.source_url
          } else if (media.guid && media.guid.rendered) {
            imageUrl = media.guid.rendered
          }
        }
        // Si no se encuentra en _embedded, intentar con featured_media
        else if (post.featured_media) {
          const mediaUrl = await getPostImage(post.featured_media)
          if (mediaUrl) {
            imageUrl = mediaUrl
          }
        }

        return {
          id: post.id,
          title: post.title.rendered,
          date: post.date,
          excerpt: post.excerpt.rendered,
          imageUrl: imageUrl,
          slug: post.slug,
        }
      }),
    )

    return postsWithImages
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
})

export const getPostBySlug = cache(async (slug: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      {
        headers: {
          Accept: 'application/json',
        },
        next: {
          revalidate: 3600, // Revalidar cada hora
        },
      },
    )

    if (!res.ok) {
      throw new Error(`Error fetching post: ${res.status} ${res.statusText}`)
    }

    const posts = await res.json()

    if (posts.length === 0) {
      return null
    }

    const post = posts[0]

    let imageUrl = '/placeholder.svg'
    if (
      post._embedded &&
      post._embedded['wp:featuredmedia'] &&
      post._embedded['wp:featuredmedia'][0]
    ) {
      const media = post._embedded['wp:featuredmedia'][0]
      imageUrl = media.source_url || media.guid.rendered
    }

    return {
      id: post.id,
      title: post.title.rendered,
      date: post.date,
      content: post.content.rendered,
      excerpt: post.excerpt.rendered,
      imageUrl: imageUrl,
      slug: post.slug,
      author: post.author, // Add author ID
      categories: post.categories, // Add categories array
      yoast_head_json: post.yoast_head_json,
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
})

export const getCategories = cache(async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/categories`,
      {
        headers: {
          Accept: 'application/json',
        },
        next: {
          revalidate: 3600, // Revalidar cada hora
        },
      },
    )

    if (!res.ok) {
      throw new Error(
        `Error fetching categories: ${res.status} ${res.statusText}`,
      )
    }

    const categories = await res.json()
    return categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
})

export const getRecentPosts = cache(async (limit = 5) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts?per_page=${limit}&_embed`,
      {
        headers: {
          Accept: 'application/json',
        },
        next: {
          revalidate: 3600, // Revalidar cada hora
        },
      },
    )

    if (!res.ok) {
      throw new Error(
        `Error fetching recent posts: ${res.status} ${res.statusText}`,
      )
    }

    const posts = await res.json()
    return posts.map((post: any) => ({
      id: post.id,
      title: post.title.rendered,
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error fetching recent posts:', error)
    return []
  }
})

export const getRelatedPosts = cache(async (postId: number, limit = 3) => {
  try {
    // Aquí deberías implementar la lógica para obtener posts relacionados.
    // Esto podría implicar obtener posts de la misma categoría o con tags similares.
    // Por ahora, simplemente obtendremos los posts más recientes excluyendo el post actual.
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts?per_page=${limit + 1}&exclude=${postId}&_embed`,
      {
        headers: {
          Accept: 'application/json',
        },
        next: {
          revalidate: 3600, // Revalidar cada hora
        },
      },
    )

    if (!res.ok) {
      throw new Error(
        `Error fetching related posts: ${res.status} ${res.statusText}`,
      )
    }

    const posts = await res.json()
    return posts.slice(0, limit).map((post: any) => ({
      id: post.id,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      slug: post.slug,
      imageUrl:
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        '/placeholder.svg',
    }))
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
})

export const getAuthor = cache(async (authorId: number) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/users/${authorId}`,
      {
        headers: {
          Accept: 'application/json',
        },
        next: {
          revalidate: 3600, // Revalidar cada hora
        },
      },
    )

    if (!res.ok) {
      throw new Error(`Error fetching author: ${res.status} ${res.statusText}`)
    }

    const author = await res.json()
    return {
      id: author.id,
      name: author.name,
      slug: author.slug,
    }
  } catch (error) {
    console.error('Error fetching author:', error)
    return null
  }
})
