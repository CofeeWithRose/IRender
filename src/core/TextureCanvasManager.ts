import { Vec2 } from "../Data/Vec2";

export interface TxtureInfo { position: Vec2, size: Vec2 }
export class TextureCanvasManager {

    canvas: HTMLCanvasElement
  
    private curX = 1;
  
    private curY = 1;

    private curMaxHeight = 0

    private pading = 1

    private positionInfo: TxtureInfo[] = []

    private ctx: CanvasRenderingContext2D
  
    private id = 0;


  
    constructor( size= 2048){
      this.canvas = document.createElement('canvas')
      this.canvas.width = size
      this.canvas.height = size
      const ctx = this.canvas.getContext('2d')
      if(ctx) this.ctx = ctx 
    }

  
    setImage(img: HTMLCanvasElement|HTMLImageElement): number{
      
      const id = this.id++
      this.checkSpace(img.width, img.height)
      this.ctx.drawImage(img, this.curX , this.curY, img.width, img.height)
      this.positionInfo[id] = { 
        position: { x: this.curX, y: this.curY},
        size: { x: img.width, y:  img.height },
      }
      this.movePosition(img.width, img.height)
      return id
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
    }

    getImageInfo(imgId: number): TxtureInfo {
      return this.positionInfo[imgId]
    }
  
  }