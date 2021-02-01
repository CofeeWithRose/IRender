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

    position: Vec2

    imgId: number

    color: RGBA 

    elementIndex: number

    zIndex =  0

    scale = { x: 1, y: 1 }

    rotation = 0

    readonly IELEMENT_TYPE = I_ELEMENT_TYPES.I_IMAGE

    constructor( 
      public update:UpdateHandle,
      initInfo: IimageInfo
     ){
      this.position = initInfo.position
      this.imgId = initInfo.imgId
      this.color = initInfo.color || { r: 255, g: 255, b: 255, a:255 }
    }
  
    setPosition(x: number, y: number){
        this.position.x = x
        this.position.y = y
        this.update.updatePosition(this.elementIndex, this.position)
    }

    setImgId(imgId: number){
      this.imgId = imgId
      this.update.updateImg(this.elementIndex, this.imgId)
    }

    setColor(r: number, g: number, b: number, a:number){
      this.color.r = r
      this.color.g = g
      this.color.b = b
      this.color.a = a
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
      this.scale.x = scaleX
      this.scale.y = scaleY
      this.update.updateScale(this.elementIndex, this.scale)
    }

}