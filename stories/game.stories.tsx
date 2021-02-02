import React, { useEffect, useRef, useState } from 'react';

import { IRender, Iimage, I_ELEMENT_TYPES } from 'i-render'

import standUrl from './assets/player2/stand1.png'
import run1Url from './assets/player2/run1.png'
import run2Url from './assets/player2/run2.png'
import run3Url from './assets/player2/run3.png'
import run4Url from './assets/player2/run4.png'
import run5Url from './assets/player2/run5.png'
import run6Url from './assets/player2/run6.png'
import run7Url from './assets/player2/run7.png'
import { startFPS, stopFPS } from './fps';
import './game.css'


export default {
  title: 'Run RENDER',
  component: Run,
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

async function init(iRender: IRender, runId: number, curRunId: { runId: number }, {total, scale, xCount}: {total: number, scale: number, xCount: number}) {
  const stand = await loadImage(iRender, standUrl)
  const runUrlList = [run1Url, run2Url, run3Url, run4Url, run5Url, run6Url, run7Url]
  let runAnimIds = await Promise.all( runUrlList.map(url => loadImage(iRender, url) ) )
  runAnimIds = runAnimIds.concat(runAnimIds.reverse()).reverse()
  let cur = 0
  const playerList = []
  for(let i = 0; i< total; i++){
   
    const x = 120 * scale * Math.floor(i%xCount) + 60 * scale
    const y = 140 * scale * Math.floor(i/xCount) + 60 * scale
    const player = iRender.createElement(I_ELEMENT_TYPES.I_IMAGE, {
      imgId: stand,
      position: [x, y]
    })
    player.setScale( -scale, scale )
    playerList.push(player)
  }
 
  let lastTime = Date.now() * 0.001
  const run = (runId: number) => {
    const now = Date.now() * 0.001
    if(now - lastTime >= 0.07 ) {
      const ind = (cur++)%runAnimIds.length
      playerList.forEach( (player, playerInd) => {
        const cc = runAnimIds[(ind + playerInd) %runAnimIds.length ]
        player.setImgId(cc)
      })
      lastTime = now
    }
    if(runId === curRunId.runId)  requestAnimationFrame( () =>  run(runId) )
  }
  run(runId)
}


export function Run() {
  const renderRef = useRef<IRender>()
  const canvasRef = useRef<HTMLCanvasElement>()
  const wrapRef = useRef<HTMLDivElement>()
  const [ total, setTotal] = useState(20000)
  const [ xCount, setXCount] = useState(110)
  const [ scale, setScale] = useState(1)
  const cancelHandleRef = useRef({runId: 0})


  useEffect(() => {
    const { current: canvas } = canvasRef
    if( !canvas) return
    cancelHandleRef.current.runId++
    stopFPS()
    console.log('cancelHandleRef.current.runId', cancelHandleRef.current.runId)
    canvas.width = document.documentElement.clientWidth
    canvas.height = document.documentElement.clientHeight
    renderRef.current = new IRender(canvas, { maxNumber: 200000 })
    init(renderRef.current,cancelHandleRef.current.runId, cancelHandleRef.current, { total, scale, xCount })
    startFPS()
    // const rc = wrapRef.current.querySelector('#hhhh')
    // if(rc) wrapRef.current.removeChild(rc)

    // const c = renderRef.current.getTexture()
    // c.id="hhhh"
    // wrapRef.current.appendChild(c)
    return () => {
      cancelHandleRef.current.runId++
      stopFPS()
    }
  }, [total, xCount, scale ])

  return <div ref={wrapRef} >
    <div 
    className="game_Wrap"
    style={{}}
    >
      <p id="fps"></p>
      <div className="item">
        总数量： <input type="range" min="500" max="200000" step="1" value={total} onChange={e => setTotal(Number(e.target.value))} /> { total }
      </div>
      <div className="item">
      列数：  <input type="range" min="10" max="200" step="1" value={xCount} onChange={e => setXCount(Number(e.target.value))} /> { xCount}
      </div>
     <div className="item">
      缩放：<input type="range" min="0.01" max="1" step="0.01" value={scale} onChange={e => setScale(Number(e.target.value))} /> {scale}
      </div>
    </div>
   
    <canvas
    ref={canvasRef}
    style={{ width: '100%', height: '100%'}} >
    </canvas>
  </div>
} 

