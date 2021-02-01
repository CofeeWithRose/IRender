/*
 * @Author: muyin
 * @Date: 2021-01-02 16:58:06
 * @email: muyin.ph@alibaba-inc.com
 */

import { I_ELEMENT_TYPES } from '../core'
import { RGBA } from 'Data/RGBA'
import { Vec2 } from '../Data/Vec2'
import {Ielement, UpdateHandle} from './Ielement'


export interface IimageInfo { imgId: number,  position: Vec2, color?: RGBA}
export class Iimage implements Ielement  {

    readonly position: Vec2 = [ 0, 0 ]

    imgId: number

    color: RGBA = [255, 255, 255 , 255]

    elementIndex: number

    zIndex =  0

    readonly scale: Vec2 = [ 1, 1 ]

    rotation = 0

    readonly offset: Vec2 = [ 0, 0 ]

    readonly size: Vec2 = [ 100, 100 ];

    readonly IELEMENT_TYPE = I_ELEMENT_TYPES.I_IMAGE

    constructor( 
      public update:UpdateHandle,
     ){ }
  
    setPosition(x: number, y: number){
        this.position[0] = x
        this.position[1] = y
        this.update.updatePosition(this.elementIndex, this.position)
    }

    setImgId(imgId: number){
      this.imgId = imgId
      this.update.updateImg(this.elementIndex, this.imgId)
    }

    setColor(r: number, g: number, b: number, a:number){
      this.color[0] = r
      this.color[1] = g
      this.color[2] = b
      this.color[3] = a
      this.update.updateColor(this.elementIndex, this.color)
    }

    setZIndex(zIndex: number) {
      if(this.zIndex === zIndex) return
      this.zIndex = zIndex
      this.update.updateZindex()
    }

    setRotation(rotation: number) {
      this.rotation = rotation
      this.update.updateRotation(this.elementIndex, rotation)
    }

    setScale(scaleX: number, scaleY: number) {
      this.scale[0] = scaleX
      this.scale[1] = scaleY
      this.update.updateScale(this.elementIndex, this.scale)
    }

    setOffset( offsetX: number, offsetY: number) {
      this.offset[0] = offsetX
      this.offset[1] = offsetY
      this.update.updateOffset(this.elementIndex, this.offset)
    }

    setSize(w: number, h: number) {
      this.size[0] = w
      this.size[1] = h
      this.update.updateSize(this.elementIndex, this.size)
    }

}