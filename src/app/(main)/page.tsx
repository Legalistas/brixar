import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Hero } from '@/components/Hero'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { Reviews } from '@/components/Reviews'
import CardContainer from '@/components/Property/PropertyContainer'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'
import { TikTokFeed } from '@/components/TikTokFeed'

export default function Home() {
  // Videos de TikTok a mostrar
  const tiktokVideos = [
    { url: 'https://www.tiktok.com/@brixar.propiedades/video/7488112353528024326' },
    { url: 'https://www.tiktok.com/@brixar.propiedades/video/7488373471215471927' },
    { url: 'https://www.tiktok.com/@brixar.propiedades/video/7486511406398016774' },
  ];

  const channelUrl = 'https://www.tiktok.com/@brixar.propiedades';

  return (
    <>
      <Hero />
      <CardContainer />
      <PrimaryFeatures />
      <SecondaryFeatures />
      <TikTokFeed videos={tiktokVideos} channelUrl={channelUrl} />
      <CallToAction />
      <Reviews />
      <Faqs />
    </>
  )
}
