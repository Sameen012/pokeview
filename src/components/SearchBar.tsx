type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
}

export default function SearchBar({ value, onChange, onSubmit }: Props) {
  return (
    <div className="flex gap-2 w-full">
      <input
        aria-label="Search Pokémon by name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search Pokémon by name..."
        className="flex-1 px-4 py-3 rounded-xl bg-white shadow-soft outline-none ring-1 ring-slate-200 focus:ring-primary/50"
      />
      <button
        onClick={onSubmit}
        className="px-4 py-3 rounded-xl bg-primary text-white font-semibold shadow-soft hover:opacity-90"
      >
        Search
      </button>
    </div>
  )
}
