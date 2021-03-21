import React, { CSSProperties, useEffect, useRef } from 'react'
import { ColorStr, converColorStr, IRender, RGBA, Vec2 } from 'i-render'
import { loadCircle } from './utils';
import { diffImage } from './utils/diffImage';

export default {
    title: 'OffScreen',
    component: OffScreen,
  };

const CANVAS_SIZE = 80

const R = 20

const PADDING = 2

const COLOR: ColorStr = 'yellowgreen'

const BG_COLOR = "gray"


export function OffScreen(){
    const buffCanvasRef = useRef<HTMLCanvasElement>()
    const canvas2dRef = useRef<HTMLCanvasElement>()

    useEffect(() => {
        const canavs2d = canvas2dRef.current
        const ctx = canavs2d.getContext('2d')
        ctx.fillStyle = COLOR
        
        ctx.arc(R+PADDING, R+PADDING, R, 0, Math.PI *2)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(R+PADDING+R, R+PADDING, R, 0, Math.PI *2)
        ctx.fill()
       
    },[])


    useEffect(() => {
        const glCanvas = document.createElement('canvas')
        glCanvas.width =CANVAS_SIZE
        glCanvas.height = CANVAS_SIZE
        const irender = new IRender(glCanvas, { offSreen: true })
        const circleId = loadCircle(irender, R)
        irender.createElement({
            imgId: circleId,
            position: {x:R+PADDING, y: R+PADDING},
            color: converColorStr(COLOR),
        })
        irender.createElement({
            imgId: circleId,
            position: {x:R+PADDING + R, y: R+PADDING},
            color: converColorStr(COLOR),
        })
        irender.updateImidiatly()
        const canvas = buffCanvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.drawImage(glCanvas, 0, 0)

    },[])


    useEffect(() => {
       
        const size  = Math.floor(CANVAS_SIZE/2)
        const canvas2d = canvas2dRef.current
        const ctx2d = canvas2d.getContext('2d')
        const data2d = ctx2d.getImageData(0, 0, size, size)
        const glCanavs = buffCanvasRef.current
        const ctxGl = glCanavs.getContext('2d')
        const datagl = ctxGl.getImageData(0, 0, size, size)
        diffImage(data2d, datagl)
    }, [])


    const wrapStyle:CSSProperties = {
        textAlign:'center',
        color: 'black'
    }

    return <>
    <div style={wrapStyle}>
        <p>canavs2d</p>
        <canvas
            ref={canvas2dRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            style={{
                background: BG_COLOR
            }}
        />
        </div>
        <div style={wrapStyle}>
            <p>gl</p>
            <canvas
                ref={buffCanvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                style={{
                    background: BG_COLOR
                }}
            />
        </div>
    </>
}