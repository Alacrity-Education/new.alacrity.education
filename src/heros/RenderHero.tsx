import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'


type HeroType = 'highImpact' | 'slide';

const heroes: Record<HeroType, React.FC<any>> = {
  highImpact: HighImpactHero,
  slide: HighImpactHero,
}

export const RenderHero: React.FC<{ hero?: any }> = (props) => {
  // 1. Safely extract the hero object that Next.js passed down
  const heroData = props?.hero || props || {}
  const { type } = heroData as { type?: string }

  // 3. Render logic
  if (!type || type === 'none') return null

  if (!(type in heroes)) return null

  const HeroToRender = heroes[type as HeroType]

  return <HeroToRender {...heroData} />
}
