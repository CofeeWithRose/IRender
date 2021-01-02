import React, { useEffect, useRef } from 'react';

import { IRender, GL_ELEMENT_TYPES, Iimage } from 'i-render'


const canvasWidth = 1920
const canvasHeight = 969

const circleR = 5

const borderR = 0

function Test() {
    const cRef = useRef()

    const textureRef = useRef<HTMLCanvasElement>()

    const glRenderRef  =  useRef<IRender>()

    useEffect(() =>{

        const xCount = 600  
        const yCount = 500

        console.log('total:', xCount * yCount)

        const glRender = new IRender(cRef.current, { maxNumber: xCount * yCount })
        glRenderRef.current = glRender
        const circle = document.createElement('canvas')
        circle.width = (circleR+ borderR) *2
        circle.height = (circleR+ borderR)  *2
        const ctx = circle.getContext('2d')
        ctx.fillStyle= "rgba(50,255,255,0.5)"
        ctx.lineWidth= borderR
        ctx.arc(circleR, circleR, circleR,0,  Math.PI *2)
        ctx.fill()

        
        const [circleImgId] = glRender.loadImgs([circle])

        ctx.clearRect(0,0, circleR *2, circleR *2)
        ctx.fillStyle= "rgba(255,125,125,0.5)"
        ctx.arc(circleR, circleR , circleR, 0,  Math.PI *2 )
        ctx.fill()

        const [halfImgId] = glRender.loadImgs([circle])
        let reqH = {};
        
        const imgList:Iimage[] = []
        for(let i =0; i< xCount; i++){
          for( let j =0; j< yCount; j++ ){
            imgList.push ( 
        
              glRender.createElement(
                GL_ELEMENT_TYPES.GL_IMAGE, 
                { 
                  imgId:imgList.length%2? circleImgId: halfImgId , 
                  position:  {x: i *circleR *2  , y: j * circleR *2}
                }
              ),
            )
          }
        }

        const fpsDiv = document.querySelector('#fps')
        let lastTime = performance.now()
        let frameCount = 0
        const req = () => {
          frameCount++
          const now = performance.now()
    
          if(now - lastTime >=1000){
            const preFrameSeconds = (now - lastTime) * 0.001/ frameCount
            fpsDiv.innerHTML ='fps: '+ Math.round(1/preFrameSeconds)
            frameCount = 0;
            lastTime = now;
          }
          // imgList.forEach( function update(e, ind){
          //   // if(!(frameCount%10)){
          //     // e.setPosition( Math.random() * (canvasWidth - circleR *2), Math.random() * (canvasHeight - circleR *2) )
          //     // e.setPosition( e.position.x+1, e.position.y +1 )

          //   // }
          //   // e.setImgId((Date.now())%(2* 1000) < 1 *1000?  (ind%2? circleImgId: halfImgId) : (ind%3? circleImgId: halfImgId))
          //   e.setImgId((frameCount+ind)%60? circleImgId: halfImgId)
          // })
          const l = imgList.length
          for(let i = 0; i<l; ++i ) {
            imgList[i].setImgId((frameCount+i)%60? circleImgId: halfImgId)
          }

          glRender.updateImidiatly()
          reqH.a =requestAnimationFrame(req)
        }
        req()
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

export default {
    title: 'GL RENDER',
    component: Test,
  };
  
  export const ToStorybook = () => <Test/>;
  
  ToStorybook.story = {
    name: 'webgl',
  };