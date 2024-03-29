import React, { useEffect, useRef, useState } from 'react';

import { IRender, Iimage, RGBA, Vec2 } from 'i-render'

import './surfing.css'
import './fps.css'
import { startFPS, stopFPS } from './fps';
import { loadCircle, loadReact } from './utils';



export default {
  title: 'Surfing',
  component: Surfing,
};




class SurfingElementObj {

  public v: Vec2 = {x:0, y:-10}

  INIT_A: Vec2 = { x: 0, y:-50  }

  public a: Vec2 = { x: 10, y:-500}

  private color: RGBA

  public colorLerp = 0

  public r: number
  
  public img:Iimage

  constructor(img:Iimage){
    this.a.x = this.INIT_A.x
    this.a.y = this.INIT_A.y
    this.color = { ...img.color }
    this.r = 0.5 * img.size.x
    this.img = img
  }


  update(deltaTime: number) {
    this.v.x += this.a.x * deltaTime
    this.v.y += this.a.y * deltaTime
    this.v.x = Math.min(Math.max(this.v.x, -200), 200)
    
    const {x, y } = this.img.position
    this.img.setPosition(this.v.x * deltaTime + x, this.v.y *deltaTime +y)
    const {r, g, b, a} = this.img.color
    const { r:tR, g:tG, b: tB, a: tA } = this.color
    this.colorLerp += 0.05 * deltaTime
    if(this.colorLerp >1 ){
      this.colorLerp = 1
      this.img.setColor(tR, tG, tB, tA)
    }
    if(this.colorLerp < 1) {
      this.img.setColor( 
        (tR -r) * this.colorLerp + r,
        (tG -g) * this.colorLerp + g,
        (tB -b) * this.colorLerp + b,
        (tA -a) * this.colorLerp + a,  
      )
    }
    
  }
}

function distance (p1X: number, p1Y: number, p2X: number, p2Y: number ) {
  return Math.sqrt( Math.pow(p2X - p1X, 2) + Math.pow( p2Y - p1Y, 2 ) )
}
function surfingAnim(surfingElementObjList: SurfingElementObj[], w: number, h: number, point:[ number, number, number ], deltaTime: number) {
 const [pX, pY , pR] = point
  surfingElementObjList.forEach( (surfingElementObj) => {

    let {x, y} = surfingElementObj.img.position
    const vy =  (h- y) * 0.002
    const random = Math.random()
    surfingElementObj.a.x = 200 *( random<0.5? 1  : -1)

    y -= vy< 1? 1 : vy

    if(y <-10 ) {
      y = h;
      x = Math.random()  * w
      surfingElementObj.img.setPosition(x, y)
      surfingElementObj.a.y = surfingElementObj.INIT_A.y
      surfingElementObj.v.x = 0
      surfingElementObj.v.y = -random*500
    }

    const dist = distance(pX, pY, x, y )
    if(dist <= (pR + surfingElementObj.r)) {
      surfingElementObj.v.x = pX> x? -200 : 200
      surfingElementObj.img.setColor( random * 10 + 245,  Math.random() * 30 + 220,  Math.random() * 20 +200,1)
      surfingElementObj.colorLerp = 0
    }

    if(x<= surfingElementObj.r){
      surfingElementObj.v.x = Math.abs(surfingElementObj.v.x)
    }
    if(x>= w-surfingElementObj.r) {
      surfingElementObj.v.x = -Math.abs(surfingElementObj.v.x)
    }
    
    surfingElementObj.update(deltaTime)
  })
}

function createSurfingElementObj (irender:IRender,smockId: number,  num: number) {
  const surfingElementObjList: SurfingElementObj[] = []
  for(let i=0; i< num; i++){
    const surfingElement = irender.createElement({
      imgId: smockId,
      position: { x:Math.random() * irender.glCanvas.width, y: 0}
    })
    const scale = Math.random() * 0.05 + 0.05
    surfingElement.setScale(scale, scale)
    surfingElement.setColor(  Math.random() * 127+117, 127+117 * Math.random(), Math.random() * 127+118, 1)
   
    const obj = new SurfingElementObj(surfingElement)
    surfingElementObjList.push(obj)
  }
  return surfingElementObjList
}


export function Surfing() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const irenderRef = useRef<IRender>()
  const num = 25000
  useEffect(() => {
    document.title = 'I Render'
    const canvas = canvasRef.current
    if(!canvas) return
  
    const irender = new IRender(canvas, { maxNumber: num + 2, autoUpdate: false })

    irenderRef.current = irender

    // background
    const backGround =  irender.createElement({
      imgId: loadReact(irender, {x:1, y:1}),
      position: { x: canvas.width *0.5, y: canvas.height *0.5 },
      color: { r: 255, g: 127, b: 127, a: 1 },
    })
    backGround.setScale(canvas.width, canvas.height)

    const circleTextureId = loadCircle(irenderRef.current, 100)
   
    const point =[canvas.width *0.5,canvas.height*0.5,35] as [number, number, number]
    const pointImg = irenderRef.current.createElement({
      imgId: circleTextureId,
      position: {x: point[0], y: point[1]}
    })
    pointImg.setColor(255, 200, 0, 1)
    pointImg.setScale(0.35, 0.35)

    const surfingElementObjList = createSurfingElementObj( irenderRef.current, circleTextureId, num)
    canvas.addEventListener('mousemove', e => {
      e.preventDefault()
      point[0] = e.clientX
      point[1] = e.clientY
      pointImg.setPosition(point[0], point[1])
    })

    canvas.addEventListener('touchmove', e => {
      e.preventDefault()
      const p = e.touches[0]
      
      point[0] = p .clientX
      point[1] = (p .clientY -100)
     

      pointImg.setPosition(point[0], point[1])
     
    }, { passive: false })

    

  const reqHandle = { id: 0, deltaTime: 0 };
  let lastTime = Date.now() * 0.001

  const start = () => {
    const now = Date.now() * 0.001
    reqHandle.deltaTime = now - lastTime
    lastTime = now;
    surfingAnim(surfingElementObjList, canvas.width, canvas.height, point, reqHandle.deltaTime )
    irender.updateImidiatly()
    reqHandle.id = requestAnimationFrame(start)
  }

  start()
  startFPS()

  return () => {
    cancelAnimationFrame(reqHandle.id)
    stopFPS()
  }
  }, [])


  return <div className="surfing" >
  
      <div id="fps" />
      <div className="pannel" >粒子数量：{num}</div>
  
    <canvas
      ref={canvasRef}
      width={window.innerWidth }
      height={window.innerHeight }
    />
  </div>
} 

