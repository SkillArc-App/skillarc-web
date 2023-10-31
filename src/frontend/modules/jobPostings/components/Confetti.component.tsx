import React from 'react'
import Confetti from 'react-confetti'

interface ConfettiProps {
  width: number
  height: number
}

const ConfettiAnimation: React.FC<ConfettiProps> = ({ width, height }) => {
  return (
    // <div style={{ position: 'relative', width, height }}>
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={250}
      gravity={0.1}
      confettiSource={{ x: 0, y: 10, w: width, h: height }}
    />
    // </div>
  )
}

export default ConfettiAnimation
