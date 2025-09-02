import { motion } from 'framer-motion'

type Props = {
  checked: boolean
  onChange: (v: boolean) => void
  labels?: [string, string]
}

export default function Toggle({ checked, onChange, labels = ['Light', 'Dark'] }: Props) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-label={checked ? labels[1] : labels[0]}
      className="relative inline-flex items-center w-24 h-10 bg-muted rounded-full p-1 shadow-soft"
    >
      <motion.div
        layout
        className="w-10 h-8 bg-card rounded-full grid place-items-center text-sm font-medium"
      >
        {checked ? '🌙' : '☀️'}
      </motion.div>
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-500">{labels[0]}</span>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500">{labels[1]}</span>
    </button>
  )
}
