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
        this.checkSpace(c.width, c.height)
        this.ctx.drawImage(c, this.curX , this.curY, c.width, c.height)
        idList.push(id)
        this.positionInfo[id] = { 
          x: this.curX,
          y: this.curY,
          w: c.width,
          h: c.height,
        }
        this.movePosition(c.width, c.height)
      }
      return idList
    }

    private checkSpace = (w: number, h: number) => {
      const lefW = this.canvas.width - this.curX
      if(lefW < w) {
        this.movePosition(w,h)
      }
    }
    private movePosition = (w: number, h: number) =>  {

      if(this.curMaxHeight < h) this.curMaxHeight = h

      const nextX = this.curX + w + this.pading
      
      if(nextX >= this.canvas.width) {
        //换行
        this.curX = this.pading
        this.curY += this.curMaxHeight + this.pading
        this.curMaxHeight = 0
      }else{
        this.curX = nextX
      }
        // const nextHeight =  this.curLineHeight + c.height
    }

    getImageInfo(imgId: number): {x: number, y: number, w: number, h: number}[] {
      return [this.positionInfo[imgId]]
    }
  
  }