/*
 * @Author: muyin
 * @Date: 2021-01-02 21:25:55
 * @email: muyin.ph@alibaba-inc.com
 */

let id = 0


export function startFPS() {
  let frameCount = 0
  const fpsDiv = document.querySelector('#fps')
  let lastTime = performance.now()
  const caculateFps = () => {
      frameCount++
      const now = performance.now()
    
      if(now - lastTime >=1000){
        const preFrameSeconds = (now - lastTime) * 0.001/ frameCount
        fpsDiv.innerHTML ='fps: '+ Math.round(1/preFrameSeconds)
        frameCount = 0;
        lastTime = now;
      }
    id = requestAnimationFrame(caculateFps)
  }
  caculateFps()
}
export function stopFPS() {
  cancelAnimationFrame(id)
}