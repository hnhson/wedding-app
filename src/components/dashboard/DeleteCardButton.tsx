'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  cardId: string
  cardName: string
}

export default function DeleteCardButton({ cardId, cardName }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/cards/${cardId}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      }
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="col-span-2 rounded border border-red-200 bg-red-50 p-2 text-center text-xs">
        <p className="mb-2 text-red-700">Xóa &ldquo;{cardName}&rdquo;?</p>
        <div className="flex gap-2">
          <button
            onClick={() => setConfirming(false)}
            className="flex-1 rounded border border-gray-300 bg-white py-1 text-gray-600 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 rounded bg-red-600 py-1 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Đang xóa...' : 'Xác nhận xóa'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="col-span-2 rounded border border-red-200 px-2 py-1.5 text-center text-sm text-red-600 hover:bg-red-50"
    >
      Xóa thiệp
    </button>
  )
}
