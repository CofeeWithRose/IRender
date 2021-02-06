import React, { useEffect, useRef, useState } from 'react';

import { IRender, Iimage, I_ELEMENT_TYPES } from 'i-render'

import './surfing.css'
import './fps.css'
import { startFPS, stopFPS } from './fps';
import { Vec2 } from 'Data/Vec2';



export default {
  title: 'Surfing',
  component: Surfing,
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

class SurfingElementObj {

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
    this.v[0] = Math.min(Math.max(this.v[0], -200), 200)
    
    const [x, y ] = this.img.position
    this.img.setPosition(this.v[0] * deltaTime + x, this.v[1] *deltaTime +y)

  }
}

function distance (p1: Vec2, p2: Vec2) {
  return Math.sqrt( Math.pow(p2[0] - p1[0], 2) + Math.pow( p2[1] - p1[1], 2 ) )
}
function surfingAnim(surfingElementObjList: SurfingElementObj[], w: number, h: number, point:[ number, number, number ], deltaTime: number) {
 const [pX, pY , pR] = point
  surfingElementObjList.forEach( (surfingElementObj) => {

    let [x, y] = surfingElementObj.img.position
    const vy =  (h- y) * 0.002
    const random = Math.random()
    surfingElementObj.a[0] = 200 *( random<0.5? 1  : -1)

    y -= vy< 1? 1 : vy
    // x += vx * w * 0.001

    if(y <-10 ) {
      y = h;
      x = (Math.random())  * w
      // x = (Math.random() * 0.1 + 0.45)  * w
      surfingElementObj.img.setPosition(x, y)
      surfingElementObj.a[1] = surfingElementObj.INIT_A[1]
      surfingElementObj.v[0] = 0
      surfingElementObj.v[1] = -random*500
    }

    const dist = distance([pX, pY], surfingElementObj.img.position)
    if(dist < pR + surfingElementObj.img.size[0]) {
      surfingElementObj.v[0] = pX> x? -200 : 200
    }
    if(x< 0){
      surfingElementObj.v[0] = Math.abs(surfingElementObj.v[0])
    }
    if(x> w) {
      surfingElementObj.v[0] = -Math.abs(surfingElementObj.v[0])
    }
    
    surfingElementObj.update(deltaTime)
  })
}

function createSurfingElementObj (irender:IRender,smockId: number,  num: number) {
  const surfingElementObjList: SurfingElementObj[] = []
  for(let i=0; i< num; i++){
    const surfingElement = irender.createElement(I_ELEMENT_TYPES.I_IMAGE, {
      imgId: smockId,
      position: [ 0.5 * irender.glCanvas.width, Math.random()* irender.glCanvas.height]
    })
    surfingElement.setColor(  Math.random() * 127+127, 127+127 * Math.random(), Math.random() * 127+128, 1)
    const obj = new SurfingElementObj(surfingElement)
    surfingElementObjList.push(obj)
  }
  return surfingElementObjList
}


export function Surfing() {
  const canvasRef = useRef<HTMLCanvasElement>()

  const irenderRef = useRef<IRender>()
  const num = 25000
  useEffect(() => {
    const canvas = canvasRef.current
    if(!canvas) return
  
    irenderRef.current = new IRender(canvas, { maxNumber: num + 1, backgroundColor: [1,0.5,0.5,1] })
    const smockId = loadCircle(irenderRef.current, 10)
    const pointId = loadCircle(irenderRef.current, 35)
    const surfingElementObjList = createSurfingElementObj( irenderRef.current, smockId, num)
   
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
      point[1] = (p .clientY -100) * devicePixelRatio
     

      pointImg.setPosition(point[0], point[1])
     
    }, { passive: false })

    

  const reqHandle = { id: 0, deltaTime: 0 };
  let lastTime = Date.now() * 0.001

  const start = () => {
    const now = Date.now() * 0.001
    reqHandle.deltaTime = now - lastTime
    lastTime = now;
    surfingAnim(surfingElementObjList, canvas.width, canvas.height, point, reqHandle.deltaTime )
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
  
      <div id="fps" />
      <div className="pannel" >粒子数量：{num}</div>
  
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%'}} 
      width={document.documentElement.clientWidth * window.devicePixelRatio }
      height={document.documentElement.clientHeight * window.devicePixelRatio }
    />
  </div>
} 

