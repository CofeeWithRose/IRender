import React, { useEffect, useRef } from 'react';

import { IRender, Iimage, I_ELEMENT_TYPES } from 'i-render'

import standUrl from './assets/player2/stand1.png'
import run1Url from './assets/player2/run1.png'
import run2Url from './assets/player2/run2.png'
import run3Url from './assets/player2/run3.png'
import run4Url from './assets/player2/run4.png'
import run5Url from './assets/player2/run5.png'
import run6Url from './assets/player2/run6.png'
import run7Url from './assets/player2/run7.png'


export default {
  title: 'Demo2 RENDER',
  component: Game,
};

function loadImage(iRender:IRender, url: string ): Promise<number> {
  const img = new Image()
  img.src = url

  return new Promise(r => {
    img.onload = () => {
      const id = iRender.loadImg(img)
      r(id)
    }
  })
}

async function init(iRender: IRender) {
  const stand = await loadImage(iRender, standUrl)
  let runAnimIds = await Promise.all( [run1Url, run2Url, run3Url, run4Url, run5Url, run6Url, run7Url].map(url => loadImage(iRender, url) ) )
  runAnimIds = runAnimIds.concat(runAnimIds.reverse())
  console.log('runAnimIds', runAnimIds)
  let cur = 0
  const player = iRender.createElement(I_ELEMENT_TYPES.I_IMAGE, {
    imgId: stand,
    position: { x: 100, y: 100 }
  })
  player.setColor(0, 0, 0, 100)
  player.setScale( -1, 1 )

  
  window.addEventListener( 'keypress', (e) => {
    if(e.code === 'KeyM') {
      const ind = (cur++)%runAnimIds.length
      const cc = runAnimIds[ind]
      player.setImgId(cc)
      player.setScale( - ind/runAnimIds.length, ind/runAnimIds.length )
    }
  })

  window.addEventListener('keyup', e => {
    if(e.code === 'KeyM') {
      player.setImgId(stand)
      player.setScale( -1, 1 )
      cur = 0
    }
  })
}


export function Game() {
  const renderRef = useRef<IRender>()
  const canvasRef = useRef<HTMLCanvasElement>()

  useEffect(() => {
    const { current: canvas } = canvasRef
    if( !canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    renderRef.current = new IRender(canvas, { maxNumber: 1000 })
    init(renderRef.current)
  }, [])

  return <canvas
  ref={canvasRef}
  style={{ width: '100%', height: '100%'}} ></canvas>
} 

