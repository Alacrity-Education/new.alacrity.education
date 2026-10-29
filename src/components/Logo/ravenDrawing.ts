import { RAVEN_FACETS } from './RavenMark'

/**
 * The raven as a network of strokes to draw outward from one corner, breadth
 * first: every stroke gets the step at which the drawing reaches it, and is
 * oriented to start at the end the drawing arrives from.
 *
 * Derived from RAVEN_FACETS when the module loads rather than stored, so the
 * logo stays the one source. The facets are closed outlines that share
 * edges, so they are first broken into single strokes, joined where they
 * meet, and de-duplicated where two facets trace the same edge.
 */

type Pt = [number, number]
type Seg = { a: Pt; b: Pt; c?: [Pt, Pt] }

/**
 * Corners closer than this count as one. The drawing was made by hand, and at
 * its 4-unit stroke two points 2 units apart already touch on screen.
 */
const SNAP = 2

const dist = (p: Pt, q: Pt) => Math.hypot(p[0] - q[0], p[1] - q[1])
const fmt = (p: Pt) => `${+p[0].toFixed(2)} ${+p[1].toFixed(2)}`

/** Absolute M/L/H/V/C/Z only — all the logo uses. */
const parse = (d: string): Seg[] => {
  const toks = d.match(/[MLHVCZ]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? []
  const segs: Seg[] = []
  let i = 0
  let cmd = ''
  let cur: Pt = [0, 0]
  let start: Pt = [0, 0]
  const n = () => parseFloat(toks[i++]!)

  while (i < toks.length) {
    if (/^[A-Z]$/.test(toks[i]!)) cmd = toks[i++]!
    if (cmd === 'M') {
      cur = start = [n(), n()]
      cmd = 'L'
    } else if (cmd === 'L' || cmd === 'H' || cmd === 'V') {
      const p: Pt = cmd === 'L' ? [n(), n()] : cmd === 'H' ? [n(), cur[1]] : [cur[0], n()]
      segs.push({ a: cur, b: p })
      cur = p
    } else if (cmd === 'C') {
      const c1: Pt = [n(), n()]
      const c2: Pt = [n(), n()]
      const p: Pt = [n(), n()]
      segs.push({ a: cur, b: p, c: [c1, c2] })
      cur = p
    } else if (cmd === 'Z') {
      if (dist(cur, start) > 0.01) segs.push({ a: cur, b: start })
      cur = start
      cmd = ''
    } else {
      i++ // stray token: skip rather than loop on it
    }
  }
  return segs
}

const build = () => {
  const segs = RAVEN_FACETS.flatMap(parse)

  const corners: Pt[] = []
  const cornerOf = (p: Pt) => {
    const k = corners.findIndex((c) => dist(c, p) <= SNAP)
    if (k >= 0) return k
    corners.push(p)
    return corners.length - 1
  }
  segs.forEach((s) => {
    cornerOf(s.a)
    cornerOf(s.b)
  })

  // A corner of one facet often lands part-way along another facet's edge.
  // Unless that edge is split there, the drawing cannot pass from one to the
  // other at that point.
  const pieces: { u: number; v: number; seg: Seg }[] = []
  for (const s of segs) {
    const u = cornerOf(s.a)
    const v = cornerOf(s.b)
    if (s.c) {
      pieces.push({ u, v, seg: s })
      continue
    }
    const [ax, ay] = s.a
    const [bx, by] = s.b
    const len2 = (bx - ax) ** 2 + (by - ay) ** 2
    const cuts = corners
      .map((p, k) => {
        if (k === u || k === v || len2 === 0) return null
        const t = ((p[0] - ax) * (bx - ax) + (p[1] - ay) * (by - ay)) / len2
        if (t <= 0.02 || t >= 0.98) return null
        return dist(p, [ax + t * (bx - ax), ay + t * (by - ay)]) <= SNAP ? { t, k } : null
      })
      .filter((x): x is { t: number; k: number } => x !== null)
      .sort((x, y) => x.t - y.t)
    let from = u
    let fromPt = s.a
    for (const { k } of cuts) {
      pieces.push({ u: from, v: k, seg: { a: fromPt, b: corners[k]! } })
      from = k
      fromPt = corners[k]!
    }
    pieces.push({ u: from, v, seg: { a: fromPt, b: s.b } })
  }

  // Two facets sharing an edge would draw it twice, one over the other.
  const seen = new Set<string>()
  const edges = pieces.filter(({ u, v, seg }, i) => {
    if (u === v) return false
    const key = seg.c ? `c${i}` : `${Math.min(u, v)}-${Math.max(u, v)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const adj = corners.map(() => [] as number[])
  edges.forEach(({ u, v }) => {
    adj[u]!.push(v)
    adj[v]!.push(u)
  })

  // Breadth first from the leftmost corner — the tip at the top left. Any part
  // the walk cannot reach carries on from wherever the drawing has got to
  // nearest it, one step later.
  const depth = corners.map(() => -1)
  const walk = (from: number, d: number) => {
    depth[from] = d
    const queue = [from]
    while (queue.length) {
      const k = queue.shift()!
      for (const m of adj[k]!) {
        if (depth[m] === -1) {
          depth[m] = depth[k]! + 1
          queue.push(m)
        }
      }
    }
  }
  walk(
    corners.reduce((best, p, k) => (p[0] < corners[best]![0] ? k : best), 0),
    0,
  )
  for (;;) {
    let next: { k: number; d: number; gap: number } | null = null
    corners.forEach((p, k) => {
      if (depth[k] !== -1) return
      corners.forEach((q, j) => {
        if (depth[j] === -1) return
        const gap = dist(p, q)
        if (!next || gap < next.gap) next = { k, d: depth[j]! + 1, gap }
      })
    })
    if (!next) break
    walk((next as { k: number }).k, (next as { d: number }).d)
  }

  const strokes = edges.map(({ u, v, seg }) => {
    // Drawn from whichever end the walk reached first.
    const forward = depth[u]! <= depth[v]!
    const [a, b] = forward ? [seg.a, seg.b] : [seg.b, seg.a]
    const c = seg.c && (forward ? seg.c : ([seg.c[1], seg.c[0]] as [Pt, Pt]))
    return {
      d: c ? `M${fmt(a)}C${fmt(c[0])} ${fmt(c[1])} ${fmt(b)}` : `M${fmt(a)}L${fmt(b)}`,
      depth: Math.min(depth[u]!, depth[v]!),
    }
  })

  return { strokes, steps: Math.max(...strokes.map((s) => s.depth)) + 1 }
}

const raven = build()

/** Every stroke of the raven, with the step at which the drawing reaches it. */
export const RAVEN_STROKES: { d: string; depth: number }[] = raven.strokes

/** How many steps the drawing takes, first stroke to last. */
export const RAVEN_STEPS: number = raven.steps
