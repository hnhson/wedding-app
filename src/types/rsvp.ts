export interface RSVP {
  id: string
  card_id: string
  name: string
  email: string | null
  attending: boolean
  guest_count: number
  message: string | null
  created_at: string
}

export interface Wish {
  id: string
  card_id: string
  name: string
  message: string
  created_at: string
}
