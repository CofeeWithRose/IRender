import { RGBA, WHITE } from '../Data/RGBA'
import { ONE, Vec2, ZERO } from '../Data/Vec2'

export interface UpdateHandle {
  updatePosition: (elementIndex:number, position: Vec2) => void
  
  updateImg: (elementIndex:number, imgId: number) => void

  updateColor: (elementIndex:number, color: RGBA) => void

  updateZindex: () => void

  updateRotation: ( elementIndex: number, rotation: number ) => void

  updateScale: ( elementIndex: number, scale: Vec2 ) => void

  updateSize: (elementIndex: number, size: Vec2) => void

  updateOffset: (elementIndex: number, offset: Vec2) => void
  
}

export interface IimageInfo { imgId: number,  position: Vec2, color?: RGBA}


export class Iimage {

    /**
     * 元素中心坐标.
     */
    position: Vec2;

    /**
     * 被渲染的贴图ID.
     */
    imgId: number

    /**
     * 渲染的颜色.
     */
    color: RGBA;
    /**
     * 元素的渲染顺序下标, 由渲染引擎维护.
     * 设置zIndex，下次render渲染前,所有的元素的elementIndex可能会更改.
     */
    elementIndex: number

    zIndex =  0

    /**
     * 缩放.
     */
    scale: Vec2 = ONE

    /**
     * 以图形的中心为旋转中心的旋转角度
     * 0~360
     */
    rotation = 0

    /**
     * 贴图的偏移位置.
     */
    offset: Vec2;

    /**
     * scale后的size.
     */
    size: Vec2;

    /**
     * 贴图的size.
     */
    texTureSize: Vec2;

    /**
     * scale前的size.
     */
    elementSize: Vec2 = ONE;

    readonly update:UpdateHandle

    constructor( 
      update:UpdateHandle
     ){ 
      this.update = update
     }
  
     /**
      * 图像中心的世界坐标.
      * @param x 
      * @param y 
      */
    setPosition(position: Vec2){
        this.position = position
        this.update.updatePosition(this.elementIndex, this.position)
    }

    /**
     * 图像的id.
     * @param imgId 
     */
    setImgId(imgId: number){
      this.imgId = imgId
      this.update.updateImg(this.elementIndex, this.imgId)
    }

    /**
     * 颜色.
     * @param r 0~255
     * @param g 0~255
     * @param b 0~255
     * @param a 0~1
     */
     setColor(color: RGBA){
      this.color=color
      this.update.updateColor(this.elementIndex, this.color)
    }


    /**
     * 渲染顺序，设置后，在下次渲染前，将根据该值对所有渲染顺序重排.
     * @param zIndex 
     */
    setZIndex(zIndex: number) {
      if(this.zIndex === zIndex) return
      this.zIndex = zIndex
      this.update.updateZindex()
    }

    /**
     * 以元素中心点为旋转中心的旋转角度.
     * 0 ~ 360.
     * @param rotation 
     */
    setRotation(rotation: number) {
      this.rotation = rotation
      this.update.updateRotation(this.elementIndex, rotation)
    }

    /**
     * 缩放,如果大于 1 会有锯齿.
     * @param scaleX 
     * @param scaleY 
     */
    setScale(scale: Vec2) {
      this.scale = scale
      this.setScaledSize(this.elementSize)
      this.update.updateScale(this.elementIndex, this.scale)
    }

    /**
     * 贴图的偏移.
     * @param offsetX 
     * @param offsetY 
     */
    setOffset( offset: Vec2) {
      this.offset = offset
      this.update.updateOffset(this.elementIndex, this.offset)
    }

    /**
     * 贴图的size, 默认不需要调用该函数.
     * @param w 
     * @param h 
     */
    setTextureSize(tSize: Vec2) {
      this.texTureSize = tSize
    }

    /**
     * 设置scale后的size, 入参为scale前的size.
     * @param w 
     * @param h 
     */
    private setScaledSize(size: Vec2) {
      this.size = {
        x: Math.abs(size.x * this.scale.x),
        y: Math.abs(size.y * this.scale.y)
      }
    }

    /**
     * scale前的size.
     * @param w 
     * @param h 
     */
    setSize(size: Vec2) {
      this.elementSize = size
      this.setScaledSize(size)
      this.update.updateSize(this.elementIndex, this.elementSize)
    }

}