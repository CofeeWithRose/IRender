import { IRender, converColorStr, Iimage } from 'i-render';
import React, { useEffect, useRef, useState } from 'react'
import { loadCircle, loadReact, loadText } from './utils';

export default {
    title: 'Muticanvas',
    component: Muticanvas,
};

export function Muticanvas(){
  const arr = Array.from(new Array(20)).map( (v, ind)=> ({id: ind, color: ind%2? 'red': 'yellow'})  )
  const [renderer, setRenderer] = useState<{renderer: IRender, elemrnts: Iimage[]}>({ renderer: null, elemrnts: [] })
 
  useEffect(() => {
    const glCanavs = document.createElement('canvas')
    glCanavs.width = 1000
    glCanavs.height = 1000
    
    const irender = new IRender(glCanavs)
    const circleId = loadCircle(irender, 40)
    const aelArr: Iimage[] = []
    for(let i=0; i < 10000; i++ ){
      const x = i%200
      const y = Math.floor(i/200)
      const c =  irender.createElement({
        imgId: circleId,
        position:{x: x * 100 , y:y * 100},
        color: converColorStr('blue')
      })
      aelArr.push(c)
    }
    
    irender.updateImidiatly()
    setRenderer({
      renderer: irender,
      elemrnts: aelArr
    })
   
  }, [])
  return <>

      {
        arr.map( ({id,color}) => <Demo 
            color={color}
            key={id} renderer={renderer.renderer} 
            elemrnts={renderer.elemrnts}
        />)
      }
  </>
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
    width="1000"
    height="1000"
  />
}