import { useEffect, useRef } from 'react';
import { ConverColorStr } from './color.sb';
import { startFPS, stopFPS } from './fps';
import { loadCircle, loadReact, loadText } from './utils';
import { converColorStr, IRender } from 'i-render'

export default {
    title: 'Resize',
    component: Resize,
};

export function Resize() {

  const canvasRef = useRef<HTMLCanvasElement>()

  useEffect(() => {
    const render = new IRender(canvasRef.current)
    const circleId = loadCircle(render, 10)
    render.createElement({
      imgId: circleId,
      position: {x: 10, y: 10},
      color: converColorStr('red')
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