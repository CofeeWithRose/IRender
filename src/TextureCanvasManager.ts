/*
 * @Author: muyin
 * @Date: 2020-12-19 09:44:46
 * @email: muyin.ph@alibaba-inc.com
 */
export class TextureCanvasManager {

    canvas: HTMLCanvasElement
  
    private curX = 1;
  
    private curY = 1;

    private curMaxHeight = 0

    private pading = 1

    private positionInfo: 
    {[imgId: number]: { x: number, y: number, w: number, h:number }} = {}

    private ctx: CanvasRenderingContext2D
  
    private id = 0;


  
    constructor( size= 2048){
      this.canvas = document.createElement('canvas')
      this.canvas.width = size
      this.canvas.height = size
      this.ctx = this.canvas.getContext('2d')
    }
  
    setImages(canvasList: HTMLCanvasElement[]): number[]{
      
      const idList = []
  
      for( let i =0; i< canvasList.length; i++ ){
        const id = this.id++
        const c = canvasList[i]
        this.ctx.drawImage(c, this.curX , this.curY, c.width, c.height)
        idList.push(id)
        this.positionInfo[id] = { 
          x: this.curX,
          y: this.curY,
          w: c.width,
          h: c.height,
        }
        this.handlePosition(c.width, c.height)
      }
      return idList
    }


    private handlePosition = (w: number, h: number) =>  {

      if(this.curMaxHeight < h) this.curMaxHeight = h

      const nextX = this.curX + w + 1
      
      if(nextX >= this.canvas.width) {
        //换行
        this.curX = 1
        this.curY += this.curMaxHeight +1
        this.curMaxHeight = 0
      }else{
        this.curX = nextX
      }
        // const nextHeight =  this.curLineHeight + c.height
    }

    getImageInfos(imgIds: number[]): {x: number, y: number, w: number, h: number}[] {
      return [this.positionInfo[imgIds[0]]]
    }
  
  }