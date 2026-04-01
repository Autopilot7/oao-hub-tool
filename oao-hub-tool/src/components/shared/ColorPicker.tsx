import { useState } from 'react'

interface ColorPickerProps {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  label?: string
}

export function ColorPicker({ value, onChange, disabled, label }: ColorPickerProps) {
  const [inputVal, setInputVal] = useState(value)

  const handleHexChange = (hex: string) => {
    setInputVal(hex)
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      onChange(hex)
    }
  }

  const handleNativeChange = (hex: string) => {
    setInputVal(hex)
    onChange(hex)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className="w-8 h-8 rounded-md border border-surface-300 cursor-pointer overflow-hidden"
          style={{ backgroundColor: value || '#ffffff' }}
        >
          <input
            type="color"
            value={value || '#ffffff'}
            onChange={(e) => handleNativeChange(e.target.value)}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
      <input
        type="text"
        value={inputVal}
        onChange={(e) => handleHexChange(e.target.value)}
        disabled={disabled}
        placeholder="#000000"
        className="form-input w-28 font-mono text-xs"
        maxLength={7}
      />
      {label && <span className="text-xs text-ink-500">{label}</span>}
    </div>
  )
}
