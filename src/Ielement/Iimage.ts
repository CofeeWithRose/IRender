/*
 * @Author: muyin
 * @Date: 2021-01-02 16:58:06
 * @email: muyin.ph@alibaba-inc.com
 */

import { RGBA } from 'Data/RGBA'
import { Vec2 } from '../Data/Vec2'
import {Ielement, UpdateHandle} from './Ielement'


export interface IimageInfo { imgId: number,  position: Vec2, color: RGBA}
export class Iimage extends Ielement  {

    constructor( 
      public update:UpdateHandle,
      initInfo: IimageInfo
     ){
      super()
      this.position = initInfo.position
      this.imgId = initInfo.imgId
      this.color = initInfo.color
    }
  
    setPosition(x: number, y: number){
        this.position.x = x
        this.position.y = y
        this.update.updatePosition(this.bufferIndex, this.position)
    }

    setImgId(imgId: number){
      this.imgId = imgId
      this.update.updateImg(this.bufferIndex, this.imgId)
    }

    setColor(r: number, g: number, b: number, a:number){
      this.color.r = r
      this.color.g = g
      this.color.b = b
      this.color.a = a
      this.update.updateColor(this.bufferIndex, this.color)
    }

}