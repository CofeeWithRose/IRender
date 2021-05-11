import { IRender, IRenderOptions, converColorStr, Iimage, Vec2 } from 'i-render';
import React, { useEffect, useRef, useState } from 'react'
import { Ielement } from '../src/Ielement/Ielement';
import { ConverColorStr } from './color.sb';
import { startFPS, stopFPS } from './fps';
import { loadCircle, loadReact, loadText } from './utils';

export default {
    title: 'Muticanvas',
    component: Muticanvas,
};

const SIZE = 1000

const r = 5

const pandding = 1

const xCount = 100


function dist(p1:Vec2, p2: Vec2) {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
}

export function Muticanvas(){
  const arr: {id: number, canvas: null| HTMLCanvasElement, color: string}[] = Array.from(new Array(10)).map( (v, ind)=> ({id: ind, canvas: null, color: ind%2? 'red': 'yellow'})  )
 
  useEffect(() => {
    const glCanavs = document.createElement('canvas')
    glCanavs.width = SIZE
    glCanavs.height = SIZE
  
    const irender = new IRender(glCanavs, { 
      autoUpdate: false, 
      maxNumber: 10000, 
    })
    const circleId = loadCircle(irender, r)
    const aelArr: Iimage[] = []
    for(let i=0; i < 10000; i++ ){
      const x = i%xCount
      const y = Math.floor(i/xCount)
      const c =  irender.createElement({
        imgId: circleId,
        position:{x: pandding + r + x * (r*2 +pandding) , y: pandding +r + y * (r*2+pandding)},
      })
      aelArr.push(c)
    }
    
    arr.forEach( ({canvas}, ind) => {
      if(!canvas) return
      const {r, g, b, a} = converColorStr(ind%2? 'darkorange': 'cadetblue')
      aelArr.forEach(el => el.setColor(r,g,b,a))
      irender.updateImidiatly();
      const ctx = canvas.getContext('2d');
      if(!ctx) return
      ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height)
      ctx&&ctx.drawImage(irender.glCanvas, 0, 0)
    })

    let highLightedCanvasIndList: Set<number> = new Set()

    function recoverHighlight(){
      highLightedCanvasIndList.forEach((ind) => {
     

        const {r,g,b,a} = converColorStr(ind%2? 'darkorange': 'cadetblue')
        const canvas = arr[ind].canvas
        if(!canvas) return
        const ctx = canvas.getContext('2d')
        aelArr.forEach(el => {
          el.setColor(r,g,b,a)
        })
        irender.updateImidiatly()
        if(!ctx) return
        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height)
        ctx.drawImage(irender.glCanvas, 0, 0)
      });
      highLightedCanvasIndList = new Set()
    }

    const handleHighLight =  (e:PointerEvent) => {

      recoverHighlight()
      const R = 150;

      const ind = arr.findIndex(({canvas}) => canvas === e.target )
      if(ind> -1) {
        const originColor = converColorStr(ind%2? 'darkorange': 'cadetblue')
        const {r,g,b,a} =  converColorStr(ind%2? 'rgba(255,255,0,1)': 'rgba(0,255,200,1)')|| converColorStr('white')
        const p = {
          x:e.offsetX,
          y: e.offsetY,
        }
        aelArr.forEach(el => {
          const dis = dist(p, el.position)
          if( dis<= R) {
            el.setColor(r,g,b,a)
            highLightedCanvasIndList.add(ind)
          }else{
            const {r,g,b,a} = originColor
            el.setColor(r,g,b,a)
          }
        })
        irender.updateImidiatly()
        const ctx = (e.target as HTMLCanvasElement).getContext('2d')
        if(!ctx) return
        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height)
        ctx && ctx.drawImage(irender.glCanvas, 0, 0)
      }
    }
    document.body.querySelector('#root')?.appendChild(irender.glCanvas)
    window.addEventListener('pointermove',handleHighLight)



    // startFPS()

    return () => {
      // stopFPS()
      window.removeEventListener('pointermove', handleHighLight)
    }
  
   
  }, [])
  return <div style={{fontSize: 0}}>
  <div id="fps"/>
      {
        arr.map( a => <canvas 
          key={a.id}
          ref={c=>{
            a.canvas = c
          }} 
          style={{
            cursor: 'pointer', 
            background: 'grey', 
            margin: 0, 
            padding: 0,
            lineHeight: 0,
            borderWidth: 0,
            display: 'inline-block',

          }}
          width={SIZE} 
          height={SIZE} 
        />)
      }
      
  </div>
}
