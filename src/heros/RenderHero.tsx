import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'

type HeroType = 'highImpact' | 'lowImpact' | 'mediumImpact'

const heroes: Record<HeroType, React.FC<any>> = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
}

export const RenderHero: React.FC<{ hero?: any }> = (props) => {
  // 1. Safely extract the hero object that Next.js passed down
  const heroData = props?.hero || props || {}
  const { type } = heroData as { type?: string }

  // 2. You can leave this log here to verify it says 'mediumImpact' now!
  console.log('===== RENDER HERO DEBUG =====')
  console.log('Hero Type is now:', type)
  console.log('=============================')

  // 3. Render logic
  if (!type || type === 'none') return null

  if (!(type in heroes)) return null

  const HeroToRender = heroes[type as HeroType]

  return <HeroToRender {...heroData} />
}
