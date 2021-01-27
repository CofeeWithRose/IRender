/*
 * @Author: muyin
 * @Date: 2021-01-02 16:58:06
 * @email: muyin.ph@alibaba-inc.com
 */
import { I_ELEMENT_TYPES } from "core/infer"
import { RGBA } from "Data/RGBA"
import { Vec2 } from "../Data/Vec2"

export interface UpdateHandle {
    updatePosition: (elementIndex:number, position: Vec2) => void
    
    updateImg: (elementIndex:number, imgId: number) => void

    updateColor: (elementIndex:number, color: RGBA) => void

    updateZindex: () => void
}

export interface Ielement {

    update:UpdateHandle
    position: Vec2
    imgId: number
    elementIndex: number
    color: RGBA
    zIndex: number

    readonly IELEMENT_TYPE: I_ELEMENT_TYPES

    setPosition(x: number, y: number): void

    setZIndex(zIndex: number): void

    setColor(r: number, g: number, b: number, a:number): void

    setImgId(imgId: number): void

}
  