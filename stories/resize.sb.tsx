import { useEffect, useRef } from 'react';
import { ConverColorStr } from './color.sb';
import { startFPS, stopFPS } from './fps';
import { loadCircle, loadReact, loadText } from './utils';
import { converColorStr, IRender } from 'i-render'

export default {
    title: 'Resize',
    component: Resize,
};

const r = 40

export function Resize() {

  const canvasRef = useRef<HTMLCanvasElement>()

  useEffect(() => {
    const render = new IRender(canvasRef.current, {
      textureSize: 1000,
    })
    const circleId = loadCircle(render, r)
    render.createElement({
      imgId: circleId,
      position: {x: r+10, y: r+10},
      color: converColorStr('black')
    })

    setTimeout(() => {
      canvasRef.current.width=100
      canvasRef.current.height =100
      render.resize()
      render.setViewPort(0, 0, 100, 100)
    },100)

  }, [])

  return <canvas
    width={0}
    height={0}
    ref={canvasRef}
  />
}