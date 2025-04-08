import { getPosts } from '@/utils/wp'

export default async function Home() {
  const posts = await getPosts()

  // Si no hay posts, mostrar un mensaje o un estado de carga
  if (!posts?.length) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Actualidad Legalistas</h1>
        <p>Cargando artículos...</p>
      </main>
    )
  }

  // Ordenar posts por fecha, el más reciente primero
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const mainArticle = sortedPosts[0]
  const recentArticles = sortedPosts.slice(1)

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-50 py-4 max-w-7xl">
        <h1 className="text-4xl font-bold mb-8">Actualidad Legalistas</h1>

        {/*<div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MainArticle {...mainArticle} />
          </div>
          <div className="lg:col-span-1">
            <ContactForm />
          </div>
        </div>

        <RecentArticles articles={recentArticles} />*/}
      </section>
    </main>
  )
}
