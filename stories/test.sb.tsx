import { IRender, converColorStr, Iimage } from 'i-render';
import React, { useEffect, useRef } from 'react'
import { loadCircle, loadReact, loadText } from './utils';
import imgurl from './assets/maggot.png'
import { startFPS, stopFPS } from './fps';

export default {
    title: 'Test',
    component: Test,
};

export function Test() {

    const canvsRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if(!canvsRef.current) return
        const irender = new IRender(canvsRef.current, { maxNumber: 50000})
        const img = new Image()
        const list: Iimage[] = []
        img.onload = () => {
            const imgId= irender.loadImg(img)
            for(let i =0; i< 30000; i++){
                const x = i%200 * 33
                const y = Math.floor(i/200) * 70
                const el = irender.createElement({
                    imgId,
                    position: {x, y}
                })
                list.push(el)
            }
        }
        img.src= imgurl
        const hanlde = { a : 0}
        const req = () => {
            list.forEach(el => {
                el.setRotation(Math.random()*360)
            })
            hanlde.a = requestAnimationFrame(req)
        }
        req()
        startFPS()
        return () => {
            cancelAnimationFrame(hanlde.a)
            stopFPS()
        }

    }, [])

    return <div>
        <div id="fps"/>
     <canvas
        ref={canvsRef}
        width={1000}
        height={1000}
    />
    </div>
}