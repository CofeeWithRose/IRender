import { converColorStr, IRender } from 'i-render'
import { useEffect, useRef, useState } from 'react';
import { loadCircle, loadReact, loadText } from './utils';
export default {
  title: 'View Port',
  component: ViewPort,
};

export function ViewPort(){

  const canvasRef = useRef<HTMLCanvasElement>()
  const renderRef = useRef<IRender>()

  useEffect(() => {
    document.body.style.padding = '0'
    const maxNumber  = 100000
    const renderer = new IRender(canvasRef.current, {maxNumber: maxNumber *3})
    const xMaxCount = 500
    const s = xMaxCount* 16 *2
    const circleId = loadCircle(renderer, 16)
    const rectId = loadReact(renderer, {x: 20, y: 20})
    const text = loadText(renderer, '1', { x: 20, y:20})
    for(let i =0; i< maxNumber; i++) {
      const yCount = Math.floor(i/xMaxCount)
      const xCount = i%xMaxCount
      renderer.createElement({
        imgId: circleId,
        position: {x: xCount * 16*2, y: yCount * 16*2},
        color: converColorStr('darkblue')
      })
      renderer.createElement({
        imgId: rectId,
        position: {x: xCount * 16*2, y: yCount * 16*2},
        color: converColorStr('lightblue')
      })
      renderer.createElement({
        imgId: text,
        position: {x: xCount * 16*2, y: yCount * 16*2},
        color: converColorStr('white')
      })
    }
  

    let vx =0, vy=0, w=500, h=500
    window.addEventListener('keydown', e => {
      // console.log(e.key)
        if(e.key === 'w') {
          vy-=10
        }
        if(e.key === 's') {
          vy+=10
        }
        if(e.key === 'a') {
          vx-=10
        }
        if(e.key === 'd') {
          vx+=10
        }
        if(e.key === 'e'){
          w+=100
          h+=100
        }
        if(e.key === 'q'){
          w-=100
          h-=100
        }

        renderer.setViewPort(vx,vy,w, h)
    })
   

  }, [])

  return <canvas ref={canvasRef} width="2000" height="2000" style={{width: 600, height: 600, border:'red solid 1px'}} ></canvas>
}
