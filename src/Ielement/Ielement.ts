/*
 * @Author: muyin
 * @Date: 2021-01-02 16:58:06
 * @email: muyin.ph@alibaba-inc.com
 */
import { I_ELEMENT_TYPES } from "core/infer"
import { Vec2 } from "../Data/Vec2"

export interface UpdateHandle {
    updatePosition: (bufferIndex:number, position: Vec2) => void
    // updatezIndex : () => void
    updateImg: (bufferIndex:number, imgId: number) => void
}

export class Ielement {
    // zIndex: number = 0
    update:UpdateHandle
    position: Vec2
    imgId: number
    bufferIndex: number

    readonly IELEMENT_TYPE: I_ELEMENT_TYPES

}
  