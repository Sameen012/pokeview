import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SearchBar from './components/SearchBar'
import PokemonCard from './components/PokemonCard'
import StatRadar from './components/StatRadar'
import Toggle from './components/Toggle'
import { useLocalStorage } from './hooks/useLocalStorage'

type PokemonResult = { name: string; url: string }
type PokemonListResponse = { results: PokemonResult[]; next: string | null; previous: string | null }

type PokemonDetails = {
  id: number
  name: string
  sprites: any
  types: { slot: number; type: { name: string } }[]
  abilities: { ability: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  height: number
  weight: number
}

const API = 'https://pokeapi.co/api/v2/pokemon'

export default function App() {
  const [query, setQuery] = useState('')
  const [list, setList] = useState<PokemonResult[]>([])
  const [pageUrl, setPageUrl] = useState<string>(`${API}?limit=24&offset=0`)
  const [next, setNext] = useState<string | null>(null)
  const [prev, setPrev] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selected, setSelected] = useState<PokemonDetails | null>(null)
  const [dark, setDark] = useLocalStorage<boolean>('pokeview:dark', false)
  const [favs, setFavs] = useLocalStorage<string[]>('pokeview:favs', [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.body.className = dark ? 'bg-slate-900 text-slate-50' : 'bg-background text-foreground'
  }, [dark])

  async function fetchList(url: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Failed to load list (${res.status})`)
      const data: PokemonListResponse = await res.json()
      setList(data.results)
      setNext(data.next)
      setPrev(data.previous)
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList(pageUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageUrl])

  async function openDetails(name: string) {
    setError(null)
    try {
      const res = await fetch(`${API}/${name.toLowerCase()}`)
      if (!res.ok) throw new Error(`Pokémon not found`)
      const data: PokemonDetails = await res.json()
      setSelected(data)
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    }
  }

  function submitSearch() {
    if (!query.trim()) return
    openDetails(query.trim())
  }

  function toggleFav(name: string) {
    setFavs((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]))
  }

  const statData = useMemo(() => {
    if (!selected) return []
    return selected.stats.map((s) => ({
      name: s.stat.name.replace('-', ' '),
      value: s.base_stat,
    }))
  }, [selected])

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img alt="Pokéball" src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" className="w-8 h-8" />
            <h1 className="text-xl font-bold">PokéView</h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <SearchBar value={query} onChange={setQuery} onSubmit={submitSearch} />
            <Toggle checked={dark} onChange={setDark} labels={['☀️', '🌙']} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <section className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              disabled={!prev}
              onClick={() => prev && setPageUrl(prev)}
              className="px-4 py-2 rounded-xl bg-card dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-soft disabled:opacity-50"
            >
              ← Prev
            </button>
            <button
              disabled={!next}
              onClick={() => next && setPageUrl(next)}
              className="px-4 py-2 rounded-xl bg-card dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-soft disabled:opacity-50"
            >
              Next →
            </button>
            <span className="text-sm opacity-70">Tip: Click a card for details. ⭐ to favorite.</span>
          </div>
        </section>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-800 ring-1 ring-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-card dark:bg-slate-800 rounded-2xl h-44 animate-pulse ring-1 ring-slate-100 dark:ring-slate-700" />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {list.map((p) => (
              <div key={p.name} className="relative">
                <PokemonCard pokemon={p} onOpen={openDetails} />
                <button
                  onClick={() => toggleFav(p.name)}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/80 backdrop-blur grid place-items-center shadow-soft"
                  aria-label={favs.includes(p.name) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <span className={favs.includes(p.name) ? '' : 'opacity-40'}>⭐</span>
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {favs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-3">Favorites</h2>
            <div className="flex flex-wrap gap-2">
              {favs.map((n) => (
                <button
                  key={n}
                  onClick={() => openDetails(n)}
                  className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-900 ring-1 ring-yellow-200 text-sm"
                >
                  {n}
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="max-w-3xl mx-auto my-10 p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-soft"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-6 flex-col md:flex-row">
                <div className="md:w-1/3 grid place-items-center">
                  <img
                    alt={selected.name}
                    src={selected.sprites.other['official-artwork'].front_default || selected.sprites.front_default}
                    className="w-56 h-56 object-contain"
                  />
                </div>
                <div className="md:flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold capitalize">{selected.name}</h3>
                    <button
                      onClick={() => toggleFav(selected.name)}
                      className="ml-auto px-3 py-1 rounded-full bg-yellow-100 text-yellow-900 ring-1 ring-yellow-200 text-sm"
                    >
                      {favs.includes(selected.name) ? '★ Favorited' : '☆ Add Favorite'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selected.types.map((t) => (
                      <span key={t.slot} className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs capitalize">
                        {t.type.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm opacity-80">
                    Height: {selected.height / 10} m • Weight: {selected.weight / 10} kg
                  </p>
                  <div>
                    <h4 className="font-semibold mb-1">Abilities</h4>
                    <ul className="list-disc list-inside text-sm">
                      {selected.abilities.map((a, i) => (
                        <li key={i} className="capitalize">{a.ability.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Base Stats</h4>
                <StatRadar
                  stats={statData}
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="max-w-6xl mx-auto px-4 py-10 text-sm opacity-70">
        Data from <a className="underline" href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a> • Built with React, Tailwind, Framer Motion & Recharts.
      </footer>
    </div>
  )
}
