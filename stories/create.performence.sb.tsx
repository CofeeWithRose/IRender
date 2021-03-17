import React, { useEffect, useRef, useState } from 'react'
import { converColorStr, IRender } from 'i-render'
import { loadCircle } from './utils';
export default {
    title: 'create performance',
    component: CreatePerformence,
};

export function CreatePerformence() {
    const canvasRef = useRef()
    const [duration, setDuration] = useState(NaN)
   
    const initElement = (render: IRender, imgId: number) => {
        const color = converColorStr('red')
        for(let i =0; i< 10000; i++) {
            const x = i%200 * 20
            const y = Math.floor(i/200) * 20
            render.createElement({  
                imgId,
                position: { x, y },
                color,
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
        <p>create usage: { duration} ms</p> 
        <canvas ref={canvasRef} width={800} height={800} />
    </div>
}