function toSlugPart(name: string): string {
  return name
    .normalize('NFD')                    // decompose Vietnamese diacritics
    .replace(/[\u0300-\u036f]/g, '')     // remove combining marks
    .replace(/đ/gi, 'd')                 // Vietnamese đ → d
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')         // non-alphanumeric → hyphen
    .replace(/^-|-$/g, '')               // trim leading/trailing hyphens
    .slice(0, 15)                        // max 15 chars per part
}

export function generateBaseSlug(partner1: string, partner2: string, year: number): string {
  const p1 = toSlugPart(partner1)
  const p2 = toSlugPart(partner2)
  return `${p1}-${p2}-${year}`
}

export function appendRandomSuffix(slug: string): string {
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${slug}-${suffix}`
}
