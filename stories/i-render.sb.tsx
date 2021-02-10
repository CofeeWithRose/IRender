import React, { useEffect, useRef } from 'react';

import { IRender, Iimage } from 'i-render'
import { startFPS, stopFPS } from './fps';
import './fps.css'

export default {
  title: 'Demo RENDER',
  component: Test,
};

export function Test() {
  return <div>
    test...
  </div>
}

const canvasWidth = 2800
const canvasHeight = 1300



const xCount = 85 * 10
const yCount = 20 * 5

const circleR = 50

const borderR = 0


export function PerformenceTest() {
    const cRef = useRef()

    const textureRef = useRef<HTMLCanvasElement>()

    const glRenderRef  =  useRef<IRender>()

    useEffect(() =>{

        const glRender = new IRender(cRef.current, { maxNumber: xCount * yCount })
        glRenderRef.current = glRender
        const circle = document.createElement('canvas')
        circle.width = (circleR+ borderR) *2
        circle.height = (circleR+ borderR)  *2
        const ctx = circle.getContext('2d')
        ctx.fillStyle= "rgba(50,255,255,0.2)"
        ctx.lineWidth= borderR
        ctx.arc(circleR, circleR, circleR,0,  Math.PI *2)
        ctx.fill()

        
        const circleImgId = glRender.loadImg(circle)

        ctx.clearRect(0,0, circleR *2, circleR *2)
        ctx.fillStyle= "rgba(255,125,125,0.2)"
        ctx.arc(circleR, circleR , circleR, 0,  Math.PI *2 )
        ctx.fill()

        const halfImgId = glRender.loadImg(circle)
        let reqH = { a : 0};
        
        const list:Iimage[] = []
        for(let i =0; i< xCount; i++){
          for( let j =0; j< yCount; j++ ){
            list.push ( 
              glRender.createElement({ 
                  imgId:list.length%2? circleImgId: halfImgId , 
                  position:  { x:(i+1) *circleR , y:  (j +1) * circleR },
              })
            )
          }
        }

        console.log('total:', list.length)
       
        let frameCount = 0
        function update(el, i){
          el.setImgId((frameCount+i)%60? circleImgId: halfImgId)
          // list[i].setPosition(list[i].position.x + Math.sign(frameCount) , list[i].position.y)
        }
        const req = (tt?: number) => {

          frameCount++
          
          list.forEach(update) 

          // for (let i =0; i< list.length; ++i ){
          //   list[i].setImgId((frameCount+i)%60? circleImgId: halfImgId)
          // }
          // glRender.updateImidiatly()
          reqH.a =requestAnimationFrame(req)
          
        }
        req()
        startFPS()
        return () => { 
          stopFPS()
          cancelAnimationFrame(reqH.a)
        }
    }, [])

    useEffect(() => {
      const ctx = textureRef.current.getContext('2d')
      ctx.drawImage( glRenderRef.current.getTexture(), 0,0, 200,200, 0,0, 200,200 )
    }, [])

    // style={{ backgroundColor: 'black' }} 
    return <div >
      <canvas ref={cRef} width={canvasWidth} height={canvasHeight} 
        style={{ 
          width : canvasWidth / devicePixelRatio, 
          height: canvasHeight/devicePixelRatio,
          backgroundColor: 'rgb(122,122,122,1)'
        }} />
      <canvas ref={textureRef} width={200} height={200} style={{backgroundColor:'rgb(122,122,122,1)'}} ></canvas>

      <div 
        id="fps"
      />
   </ div >
}

