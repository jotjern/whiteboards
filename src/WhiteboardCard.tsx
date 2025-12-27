import type { Whiteboard } from './types'

const TARGET_WIDTH = 280
const TARGET_HEIGHT = 360

type Props = {
  board: Whiteboard
  onClick?: () => void
}

export function WhiteboardCard({ board, onClick }: Props) {
  const { tl, tr, bl } = board.corners

  const srcW = tr[0] - tl[0]
  const srcH = bl[1] - tl[1]

  const scaleX = srcW > 0 ? TARGET_WIDTH / srcW : 1
  const scaleY = srcH > 0 ? TARGET_HEIGHT / srcH : 1

  const translateX = -tl[0] * scaleX
  const translateY = -tl[1] * scaleY

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
          src={`/images/whiteboards/${board.file}`}
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
