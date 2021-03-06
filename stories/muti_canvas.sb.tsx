import { IRender, IRenderOptions, converColorStr, Iimage } from 'i-render';
import React, { useEffect, useRef, useState } from 'react'
import { loadCircle, loadReact, loadText } from './utils';

export default {
    title: 'Muticanvas',
    component: Muticanvas,
};

const SIZE = 1000

const r = 12

const pandding = 2

const xCount = 80

const can = document.createElement('canvas')

export function Muticanvas(){
  const arr = Array.from(new Array(100)).map( (v, ind)=> ({id: ind, canvas: can, color: ind%2? 'red': 'yellow'})  )
 
  useEffect(() => {
    const glCanavs = document.createElement('canvas')
    glCanavs.width = SIZE
    glCanavs.height = SIZE
  
    const irender = new IRender(glCanavs, { 
      autoUpdate: false, 
      maxNumber: 10000, 
      offSreen: true, // 绘制到canvas2d，需要设置此值.
    })
    const circleId = loadCircle(irender, r)
    const aelArr: Iimage[] = []
    for(let i=0; i < 3000; i++ ){
      const x = i%xCount
      const y = Math.floor(i/xCount)
      const c =  irender.createElement({
        imgId: circleId,
        position:{x: x * (r*2 +pandding) , y:y * (r*2+pandding)},
      })
      aelArr.push(c)
    }
    
    arr.forEach( ({canvas}, ind) => {
      const {r, g, b, a} = converColorStr(ind%2? 'red': 'yellow')
      aelArr.forEach(el => el.setColor(r,g,b,a))
      irender.updateImidiatly();
      const ctx = canvas.getContext('2d');
      ctx&&ctx.drawImage(irender.glCanvas, 0, 0)
    })

    // startFPS()

    return () => {
      // stopFPS()
    }
  
   
  }, [])
  return <div>
  {/* <div id="fps"/> */}
      {
        arr.map( a => <canvas 
          ref={c=>{
            a.canvas = c
          }} 
          width={SIZE} 
          height={SIZE} 
        />)
      }
      
  </div>
}

export function Demo({renderer, elemrnts, color }:{color: string ,renderer: IRender, elemrnts: Iimage[]})  {
  const canvasRef = useRef<HTMLCanvasElement>()

  useEffect(() => {
  if(!renderer) return
   const ctx =  canvasRef.current.getContext('2d')
   const {r,g,b,a} = converColorStr(color)
   elemrnts.forEach( e => {
    e.setColor(r,g,b,a)
   })
   renderer.updateImidiatly()
   ctx.drawImage(renderer.glCanvas, 0, 0)
  }, [renderer, color])

  return <canvas
    ref={canvasRef}
    width={SIZE}
    height={SIZE}
  />
}