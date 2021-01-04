
// import { increment, size } from '@/performance';
// import Matrix from '@/utils/Matrix';
import React, { useEffect, useRef } from 'react';
// import seats from './mocks';
import * as zrender from 'zrender'

console.log('zrender', zrender)


import { IRender, GL_ELEMENT_TYPES, Iimage } from 'i-render'
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

const canvasWidth = 1920
const canvasHeight = 969

const circleR = 5

const borderR = 0

const xCount = 600  
const yCount = 500

export const zRender  = () => {

  const canvasRef = useRef();
  const reqRef = useRef(0)

  useEffect(() => {
    const zr =  zrender.init(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      renderer: 'canvas',
    });

    console.log('total:', xCount * yCount)

    const list: zrender.Circle[] = []

    for(let i =0; i< xCount; i++){
      for( let j =0; j< yCount; j++ ){
        const c = new zrender.Circle({
          shape: { cx:i *circleR *2 + circleR, cy: j * circleR *2 + circleR, r: circleR },
        });
        zr.add(c);
        list.push(c)
      }
    }

    let frameCount = 0
    const update = () => {
      frameCount++
      const fillA = 'rgba(50,255,255,0.5)'
      const fillB = 'rgba(255,125,125,0.5)'
      const l = list.length
      for(let i = 0; i<l; ++i ) {
        list[i].attr('style', {fill: (frameCount+i)%20? fillA: fillB})
      }
      reqRef.current = requestAnimationFrame(update)
    }
    update()
    startFPS()
    return () =>  {
      stopFPS()
      cancelAnimationFrame(reqRef.current)
    }
  }, []);

  return <div >
  <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} 
    style={{ 
      width : canvasWidth / devicePixelRatio, 
      height: canvasHeight/devicePixelRatio,
      backgroundColor: 'rgb(122,122,122,1)'
    }} />
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
};
