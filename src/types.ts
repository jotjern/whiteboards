export type CornerKey = 'tl' | 'tr' | 'br' | 'bl'
export type Corner = [number, number]

export type WhiteboardJsonEntry = {
  file: string
  corners: Record<CornerKey, Corner>
}

export type WhiteboardsJson = Record<string, WhiteboardJsonEntry>

export type Whiteboard = {
  roomId: string
  file: string
  corners: Record<CornerKey, Corner>
  floor: number | null
}

