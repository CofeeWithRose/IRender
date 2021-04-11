import React, { useEffect, useRef, useState } from 'react'
import { converColorStr, Iimage, IRender } from 'i-render'
import { loadCircle } from './utils';
export default {
    title: 'Create Performence',
    component: CreatePerformence,
};

const COUNT = 10000

export function CreatePerformence() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [duration, setDuration] = useState(0)
    const irenderRef = useRef<{
      irender: IRender|null, imgId: number, curCount: 0,
      elements: Iimage[]
    }>({
      irender: null,
      imgId: 0,
      curCount: 0,
      elements: []
    })
   
    function init(render: IRender, imgId: number) {
        // initElement(render, imgId)
    }

    const add =() => {
      const {imgId, irender, elements} = irenderRef.current
      if(!irender) return
      const n = performance.now()
      for(let i =0; i< COUNT; i++) {
        const x = irenderRef.current.curCount%200 * 20
        const y = Math.floor(irenderRef.current.curCount/200) * 20
        const el = irender.createElement({  
            imgId,
            position: { x, y },
            color: converColorStr('rgba(255,0, 0, 1)'),
        })
        elements.push(el)
        irenderRef.current.curCount++

      }
      // irender.updateImidiatly()
      // setDuration(performance.now() - n)
    }

    const remove = () => {
      const n = performance.now()
      const {irender, elements} = irenderRef.current
      if(!irender) return
      const dels =  elements.splice(0, COUNT)
      dels.forEach(el => {
        irender.destoryElement(el)
        irenderRef.current.curCount--
      })
      // irender.updateImidiatly()
      // setDuration(performance.now() - n)
    }

    // console.log('irenderRef.current.curCount', irenderRef.current.curCount)

    useEffect(() => {
        if(!canvasRef.current) return
        const render = new IRender(canvasRef.current, { autoUpdate: true })
        irenderRef.current.irender = render
        const imgId = loadCircle(render, 10)
        irenderRef.current.imgId = imgId
        init(render, imgId)
        // render.updateImidiatly()
    }, [])

    return <div> 
        <button onClick={add}>add {COUNT}</button>
        <button onClick={remove}>remove {COUNT}</button>
        <p>  create {COUNT} elemet usage: { duration} ms</p> 

        <canvas ref={canvasRef} width={800} height={800} />
    </div>
}