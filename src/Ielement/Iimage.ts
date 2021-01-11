/*
 * @Author: muyin
 * @Date: 2021-01-02 16:58:06
 * @email: muyin.ph@alibaba-inc.com
 */

import { Vec2 } from '../Data/Vec2'
import {Ielement, UpdateHandle} from './Ielement'



export class Iimage extends Ielement  {

    constructor( 
      public update:UpdateHandle,
      initInfo : { imgId: number,  position: Vec2},
     ){
      super()
      this.position = initInfo.position
      this.imgId = initInfo.imgId
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

}