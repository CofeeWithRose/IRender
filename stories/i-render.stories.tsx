import React, { useEffect, useRef } from 'react';

import { IRender, Iimage, I_ELEMENT_TYPES } from 'i-render'
import { startFPS, stopFPS } from './fps';

export default {
  title: 'GL RENDER',
  component: Test,
};

export function Test() {
  return <div>
    test...
  </div>
}

const canvasWidth = 2800
const canvasHeight = 1300



const xCount = 85 * 2
const yCount = 25 * 10

const circleR = 12

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

        
        const [circleImgId] = glRender.loadImgs([circle])

        ctx.clearRect(0,0, circleR *2, circleR *2)
        ctx.fillStyle= "rgba(255,125,125,0.2)"
        ctx.arc(circleR, circleR , circleR, 0,  Math.PI *2 )
        ctx.fill()

        const [halfImgId] = glRender.loadImgs([circle])
        let reqH = { a : 0};
        
        const list:Iimage[] = []
        for(let i =0; i< xCount; i++){
          for( let j =0; j< yCount; j++ ){
            list.push ( 
        
              glRender.createElement(
                I_ELEMENT_TYPES.I_IMAGE, 
                { 
                  imgId:list.length%2? circleImgId: halfImgId , 
                  position:  {x: i *circleR * 0.3  , y: j * circleR * 0.3},
                  color: { r: 255, g: 255, b: 255, a: 255 },
                }
              ),
            )
          }
        }

        console.log('total:', list.length)
       
        let frameCount = 0
        const req = () => {
          frameCount++
          
          const l = list.length
          for(let i = 0; i<l; ++i ) {
            list[i].setImgId((frameCount+i)%60? circleImgId: halfImgId)
            // list[i].setPosition(list[i].position.x + Math.sign(frameCount) , list[i].position.y)
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



export function ColorTest() {
  const cRef = useRef()

  const textureRef = useRef<HTMLCanvasElement>()

  const glRenderRef  =  useRef<IRender>()

  useEffect(() =>{

      const glRender = new IRender(cRef.current, { })
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
      // ctx.stroke()
      ctx.fill()
      const [whiteId] = glRender.loadImgs([circle])

      
      ctx.clearRect(0,0, circleR *2, circleR *2)
      ctx.fillStyle= "rgba(255,0,0,0.8)"
      ctx.arc(circleR, circleR , circleR, 0,  Math.PI *2 )
      ctx.fill()
      const [redId] = glRender.loadImgs([circle])


      let reqH = { a : 0};
      
      glRender.createElement(
        I_ELEMENT_TYPES.I_IMAGE, 
        { 
          imgId: redId , 
          position:  {x: circleR *5 , y: circleR *5},
          color: { r: 255, g: 255, b: 255, a: 255 },
        }
      )

      glRender.createElement(
        I_ELEMENT_TYPES.I_IMAGE, 
        { 
          imgId: whiteId , 
          position:  {x: circleR , y: circleR},
          color: { r: 255, g: 0, b: 0, a: 255 * 0.8 },
        }
      )
      glRender.createElement(
        I_ELEMENT_TYPES.I_IMAGE, 
        { 
          imgId: whiteId , 
          position:  {x: circleR *0.5 , y: circleR *0.5},
          color: { r: 255, g: 0, b: 0, a: 255 * 0.8 },
        }
      )
     
      
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

  
  // ToStorybook.story = {
  //   name: 'render test',
  // };