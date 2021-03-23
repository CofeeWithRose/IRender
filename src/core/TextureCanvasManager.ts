export class TextureCanvasManager {

    canvas: HTMLCanvasElement
  
    private curX = 1;
  
    private curY = 1;

    private curMaxHeight = 0

    private pading = 1

    private positionInfo: { x: number, y: number, w: number, h:number }[] = []

    private ctx: CanvasRenderingContext2D
  
    private id = 0;


  
    constructor( size= 2048){
      size = this.normolizeSize(size)
      this.canvas = document.createElement('canvas')
      this.canvas.width = size
      this.canvas.height = size
      this.ctx = this.canvas.getContext('2d')
    }

    protected normolizeSize(size: number): number {
      const f = Math.ceil(Math.log2(size))
      return Math.pow(2, Math.min(f, 13))
    }
  
    setImage(img: HTMLCanvasElement|HTMLImageElement): number{
      
      const id = this.id++
      this.checkSpace(img.width, img.height)
      this.ctx.drawImage(img, this.curX , this.curY, img.width, img.height)
      this.positionInfo[id] = { 
        x: this.curX,
        y: this.curY,
        w: img.width,
        h: img.height,
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

    getImageInfo(imgId: number): {x: number, y: number, w: number, h: number} {
      return this.positionInfo[imgId]
    }
  
  }