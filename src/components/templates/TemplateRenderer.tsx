import type { CardConfig } from '@/types/card'
import { getTemplate } from '@/lib/templates/data'
import { COLOR_PALETTES, FONT_PAIRS, DEFAULT_PALETTE, DEFAULT_FONT_PAIR } from '@/lib/templates/presets'
import ClassicTemplate from './ClassicTemplate'
import ModernTemplate from './ModernTemplate'
import MinimalTemplate from './MinimalTemplate'
import FloralTemplate from './FloralTemplate'

interface Props {
  config: CardConfig
  className?: string
}

export default function TemplateRenderer({ config, className }: Props) {
  const template = getTemplate(config.templateId)
  const palette = COLOR_PALETTES[config.colorPalette] ?? DEFAULT_PALETTE
  const fontPair = FONT_PAIRS[config.fontPair] ?? DEFAULT_FONT_PAIR

  const cssVars = {
    '--card-primary': palette.primary,
    '--card-secondary': palette.secondary,
    '--card-accent': palette.accent,
    '--card-bg': palette.bg,
    '--card-font-heading': `"${fontPair.heading}", serif`,
    '--card-font-body': `"${fontPair.body}", sans-serif`,
  } as React.CSSProperties

  const TemplateComponent = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    floral: FloralTemplate,
  }[template.layout] ?? ClassicTemplate

  return (
    <div style={cssVars} className={className}>
      <TemplateComponent config={config} />
    </div>
  )
}
