import { motion } from 'framer-motion'

type PokemonBasic = {
  name: string
  url: string
}

type Props = {
  pokemon: PokemonBasic
  onOpen: (name: string) => void
}

export default function PokemonCard({ pokemon, onOpen }: Props) {
  const id = pokemon.url.split('/').filter(Boolean).pop()
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

  return (
    <motion.button
      layout
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen(pokemon.name)}
      className="group bg-card rounded-2xl shadow-soft ring-1 ring-slate-100 p-4 grid place-items-center gap-3"
    >
      <div className="w-32 h-32 grid place-items-center">
        <img
          alt={pokemon.name}
          loading="lazy"
          src={img}
          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="text-center">
        <p className="capitalize font-semibold">{pokemon.name}</p>
        <p className="text-xs text-slate-500">#{id}</p>
      </div>
    </motion.button>
  )
}
