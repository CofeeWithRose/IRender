import { IRender, converColorStr, red, black, green } from 'i-render';
import React, { useEffect, useRef } from 'react'
import { loadCircle } from './utils';

export default {
    title: 'Color Transfer',
    component: Color,
};

export function Color() {

    const iRederRef = useRef<IRender>()

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if(!canvas) return
        const irender = new IRender(canvas, { maxNumber: 5, textureSize: 1020 })
        const circle = loadCircle(irender, 30)

        const redCircle = irender.createElement({
            imgId: circle,
            position: { x:30, y: 30},
        })
        const {r: r1, g: g1, b: b1, a: a1 }= converColorStr('wheat')|| red
        redCircle.setColor(r1, g1, b1, a1)


        const rgbCircle = irender.createElement({
            imgId: circle,
            position: { x:30 *4, y: 30},
        })
        const {r, g, b, a}= converColorStr('rgba(255, 255, 0, 0.8 )')|| green
        rgbCircle.setColor(r, g, b, a)


    }, [])


    return <div>
        <canvas 
            ref={canvasRef} 
            width={window.innerWidth} 
            height={window.innerHeight} 
            style={{
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0
            }} 
        />
    </div>
}

  