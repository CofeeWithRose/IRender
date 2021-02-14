import { IRender } from "i-render"

export function loadCircle(irender: IRender, r: number){
    const tempTexture = document.createElement('canvas')
    tempTexture.width = r *2
    tempTexture.height = r *2
    const tempCtx = tempTexture.getContext('2d')
    tempCtx.fillStyle = 'rgba(255,255, 255, 1)'
    tempCtx.arc( r,r, r, 0, Math.PI *2);
    tempCtx.fill()
    return irender.loadImg(tempTexture)
  }