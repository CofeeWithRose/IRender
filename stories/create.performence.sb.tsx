import React, { useEffect, useRef, useState } from 'react'
import { converColorStr, IRender } from 'i-render'
import { loadCircle } from './utils';
export default {
    title: 'create performance',
    component: CreatePerformence,
};

const COUNT = 20000

export function CreatePerformence() {
    const canvasRef = useRef()
    const [duration, setDuration] = useState(NaN)
   
    const initElement = (render: IRender, imgId: number) => {
        for(let i =0; i< COUNT; i++) {
            const x = i%200 * 20
            const y = Math.floor(i/200) * 20
            render.createElement({  
                imgId,
                position: { x, y },
                color: converColorStr('rgba(255,0, 0, 1)'),
            })
        }
    }

    function init(render: IRender, imgId: number) {
        initElement(render, imgId)
        }

    useEffect(() => {
        const render = new IRender(canvasRef.current, { autoUpdate: false })
        const imgId = loadCircle(render, 10)
        const n = performance.now()
        init(render, imgId)
        setDuration(performance.now() - n)
        render.updateImidiatly()
    }, [])

    return <div> 
        <p>  create {COUNT} elemet usage: { duration} ms</p> 
        <canvas ref={canvasRef} width={800} height={800} />
    </div>
}