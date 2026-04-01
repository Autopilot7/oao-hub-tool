interface ToggleProps {
  value: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  label?: string
}

export function Toggle({ value, onChange, disabled, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`toggle ${value ? 'toggle-on' : 'toggle-off'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`toggle-thumb ${value ? 'translate-x-[18px]' : 'translate-x-[3px]'}`}
      />
      {label && <span className="sr-only">{label}</span>}
    </button>
  )
}
