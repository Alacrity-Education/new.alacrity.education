import dynamic from 'next/dynamic'

export const Map = dynamic(
  () => import('./MapClient').then((m) => ({ default: m.MapClient })),
  {
    ssr: true,
    loading: () => (
      <div className="w-full h-full min-h-[300px] animate-pulse rounded-lg bg-base-200" />
    ),
  },
)

export type { MapClientProps } from './MapClient'
