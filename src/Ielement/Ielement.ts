import { TextureCanvasManager } from "../core/TextureCanvasManager"
import { RGBA } from "../Data/RGBA"
import { Vec2 } from "../Data/Vec2"

export interface UpdateHandle {
    updatePosition: (elementIndex:number, position: Vec2) => void
    
    updateImg: (elementIndex:number, imgId: number) => void

    updateColor: (elementIndex:number, color: RGBA) => void

    updateZindex: () => void

    updateRotation: ( elementIndex: number, rotation: number ) => void

    updateScale: ( elementIndex: number, scale: Vec2 ) => void

    updateSize: (elementIndex: number, size: Vec2) => void

    updateOffset: (elementIndex: number, offset: Vec2) => void

    textureManager: TextureCanvasManager
    
}

export interface Ielement {

  readonly update:UpdateHandle
  readonly position: Vec2
  
    imgId: number

    elementIndex: number

    readonly color: RGBA

    zIndex: number

    /**
     * 缩放后.
     */
    readonly scale: Vec2

     /**
     * scale后的size.
     */
    readonly size: Vec2;

    // readonly IELEMENT_TYPE = I_ELEMENT_TYPES.I_IMAGE

    /**
     * 贴图的size.
     */
    readonly texTureSize: Vec2;

    /**
     * scale前的size.
     */
    readonly elementSize: Vec2;

    /**
     * 0～360
     */
    rotation: number

    readonly offset: Vec2


    // readonly IELEMENT_TYPE: I_ELEMENT_TYPES

    setPosition(x: number, y: number): void

    setZIndex(zIndex: number): void

    setColor(r: number, g: number, b: number, a:number): void

    setImgId(imgId: number, shouldUpdateSize: boolean): void

    setRotation( rotation: number ): void

    setScale(scaleX: number, scaleY: number): void

    setOffset( offsetX: number, offsetY: number): void

    setSize( w: number, h: number ): void

    setTextureSize(w: number, h: number): void

}
  