export function Canvas2dPerformenceTest() {
  const cRef = useRef()

    const textureRef = useRef<HTMLCanvasElement>()

    const glRenderRef  =  useRef<IRender>()

    useEffect(() =>{
      console.log('total:', xCount* yCount)
      const canvas:HTMLCanvasElement = cRef.current
      if (! canvas) return
      const ctx = canvas.getContext('2d')
       
      let frameCount = 0
      let reqH = { a : 0};
      ctx.fillStyle = 'rgba(255,125,0,0.3)'
      const req = () => {
        ctx.clearRect(0,0,canvas.width, canvas.height)
        frameCount++
        
        for(let i =0; i< xCount; i++){
          for( let j =0; j< yCount; j++ ){
            ctx.beginPath()
            ctx.arc( i *circleR * 0.3, j * circleR * 0.3, circleR, 0, Math.PI *2 )
            ctx.fill()
          }
        }
        // glRender.updateImidiatly()
        reqH.a =requestAnimationFrame(req)
      }
      startFPS()
      req()
      return () => { 
        stopFPS()
        cancelAnimationFrame(reqH.a)
      }
    }, [])

    // useEffect(() => {
    //   const ctx = textureRef.current.getContext('2d')
    //   ctx.drawImage( glRenderRef.current.getTexture(), 0,0, 200,200, 0,0, 200,200 )
    // }, [])

    // style={{ backgroundColor: 'black' }} 
    return <div >
      <canvas ref={cRef} width={canvasWidth} height={canvasHeight} 
        style={{ 
          width : canvasWidth / devicePixelRatio, 
          height: canvasHeight/devicePixelRatio,
          backgroundColor: 'rgb(122,122,122,1)'
        }} />
      <canvas ref={textureRef} width={200} height={200} style={{backgroundColor:'rgb(122,122,122,1)'}} ></canvas>

      <div 
        id="fps"
        style={{
          backgroundColor:'white',
          position: 'fixed',
          left: 0,
          top: 0,
        }}
      />
   </ div >
}



