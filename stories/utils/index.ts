import { IRender, Vec2 } from "i-render"

export function loadCircle(irender: IRender, r: number, color?: string){
    const tempTexture = document.createElement('canvas')
    tempTexture.width = r *2
    tempTexture.height = r *2
    const tempCtx = tempTexture.getContext('2d')
    tempCtx.fillStyle = color||'rgba(255,255, 255, 1)'
    tempCtx.arc( r,r, r, 0, Math.PI *2);
    tempCtx.fill()
    return irender.loadImg(tempTexture)
  }

export function loadText( iRender: IRender, str: string, size: Vec2): number {
    const canvas = document.createElement('canvas')
    canvas.width = size.x
    canvas.height = size.y
    const ctx = canvas.getContext('2d')
    ctx.textAlign='center'
    ctx.textBaseline ='hanging'
    ctx.fillStyle= 'white'
    ctx.font="20px 微软雅黑";
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1
    ctx.fillText( str,size.x *0.5, (size.y -20) *0.5)
    // ctx.strokeRect( 0,0, size.x, size.y)
    return iRender.loadImg(canvas)
}

export function loadReact(iRender: IRender, size: Vec2): number {
    const canvas = document.createElement('canvas')
    canvas.width = size.x
    canvas.height = size.y
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'white'
    ctx.fillRect(0,0, size.x, size.y)
    return iRender.loadImg(canvas)
}