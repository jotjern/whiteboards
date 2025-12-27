import type { Whiteboard } from './types'

const TARGET_WIDTH = 280
const TARGET_HEIGHT = 360

// Small images are scaled to 1/3 of original size
const SMALL_SCALE = 1 / 3

type Props = {
  board: Whiteboard
  onClick?: () => void
}

export function WhiteboardCard({ board, onClick }: Props) {
  const { tl, tr, bl } = board.corners

  // Adjust corner coordinates for the smaller image
  const adjTl = [tl[0] * SMALL_SCALE, tl[1] * SMALL_SCALE] as const
  const adjTr = [tr[0] * SMALL_SCALE, tr[1] * SMALL_SCALE] as const
  const adjBl = [bl[0] * SMALL_SCALE, bl[1] * SMALL_SCALE] as const

  const srcW = adjTr[0] - adjTl[0]
  const srcH = adjBl[1] - adjTl[1]

  const scaleX = srcW > 0 ? TARGET_WIDTH / srcW : 1
  const scaleY = srcH > 0 ? TARGET_HEIGHT / srcH : 1

  const translateX = -adjTl[0] * scaleX
  const translateY = -adjTl[1] * scaleY

  return (
    <div
      className="wb-card"
      style={{ width: TARGET_WIDTH, cursor: onClick ? 'pointer' : undefined }}
      onClick={onClick}
    >
      <div
        className="wb-viewport"
        style={{
          width: TARGET_WIDTH,
          height: TARGET_HEIGHT,
        }}
      >
        <img
          className="wb-img"
          src={`images/whiteboards_small/${board.file}`}
          alt={`Whiteboard ${board.roomId}`}
          loading="lazy"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transformOrigin: '0 0',
            transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
          }}
        />
      </div>
      <div className="wb-label-wrap">
        <div className="wb-label">{board.roomId}</div>
      </div>
    </div>
  )
}
