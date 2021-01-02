
import { Vec2 } from '../Data/Vec2'
import {GLElement} from './GLElement'

export interface UpdateHandle {
  updatePosition: () => void
  updatezIndex : () => void
  updateImg: () => void
}

export class GlImage extends GLElement  {

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