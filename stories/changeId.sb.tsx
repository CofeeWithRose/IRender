import { IRender, converColorStr } from 'i-render';
import React, { useEffect, useRef } from 'react'
import { loadCircle, loadReact, loadText } from './utils';

export default {
    title: 'ChangeId',
    component: ChangeId,
};

export function ChangeId() {


  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
      const canvas = canvasRef.current
      if(!canvas) return
      const irender = new IRender(canvas, { maxNumber: 100, textureSize: 1020 })


      const size100 = loadReact(irender, { x: 100, y: 100})
      const size200 = loadReact(irender, { x: 200, y: 200})
      const el = irender.createElement({
          imgId: size100,
          position: { x: canvas.width *0.5 , y: canvas.height *0.5},
          color: converColorStr('gray'),
      })
      
      el.setImgId(size200)
     




  }, [])


  return <div>
      <canvas 
          ref={canvasRef} 
          width={window.innerWidth} 
          height={window.innerHeight} 
          style={{
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0
          }} 
      />
  </div>
}