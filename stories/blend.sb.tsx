import { IRender, converColorStr } from 'i-render';
import React, { useEffect, useRef } from 'react'
import { ConverColorStr } from './color.sb';
import { loadCircle, loadReact, loadText } from './utils';

export default {
    title: 'Blend',
    component: Blend,
};

function createDiffDemo({irender,circle1, circle2, position, c1, c2, ctx} ){
    irender.createElement({
        imgId: circle1,
        position,
        color: converColorStr(c1)
    })
    irender.createElement({
        imgId: circle2,
        position,
        color: converColorStr(c2)
    })
    const cc = ctx as CanvasRenderingContext2D
    cc.beginPath()
    cc.fillStyle=c1
    cc.arc(position.x, position.y, 40, 0, Math.PI *2 )
    cc.fill()

    cc.beginPath()
    cc.fillStyle=c2
    cc.arc(position.x, position.y, 20, 0, Math.PI *2 )
    cc.fill()
}

export function Blend(){
    const canvasRef = useRef<HTMLCanvasElement>()

    const canvas2dRef = useRef<HTMLCanvasElement>()

    useEffect(() => {
        const glCanvas = document.createElement('canvas')
        glCanvas.width = 1000
        glCanvas.height = 1000

        const irender = new IRender(canvasRef.current, {})
        const circle1 = loadCircle(irender, 40)
        const circle2 = loadCircle(irender, 20) 

        const ctx = canvas2dRef.current.getContext('2d')

        createDiffDemo({
            irender,
            circle1,
            circle2,
            position: { x: 100, y: 50 },
            c1: 'white',
            c2: 'white',
            ctx,
        })

        createDiffDemo({
            ctx,
            irender,
            circle1,
            circle2,
            position: { x: 200, y: 50 },
            c1: 'green',
            c2: 'red'
        })

        createDiffDemo({
            ctx,
            irender,
            circle1,
            circle2,
            position: { x: 300, y: 50 },
            c1: 'rgba(255, 255, 255, 1)',
            c2: 'rgba(255, 0, 0, 0.5)',
        })

        createDiffDemo({
            ctx,
            irender,
            circle1,
            circle2,
            position: { x: 300, y: 50 },
            c1: 'rgba(50,255,255,0.5)',
            c2: 'rgba(50,255,255,0.5)',
        })

        createDiffDemo({
            ctx,
            irender,
            circle1,
            circle2,
            position: { x: 320, y: 50 },
            c1: 'rgba(50,255,255,0.5)',
            c2: 'rgba(50,255,255,0.5)',
        })

    }, [])
    return <div>
        <canvas ref={canvas2dRef} 
            width={window.innerWidth} 
            height={100} 
            style={{
                width: '100%',
                backgroundColor: 'grey'
            }} 
        />
       <p> canvas 2d </p>
        <canvas 
            ref={canvasRef} 
            width={window.innerWidth} 
            height={100} 
            style={{
                width: '100%',
                backgroundColor: 'grey'
            }} 
        />
        <p> irender </p>
    </div>

}