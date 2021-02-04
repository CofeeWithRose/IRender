import React, { useEffect, useRef, useState } from 'react';

import { IRender, Iimage, I_ELEMENT_TYPES } from 'i-render'

import './fire.css'
import './fps.css'
import { startFPS, stopFPS } from './fps';



export default {
  title: 'Fire RENDER',
  component: Fire,
};

function loadPixi(irender: IRender){
  const tempTexture = document.createElement('canvas')
  const r = 35
  tempTexture.width = r *2
  tempTexture.height = r *2
  const tempCtx = tempTexture.getContext('2d', {alpha: true})
  tempCtx.fillStyle = 'rgba(255,255, 255, 1)'
  tempCtx.arc( r,r, r, 0, Math.PI *2);
  tempCtx.fill()
  return irender.loadImg(tempTexture)
}


function fireAnim(fireList: Iimage[], w: number, h: number) {
  fireList.forEach( (fire, index) => {
    // const percent = index/fireList.length
    // const angle = percent * Math.PI * 2 - Math.PI
    // const cosV =(Math.cos(angle)  )
    // console.log('percent', percent,'cosV', cosV)
   
    let y = fire.position[1]
    const v =  (h- y) * 0.01
    y -= v< 1? 1 : v
    if(y <1 ) {
      y = h;
    }
    // const scale = y/h * 10
    // fire.setScale(scale, scale)
    fire.setPosition( fire.position[0], y)
    // fire.setColor(Math.random() * 255, 255 , 0, 1)
  })
}

export function Fire() {
  const canvasRef = useRef<HTMLCanvasElement>()

  const irenderRef = useRef<IRender>()

  useEffect(() => {
    const canvas = canvasRef.current
    if(!canvas) return
    const num = 12000
    irenderRef.current = new IRender(canvas, { maxNumber: num, backgroundColor: [0,0,0,1] })
    const id = loadPixi(irenderRef.current)
    
    const fireList: Iimage[] = []
    for(let i=0; i< num; i++){
      const fire = irenderRef.current.createElement(I_ELEMENT_TYPES.I_IMAGE, {
        imgId: id,
        position: [ Math.random() * canvas.width, Math.random()* canvas.height]
      })
      // const scale = Math.random()
      // fire.setScale(scale, scale)
      fire.setColor( 255, 255, 0, 1)
      fireList.push(fire)
    }
    console.log('fireList.length',fireList.length)
    

  const reqHandle = { id: 0 };

  const start = () => {
    fireAnim(fireList, canvas.width, canvas.height)
    reqHandle.id = requestAnimationFrame(start)
  }

  start()
  startFPS()

  return () => {
    cancelAnimationFrame(reqHandle.id)
    stopFPS()
  }
  }, [])


  return <div>
   <div id="fps" ></div>
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%'}} 
      width={document.documentElement.clientWidth * window.devicePixelRatio }
      height={document.documentElement.clientHeight * window.devicePixelRatio }
    />
  </div>
} 

