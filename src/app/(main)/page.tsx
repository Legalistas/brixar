import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Hero } from '@/components/Hero'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { Reviews } from '@/components/Reviews'
import CardContainer from '@/components/Property/PropertyContainer'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'
import { TikTok } from '@/components/TikTok/TikTok'

export default function Home() {
  return (
    <>
      <Hero />
      <CardContainer />
      <PrimaryFeatures />
      <SecondaryFeatures />
      <TikTok />
      <CallToAction />
      <Reviews />
      <Faqs />
    </>
  )
}
