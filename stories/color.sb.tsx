import { IRender, converColorStr, Vec2 } from 'i-render';
import React, { useEffect, useRef } from 'react'
import { loadCircle, loadReact, loadText } from './utils';

export default {
    title: 'converColorStr',
    component: ConverColorStr,
};



export function ConverColorStr() {


    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if(!canvas) return
        const irender = new IRender(canvas, { maxNumber: 100, textureSize: 1020 })

        const rect = loadReact(irender, {x:1, y:1})
        const backageGround = irender.createElement({
            imgId: rect,
            position: { x: canvas.width *0.5 , y: canvas.height *0.5},
            color: converColorStr('gray'),
        })
        backageGround.setSize(1,1)
        backageGround.setScale(canvas.width, canvas.height)



        const circle = loadCircle(irender, 30)

        const padding = 120;

        irender.createElement({
            imgId: circle,
            position: { x: padding , y: 30},
            color:converColorStr('purple')
        })
        irender.createElement({
            imgId: loadText(irender, 'purple', {x: padding*2 , y: 30}),
            position: { x: padding, y: 30*2 + 30},
            color: converColorStr('purple')
        })


        irender.createElement({
            imgId: circle,
            position: { x: padding *3, y: 30},
            color: converColorStr('rgba(255, 255, 0, 0.8 )')
        })
        
        irender.createElement({
            imgId: loadText(irender, 'rgba(255, 255, 0, 0.8 )', {x: padding*2, y: 30}),
            position: { x: padding *3, y: 30*2 + 30},
            color: converColorStr('rgba(255, 255, 0, 0.8 )')
        })


        irender.createElement({
            imgId: circle,
            position: { x: padding *5, y: 30},
            color: converColorStr('rgb(255, 0, 0 )')
        })
        irender.createElement({
            imgId: loadText(irender, 'rgb(255, 0, 0 )', {x: padding*2, y: 30}),
            position: { x: padding *5, y: 30*2 + 30},
            color: converColorStr('rgb(255, 0, 0 )')
        })




        irender.createElement({
            imgId: circle,
            position: { x: padding *7, y: 30},
            color: converColorStr('#f00')
        })
        irender.createElement({
            imgId: loadText(irender, '#f00', {x: padding*2, y: 30}),
            position: { x: padding *7, y: 30*2 + 30},
            color: converColorStr('#f00')
        })


        irender.createElement({
            imgId: circle,
            position: { x: padding *9, y: 30},
            color: converColorStr('#f00a')
        })
        irender.createElement({
            imgId: loadText(irender, '#f00a', {x: padding*2, y: 30}),
            position: { x: padding *9, y: 30*2 + 30},
            color: converColorStr('#f00a')
        })

    

        irender.createElement({
            imgId: circle,
            position: { x: padding * 11, y: 30},
            color: converColorStr('#ff0000')
        })
        irender.createElement({
            imgId: loadText(irender, '#ff0000', {x: padding*2, y: 30}),
            position: { x: padding * 11, y: 30*2 + 30},
            color: converColorStr('#ff0000')
        })



        irender.createElement({
            imgId: circle,
            position: { x: padding * 13, y: 30},
            color: converColorStr('#ff0000aa')
        })
        irender.createElement({
            imgId: loadText(irender, '#ff0000aa', {x: padding*2, y: 30}),
            position: { x: padding * 13, y: 30*2 + 30},
            color: converColorStr('#ff0000aa')
        })
        irender.updateImidiatly()
        console.log('up...')


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

  