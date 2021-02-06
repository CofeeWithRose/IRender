import { I_ELEMENT_TYPES } from '../core'
import { RGBA } from 'Data/RGBA'
import { Vec2 } from '../Data/Vec2'
import {Ielement, UpdateHandle} from './Ielement'


export interface IimageInfo { imgId: number,  position: Vec2, color?: RGBA}


export class Iimage implements Ielement  {

    /**
     * 元素中心坐标.
     */
    readonly position: Vec2 = [ 0, 0 ]

    /**
     * 被渲染的贴图ID.
     */
    imgId: number

    /**
     * 渲染的颜色.
     */
    readonly color: RGBA = [255, 255, 255 , 1]

    /**
     * 元素的渲染顺序下标, 由渲染引擎维护.
     * 设置zIndex，下次render渲染前,所有的元素的elementIndex可能会更改.
     */
    elementIndex: number

    zIndex =  0

    /**
     * 缩放.
     */
    readonly scale: Vec2 = [ 1, 1 ]

    /**
     * 以图形的中心为旋转中心的旋转角度
     * 0~360
     */
    rotation = 0

    /**
     * 贴图的偏移位置.
     */
    readonly offset: Vec2 = [ 0, 0 ]

    /**
     * scale后的size.
     */
    readonly size: Vec2 = [ 100, 100 ];

    // readonly IELEMENT_TYPE = I_ELEMENT_TYPES.I_IMAGE

    /**
     * 贴图的size.
     */
    readonly texTureSize: Vec2 = [0, 0]

    /**
     * scale前的size.
     */
    readonly elementSize: Vec2 = [0, 0]

    constructor( 
      public update:UpdateHandle,
     ){ }
  
     /**
      * 图像中心的世界坐标.
      * @param x 
      * @param y 
      */
    setPosition(x: number, y: number){
        this.position[0] = x
        this.position[1] = y
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
    setColor(r: number, g: number, b: number, a:number){
      this.color[0] = r
      this.color[1] = g
      this.color[2] = b
      this.color[3] = a * 255
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
    setScale(scaleX: number, scaleY: number) {
      this.scale[0] = scaleX
      this.scale[1] = scaleY
      this.setScaledSize(this.elementSize[0], this.elementSize[1])
      this.update.updateScale(this.elementIndex, this.scale)
    }

    /**
     * 贴图的偏移.
     * @param offsetX 
     * @param offsetY 
     */
    setOffset( offsetX: number, offsetY: number) {
      this.offset[0] = offsetX
      this.offset[1] = offsetY
      this.update.updateOffset(this.elementIndex, this.offset)
    }

    /**
     * 贴图的size, 默认不需要调用该函数.
     * @param w 
     * @param h 
     */
    setTextureSize(w: number, h: number) {
      this.texTureSize[0] = w
      this.texTureSize[1] = h
    }

    /**
     * scale前的size.
     * @param w 
     * @param h 
     */
    private setElelmentSize(w: number, h: number) {
      this.elementSize[0] = w
      this.elementSize[1] = h
    }

    /**
     * 设置scale后的size, 入参为scale前的size.
     * @param w 
     * @param h 
     */
    private setScaledSize(w: number, h: number) {
      this.size[0] = w * this.scale[0]
      this.size[1] = h * this.scale[1]
    }

    /**
     * scale前的size.
     * @param w 
     * @param h 
     */
    setSize(w: number, h: number) {
      this.setElelmentSize(w, h)
      this.setScaledSize(w, h)
      this.update.updateSize(this.elementIndex, this.elementSize)
    }

}