export function ColorTest() {
  const cRef = useRef()

  const textureRef = useRef<HTMLCanvasElement>()

  const glRenderRef  =  useRef<IRender>()

  useEffect(() =>{

      const glRender = new IRender(cRef.current, { maxNumber: 4})
      const circleR = 50;

      glRenderRef.current = glRender
      const circle = document.createElement('canvas')
      circle.width = circleR *2
      circle.height = circleR  *2
      const ctx = circle.getContext('2d')
      ctx.fillStyle= "rgba(255, 255, 255, 1)"
      ctx.strokeStyle="rgba(0,0,255, 1)"
      ctx.lineWidth= 10
      ctx.arc(circleR, circleR, circleR -10,0,  Math.PI *2)
      ctx.fill()
      const whiteId = glRender.loadImg(circle)

      
      ctx.clearRect(0,0, circleR *2, circleR *2)
      ctx.fillStyle= "rgba(255,0,0,0.8)"
      ctx.arc(circleR, circleR , circleR, 0,  Math.PI *2 )
      ctx.fill()
      const redId = glRender.loadImg(circle)


      let reqH = { a : 0};
      
      glRender.createElement({ 
          imgId: redId , 
          position:  { x:circleR *3, y:  circleR },
      })

      glRender.createElement({ 
          imgId: redId , 
          position:  { x:circleR *2.3, y: circleR },
      })

      glRender.createElement({ 
          imgId: whiteId , 
          position:  { x:circleR, y: circleR },
          color: {r:255, g:0, b: 0,  a:0.8},
      })
      glRender.createElement({ 
          imgId: whiteId , 
          position:  { x:circleR *0.5, y:  circleR *0.5 },
          color: { r:255, g:0,  b:0,  a: 0.8},
      })
      return () => { 
        cancelAnimationFrame(reqH.a)
      }
  }, [])

  useEffect(() => {
    const ctx = textureRef.current.getContext('2d')
    ctx.drawImage( glRenderRef.current.getTexture(), 0,0, 200,200, 0,0, 200,200 )
  }, [])

  // style={{ backgroundColor: 'black' }} 
  return <div >
    <canvas ref={cRef} width={canvasWidth} height={canvasHeight} 
      style={{ 
        width : canvasWidth / devicePixelRatio, 
        height: canvasHeight/devicePixelRatio,
        backgroundColor: 'rgb(122,122,122,1)'
      }} />
    <canvas ref={textureRef} width={200} height={200} style={{backgroundColor:'rgb(122,122,122,1)'}} ></canvas>

    <div 
      id="fps"
      style={{
        backgroundColor:'white',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    />
 </ div >
}

export function zIndexTest() {

  const cRef = useRef()

  const textureRef = useRef<HTMLCanvasElement>()

  const glRenderRef  =  useRef<IRender>()

  useEffect(() =>{

      const glRender = new IRender(cRef.current, { maxNumber: 30 })
      glRenderRef.current = glRender
      const circle = document.createElement('canvas')
      circle.width = (circleR+ borderR) *2
      circle.height = (circleR+ borderR)  *2
      const ctx = circle.getContext('2d')
      ctx.fillStyle= "rgba(255,255,255,1)"
      ctx.lineWidth= borderR
      ctx.fillRect(0,0,circleR*2,circleR*2)


      const cirle = glRender.loadImg(circle)
      
      const list:Iimage[] = []

      const green =  glRender.createElement({ 
          imgId: cirle, 
          position:  {x: circleR * 3,  y:circleR * 1.5 },
          color: {r: 0, g:255,  b:0, a: 0.8 }
      })

      const red =  glRender.createElement({ 
          imgId: cirle , 
          position: { x: circleR * 1.5, y: circleR * 1.5 },
          color: { r:255, g: 0,  b:0,  a:0.8 }
      })

      const blue =  glRender.createElement(
        
        { 
          imgId: cirle , 
          position: {  x: circleR * 2.25,  y: circleR * 2.5 },
          color:{ r: 0,  g:0,  b: 255, a: 0.8  }
        }
      )
      green.setZIndex(2)
      red.setZIndex(3)
     

     
      startFPS()
      return () => { 
        stopFPS()
      }
  }, [])

  useEffect(() => {
    const ctx = textureRef.current.getContext('2d')
    ctx.drawImage( glRenderRef.current.getTexture(), 0,0, 200,200, 0,0, 200,200 )
  }, [])
  
  return <div >
    <canvas ref={cRef} width={canvasWidth} height={canvasHeight} 
      style={{ 
        width : canvasWidth / devicePixelRatio, 
        height: canvasHeight/devicePixelRatio,
        backgroundColor: 'rgb(122,122,122,1)'
      }} />
    <canvas ref={textureRef} width={200} height={200} style={{backgroundColor:'rgb(122,122,122,1)'}} ></canvas>

    <div 
      id="fps"
      style={{
        backgroundColor:'white',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    />
 </ div >
}

export function TextureTest() {

  const cRef = useRef()

  const wrapRef = useRef<HTMLDivElement>()

  const textureRef = useRef<HTMLCanvasElement>()

  const glRenderRef  =  useRef<IRender>()

  const addNumberTexture = (): { [ number: number]: number } => {
    const { current: glRender } =  glRenderRef
    const imgIdMap: { [ number: number]: number } = {}
    const canvas = document.createElement('canvas')
    canvas.width = 80
    canvas.height = 50
    const ctx = canvas.getContext('2d')
    ctx.textAlign='left'
    ctx.textBaseline ='top'
    ctx.fillStyle= 'red'
    ctx.font="50px 微软雅黑";

    for(let t = 1; t< 1000; t++) {
      ctx.clearRect(0,0,canvas.width, canvas.height)

      ctx.fillText(t+'', 0, 0, 80)
      imgIdMap[t] = glRender.loadImg(canvas)
    }
    return imgIdMap
  }

  useEffect(() => {
    const glRender = new IRender(cRef.current, { maxNumber: xCount * yCount })
    glRenderRef.current = glRender
   
    const numberIdMap = addNumberTexture()

    if(wrapRef.current) {
      const cc = glRenderRef.current.getTexture()
      cc.style.width="1000px"
      wrapRef.current.appendChild(cc)
    }

    Object.values(numberIdMap).forEach( (imgId, indx) => {
      const x = ((indx%28) + 0.5) * 100
      const y = ( 0.5 + Math.floor(indx/28) )*100
     const el =  glRender.createElement({
        position: {x, y },
        imgId
      })
      el.setRotation(45)
      el.setScale(1, -1)
    })

  }, [])

  return <div ref={wrapRef}>
    <canvas ref={cRef} width={canvasWidth} height={canvasHeight} 
      style={{ 
        width : canvasWidth / devicePixelRatio, 
        height: canvasHeight/devicePixelRatio,
        backgroundColor: 'rgb(122,122,122,1)'
      }} />
    <canvas ref={textureRef} width={200} height={200} style={{backgroundColor:'rgb(122,122,122,1)'}} ></canvas>

    <div 
      id="fps"
      style={{
        backgroundColor:'white',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    />
 </ div >
}



  
  // ToStorybook.story = {
  //   name: 'render test',
  // };