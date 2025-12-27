import './App.css'

import { useEffect, useMemo, useState } from 'react'
import type { Whiteboard, WhiteboardsJson } from './types'
import { floorFromRoomId, digitsFromRoomId } from './utils'
import { WhiteboardCard } from './WhiteboardCard'
import { Lightbox } from './Lightbox'

function App() {
  const [data, setData] = useState<WhiteboardsJson | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedBoard, setSelectedBoard] = useState<Whiteboard | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('whiteboards.json', { cache: 'no-store' })
        if (!res.ok) throw new Error(`Failed to load whiteboards.json (${res.status})`)
        const json = (await res.json()) as WhiteboardsJson
        if (cancelled) return
        setData(json)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : String(e))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const boards = useMemo<Whiteboard[]>(() => {
    if (!data) return []
    return Object.entries(data).map(([roomId, entry]) => ({
      roomId,
      file: entry.file,
      corners: entry.corners,
      floor: floorFromRoomId(roomId),
    }))
  }, [data])

  const floors = useMemo(() => {
    const map = new Map<number, Whiteboard[]>()
    for (const b of boards) {
      if (b.floor == null) continue
      const list = map.get(b.floor) ?? []
      list.push(b)
      map.set(b.floor, list)
    }

    for (const [, list] of map) {
      list.sort((a, b) => {
        const aHasLetter = /[A-Za-z]/.test(a.roomId)
        const bHasLetter = /[A-Za-z]/.test(b.roomId)
        if (aHasLetter !== bHasLetter) {
          return aHasLetter ? 1 : -1
        }
        const da = digitsFromRoomId(a.roomId)
        const db = digitsFromRoomId(b.roomId)
        if (da != null && db != null && da !== db) return da - db
        return a.roomId.localeCompare(b.roomId, undefined, { numeric: true })
      })
    }

    return [...map.entries()].sort(([a], [b]) => a - b)
  }, [boards])

  if (error) return <div className="state state-error">{error}</div>
  if (!data) return <div className="state">Loading…</div>

  return (
    <div className="page">
      <header className="gallery-header">
        <h1 className="gallery-title">I-House Whiteboard Gallery</h1>
        <p className="gallery-subtitle">Fall 2025</p>
      </header>
      {floors.map(([floor, list]) => (
        <section key={floor} className="floor">
          <div className="scroller" role="list" aria-label={`Floor ${floor} whiteboards`}>
            {list.map((b) => (
              <div key={b.roomId} role="listitem">
                <WhiteboardCard board={b} onClick={() => setSelectedBoard(b)} />
              </div>
            ))}
          </div>
        </section>
      ))}
      {selectedBoard && (
        <Lightbox
          src={`images/whiteboards/${selectedBoard.file}`}
          roomId={selectedBoard.roomId}
          onClose={() => setSelectedBoard(null)}
        />
      )}
    </div>
  )
}

export default App
