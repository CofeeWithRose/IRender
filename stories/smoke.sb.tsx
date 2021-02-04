import React, { useEffect, useRef, useState } from 'react';

import { IRender, Iimage, I_ELEMENT_TYPES } from 'i-render'

import './smoke.css'
import './fps.css'
import { startFPS, stopFPS } from './fps';
import { Vec2 } from 'Data/Vec2';



export default {
  title: 'smoke RENDER',
  component: Smoke,
};

function loadCircle(irender: IRender, r: number){
  const tempTexture = document.createElement('canvas')
  tempTexture.width = r *2
  tempTexture.height = r *2
  const tempCtx = tempTexture.getContext('2d')
  tempCtx.fillStyle = 'rgba(255,255, 255, 1)'
  tempCtx.arc( r,r, r, 0, Math.PI *2);
  tempCtx.fill()
  return irender.loadImg(tempTexture)
}

class SmokeObj {

  public v = [0, -10]

  INIT_A = [ 0, -50 ]

  public a = [10,-500]

  
  constructor(public img:Iimage){
    this.a[0] = this.INIT_A[0]
    this.a[1] = this.INIT_A[1]
  }

  update(deltaTime: number) {
    this.v[0] += this.a[0] * deltaTime
    this.v[1] += this.a[1] * deltaTime
    this.v[0] = Math.min(Math.max(this.v[0], -100), 100)
    
    const [x, y ] = this.img.position
    this.img.setPosition(this.v[0] * deltaTime + x, this.v[1] *deltaTime +y)

  }
}

function distance (p1: Vec2, p2: Vec2) {
  return Math.sqrt( Math.pow(p2[0] - p1[0], 2) + Math.pow( p2[1] - p1[1], 2 ) )
}
function smokeAnim(smokeList: SmokeObj[], w: number, h: number, point:[ number, number, number ], deltaTime: number) {
 const [pX, pY , pR] = point
  smokeList.forEach( (smoke) => {

    let [x, y] = smoke.img.position
    const vy =  (h- y) * 0.002
    const random = Math.random()
    smoke.a[0] = 500 *( random<0.5? 1  : -1)

    y -= vy< 1? 1 : vy
    // x += vx * w * 0.001

    if(y <-10 ) {
      y = h;
      x = (Math.random())  * w
      // x = (Math.random() * 0.1 + 0.45)  * w
      smoke.img.setPosition(x, y)
      smoke.a[1] = smoke.INIT_A[1]
      smoke.v[0] = 0
      smoke.v[1] = -random*500
    }

    const dist = distance([pX, pY], smoke.img.position)
    if(dist < pR + smoke.img.size[0]) {
      smoke.v[0] = pX> x? -100 : 100
      // smoke.v[1] = 0.05
    }
    smoke.update(deltaTime)
  })
}



export function Smoke() {
  const canvasRef = useRef<HTMLCanvasElement>()

  const irenderRef = useRef<IRender>()

  useEffect(() => {
    const canvas = canvasRef.current
    if(!canvas) return
    const num = 30000
    irenderRef.current = new IRender(canvas, { maxNumber: num + 1, backgroundColor: [1,0.5,0.5,1] })
    const smockId = loadCircle(irenderRef.current, 10)
    const pointId = loadCircle(irenderRef.current, 35)
    const smokeList: SmokeObj[] = []
    for(let i=0; i< num; i++){
      const smoke = irenderRef.current.createElement(I_ELEMENT_TYPES.I_IMAGE, {
        imgId: smockId,
        position: [ 0.5 * canvas.width, Math.random()* canvas.height]
      })
      smoke.setColor(  Math.random() * 205, 255 * Math.random(), Math.random() * 127+127, 0.2)
      const obj = new SmokeObj(smoke)
      smokeList.push(obj)
    }
    console.log('smokeList.length',smokeList.length)


   
    const point =[0,0,35] as [number, number, number]
    const pointImg = irenderRef.current.createElement(I_ELEMENT_TYPES.I_IMAGE, {
      imgId: pointId,
      position: [ point[0], point[1] ]
    })
    pointImg.setColor(255, 200, 0, 1)

    canvas.addEventListener('mousemove', e => {
      point[0] = e.clientX *devicePixelRatio
      point[1] = e.clientY * devicePixelRatio
      pointImg.setPosition(point[0], point[1])
    })

    canvas.addEventListener('touchmove', e => {
      e.preventDefault()
      const p = e.touches[0]
      
      point[0] = p .clientX *devicePixelRatio
      point[1] = p .clientY * devicePixelRatio
     

      pointImg.setPosition(point[0], point[1])
     
    }, { passive: false })

  const reqHandle = { id: 0, deltaTime: 0 };
  let lastTime = Date.now() * 0.001

  const start = () => {
    const now = Date.now() * 0.001
    reqHandle.deltaTime = now - lastTime
    lastTime = now;
    smokeAnim(smokeList, canvas.width, canvas.height, point, reqHandle.deltaTime )
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

