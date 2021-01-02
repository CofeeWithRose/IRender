/*
 * @Author: muyin
 * @Date: 2021-01-02 16:58:06
 * @email: muyin.ph@alibaba-inc.com
 */

import { Vec2 } from '../Data/Vec2'
import {Ielement} from './Ielement'

export interface UpdateHandle {
  updatePosition: () => void
  updatezIndex : () => void
  updateImg: () => void
}

export class Iimage extends Ielement  {

    constructor( 
      private update:UpdateHandle,
      initInfo : { imgId: number,  position: Vec2},
     ){
      super()
      this.position = initInfo.position
      this.imgId = initInfo.imgId
    }
  
    setPosition(x: number, y: number){
        this.position.x = x
        this.position.y = y
        this.update.updatePosition()
    }

    setImgId(imgId: number){
      this.imgId = imgId
      this.update.updateImg()
    }
    
}