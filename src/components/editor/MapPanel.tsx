'use client'

import { useEffect, useRef, useState } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CardConfig } from '@/types/card'

interface Props {
  config: CardConfig
  onChange: (patch: Partial<CardConfig>) => void
}

export default function MapPanel({ config, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      setError('Chưa cấu hình Google Maps API key (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)')
      return
    }

    setOptions({ key: apiKey, libraries: ['places'] })

    importLibrary('places').then(() => {
      setLoaded(true)
    }).catch(() => {
      setError('Không thể tải Google Maps')
    })
  }, [])

  useEffect(() => {
    if (!loaded || !inputRef.current) return

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ['name', 'formatted_address', 'geometry', 'url'],
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry?.location) return

      onChange({
        venue: {
          name: place.name ?? '',
          address: place.formatted_address ?? '',
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          mapUrl: place.url ?? `https://maps.google.com/?q=${place.geometry.location.lat()},${place.geometry.location.lng()}`,
        },
      })
    })
  }, [loaded, onChange])

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label>Tìm kiếm địa điểm</Label>
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <Input
            ref={inputRef}
            placeholder={loaded ? 'Nhập tên địa điểm...' : 'Đang tải Google Maps...'}
            disabled={!loaded}
          />
        )}
      </div>

      {config.venue.name && (
        <div className="rounded border bg-gray-50 p-3 text-sm">
          <p className="font-semibold">{config.venue.name}</p>
          <p className="text-gray-600">{config.venue.address}</p>
          {config.venue.mapUrl && (
            <a href={config.venue.mapUrl} target="_blank" rel="noopener noreferrer"
              className="mt-1 inline-block text-blue-600 hover:underline text-xs">
              Xem trên Google Maps ↗
            </a>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label>Tên địa điểm (chỉnh tay)</Label>
        <Input
          value={config.venue.name}
          onChange={e => onChange({ venue: { ...config.venue, name: e.target.value } })}
          placeholder="Nhà hàng ABC"
        />
        <Label>Địa chỉ (chỉnh tay)</Label>
        <Input
          value={config.venue.address}
          onChange={e => onChange({ venue: { ...config.venue, address: e.target.value } })}
          placeholder="123 Đường XYZ, Quận 1, TP.HCM"
        />
      </div>
    </div>
  )
}
