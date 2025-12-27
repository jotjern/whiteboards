/**
 * Extract floor number from room ID.
 * Uses the first digit found in the string.
 * Examples: "200" → 2, "F30" → 3, "30F" → 3
 */
export function floorFromRoomId(roomId: string): number | null {
  const match = roomId.match(/[0-9]/)
  if (!match) return null
  const digit = Number(match[0])
  return Number.isFinite(digit) ? digit : null
}

/**
 * Extract numeric portion from room ID for sorting.
 * Examples: "F30" → 30, "408" → 408
 */
export function digitsFromRoomId(roomId: string): number | null {
  const digits = roomId.match(/\d+/)?.[0]
  if (!digits) return null
  const n = Number(digits)
  return Number.isFinite(n) ? n : null
}

