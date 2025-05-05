import React from 'react'
import CircleBoxDecoration from './CircleBoxDecoration'

export const CircleBoxDecorationBG = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
      }}
    >
      <CircleBoxDecoration position="topLeft" />
      <CircleBoxDecoration position="bottomRight" />
    </div>
  )
}

export default CircleBoxDecorationBG
