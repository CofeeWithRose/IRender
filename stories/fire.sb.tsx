import React, { useEffect, useRef, useState } from 'react';

import { IRender, Iimage, I_ELEMENT_TYPES } from 'i-render'

import './fire.css'
import './fps.css'
import { startFPS, stopFPS } from './fps';
import { Vec2 } from 'Data/Vec2';



export default {
  title: 'Fire RENDER',
  component: Fire,
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

class FireObj {

  public v = [0, 0.1]

  INIT_A = [ 0, -0.001 ]

  public a = [0.1,-0.005]

  
  constructor(public img:Iimage){
    this.a[0] = this.INIT_A[0]
    this.a[1] = this.INIT_A[1]
  }

  update() {
    this.v[0] += this.a[0]
    this.v[1] += this.a[1]
    this.v[0] = Math.min(Math.max(this.v[0], -0.5), 0.5)
    
    const [x, y ] = this.img.position
    this.img.setPosition(this.v[0] + x, this.v[1] +y)

  }
}

function distance (p1: Vec2, p2: Vec2) {
  return Math.sqrt( Math.pow(p2[0] - p1[0], 2) + Math.pow( p2[1] - p1[1], 2 ) )
}
function smokeAnim(fireList: FireObj[], w: number, h: number, point:[ number, number, number ]) {
 const [pX, pY , pR] = point
  fireList.forEach( (fire, index) => {
   

    let [x, y] = fire.img.position
    const vy =  (h- y) * 0.002
    fire.a[0] = 0.05 *( Math.random()<0.5? 1  : -1)

    y -= vy< 1? 1 : vy
    // x += vx * w * 0.001

    if(y <-10 ) {
      y = h;
      x = (Math.random() * 0.1 + 0.45)  * w
      fire.img.setPosition(x, y)
      fire.a[1] = fire.INIT_A[1]
      fire.v[0] = 0
      fire.v[1] = -Math.random()
    }
    // const scale = y/h * 10
    // fire.setScale(scale, scale)
    // fire.setPosition( x, y)

    const dist = distance([pX, pY], fire.img.position)
    if(dist < pR + fire.img.size[0]) {
      fire.v[0] = pX> x? -10 : 10
       fire.v[1] = 0.05
    }
    fire.update()
    // fire.setColor(Math.random() * 255, 255 , 0, 1)
  })
}



export function Fire() {
  const canvasRef = useRef<HTMLCanvasElement>()

  const irenderRef = useRef<IRender>()

  useEffect(() => {
    const canvas = canvasRef.current
    if(!canvas) return
    const num = 40000
    irenderRef.current = new IRender(canvas, { maxNumber: num + 1, backgroundColor: [0,0,0,1] })
    const smockId = loadCircle(irenderRef.current, 10)
    const pointId = loadCircle(irenderRef.current, 35)
    const fireList: FireObj[] = []
    for(let i=0; i< num; i++){
      const fire = irenderRef.current.createElement(I_ELEMENT_TYPES.I_IMAGE, {
        imgId: smockId,
        position: [ 0.5 * canvas.width, ( 0.5 + 0.5 * Math.sin( 10 * i/num * Math.PI))* canvas.height]
      })
      fire.setColor( 255, 255, 0, 0.1)
      const obj = new FireObj(fire)
      fireList.push(obj)
    }
    console.log('fireList.length',fireList.length)


   
    const point =[0,0,35] as [number, number, number]
    const pointImg = irenderRef.current.createElement(I_ELEMENT_TYPES.I_IMAGE, {
      imgId: pointId,
      position: [ point[0], point[1] ]
    })
    pointImg.setColor(255, 125, 50, 1)
    // pointImg.setScale(5,5 )
    canvas.addEventListener('mousemove', e => {
      // e.preventDefault()
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

  const reqHandle = { id: 0 };

  const start = () => {
    smokeAnim(fireList, canvas.width, canvas.height, point)
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

