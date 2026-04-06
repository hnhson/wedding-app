'use client'

import { Label } from '@/components/ui/label'
import type { CardConfig } from '@/types/card'
import { COLOR_PALETTES, FONT_PAIRS } from '@/lib/templates/presets'
import { TEMPLATES } from '@/lib/templates/data'

interface Props {
  config: CardConfig
  onChange: (patch: Partial<CardConfig>) => void
}

export default function StylePanel({ config, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Template selection */}
      <div>
        <Label className="mb-2 block">Template</Label>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => onChange({ templateId: template.id })}
              className={`rounded border p-2 text-left text-xs transition-colors ${
                config.templateId === template.id
                  ? 'border-gray-900 bg-gray-50 font-semibold'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color palettes */}
      <div>
        <Label className="mb-2 block">Bảng màu</Label>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(COLOR_PALETTES).map(([key, palette]) => (
            <button
              key={key}
              onClick={() => onChange({ colorPalette: key })}
              title={key}
              className={`h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                config.colorPalette === key ? 'border-gray-900 scale-110' : 'border-transparent'
              }`}
              style={{ background: `linear-gradient(135deg, ${palette.primary} 50%, ${palette.accent} 50%)` }}
            />
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">Đang chọn: {config.colorPalette}</p>
      </div>

      {/* Font pairs */}
      <div>
        <Label className="mb-2 block">Font chữ</Label>
        <div className="space-y-2">
          {Object.entries(FONT_PAIRS).map(([key, pair]) => (
            <button
              key={key}
              onClick={() => onChange({ fontPair: key })}
              className={`w-full rounded border px-3 py-2 text-left transition-colors ${
                config.fontPair === key
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <p className="text-sm font-medium">{pair.heading}</p>
              <p className="text-xs text-gray-500">{pair.body}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
