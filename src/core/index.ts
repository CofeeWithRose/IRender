import { Iimage } from '../Ielement/Iimage'
import { FRAGMENT_SHADER, VERTEX_SHADER } from '../shader';
import { compileShader, SHADER_TYPE } from '../util';
import { TextureCanvasManager } from './TextureCanvasManager'
import {  Ielement, UpdateHandle } from '../Ielement/IElement'
import { IElementParams, IElements, IElementTypes, I_ELEMENT_TYPES } from './infer';
import { WHITE } from '../Data/RGBA';
import { OFFEST1, OFFEST2, OFFEST3 } from '../Data/Number';


export * from './infer/index'


const DEFAULT_OPTION = { 
  maxNumber: 50000, 
  textureSize: 2048, 
  backgroundColor: { r: 0, g: 0, b: 0, a: 0}
}
export class IRender {

    private  textureManager: TextureCanvasManager;
  
    private elementList: Ielement[] = []


    private gl:WebGLRenderingContext;

    private uniformLocations: { 
        u_windowSize: WebGLUniformLocation,
        u_textureSize: WebGLUniformLocation,
    };

    private attribuitesLocations: {
        a_position: number
        a_spriteSize: number;
        a_texCoord: number;
        a_color: number;
        a_scale: number;
        a_rotation: number;
        a_direction: number;
    };

    private attrData: {
        a_position: Float32Array,
        a_spriteSize: Float32Array,
        a_texCoord: Float32Array,
        a_color: Uint8Array,
        a_scale: Float32Array,
        a_rotation: Float32Array,
        a_direction: Float32Array,
        indicate: Uint32Array,
    }

    private attrBuffer: {
        a_position: WebGLBuffer,
        a_spriteSize: WebGLBuffer,
        a_texCoord: WebGLBuffer,
        a_color: WebGLBuffer,
        a_scale: WebGLBuffer,
        a_rotation: WebGLBuffer,
        a_direction: WebGLBuffer,
    }
  
    private positionBufferChanged = false

    private imageIdBufferChanged = false

    private colorBufferChanged = false

    private textureChange = true

    private zIndexChange = false

    private scaleChange = false

    private rotationChange = false

    private sizeChanged = false

    private rafing = false

    private texture: WebGLTexture

    private options: typeof DEFAULT_OPTION 

    private elementPool = new Set<Ielement>()

    private glExt: ANGLE_instanced_arrays

    constructor( public glCanvas: HTMLCanvasElement,   options?: Partial<typeof DEFAULT_OPTION>   ){
        this.options = { ...DEFAULT_OPTION,  ...options}
        this.textureManager =  new  TextureCanvasManager( this.options.textureSize )
        this.gl = glCanvas.getContext('webgl', { alpha: true })
         || glCanvas.getContext('experimental-webgl') as WebGLRenderingContext;

        this.glExt = this.gl.getExtension('ANGLE_instanced_arrays');
        this.gl.getExtension('OES_element_index_uint');
        
        const program = this.gl.createProgram()
        compileShader(this.gl, program, VERTEX_SHADER,SHADER_TYPE.VERTEX_SHADER )
        compileShader(this.gl, program, FRAGMENT_SHADER, SHADER_TYPE.FRAGMENT_SHADER)
        this.gl.linkProgram(program)

        console.log('getProgramInfoLog:', this.gl.getProgramInfoLog(program));
        this.gl.useProgram(program)
        this.gl.enable(this.gl.BLEND)
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
        
        this.uniformLocations = {
            u_windowSize: this.gl.getUniformLocation(program, 'u_windowSize'),
            u_textureSize: this.gl.getUniformLocation(program, 'u_textureSize')
        }
        this.attribuitesLocations = {
            a_position: this.gl.getAttribLocation(program, 'a_position'),
            a_spriteSize: this.gl.getAttribLocation(program, 'a_spriteSize'),
            a_texCoord: this.gl.getAttribLocation(program, 'a_texCoord'),
            a_color: this.gl.getAttribLocation(program, 'a_color'),
            a_rotation: this.gl.getAttribLocation(program, 'a_rotation' ),
            a_scale: this.gl.getAttribLocation(program, 'a_scale' ),
            a_direction: this.gl.getAttribLocation(program, 'a_direction' ),
        }
        this.initBuffer()
        this.initTexture()
        this.setViewPort()

        
       
    }


    getTexture = () => {
        return this.textureManager.canvas
    }

    private bufferData = (target: number, glBuffer: WebGLBuffer, data: BufferSource ) => {
      this.gl.bindBuffer( target, glBuffer )
      this.gl.bufferSubData( target, 0, data )
    }
    
    updateImidiatly = () => {
      this.rafing = false
        this.handleZindexChange()
        
        if(this.positionBufferChanged) {
            this.bufferData( this.gl.ARRAY_BUFFER, this.attrBuffer.a_position, this.attrData.a_position)
        }

        if(this.imageIdBufferChanged ) {
            this.bufferData(this.gl.ARRAY_BUFFER, this.attrBuffer.a_texCoord, this.attrData.a_texCoord)
        }

        if ( this.sizeChanged ) {
          this.bufferData(this.gl.ARRAY_BUFFER, this.attrBuffer.a_spriteSize, this.attrData.a_spriteSize)
        }

        if(this.colorBufferChanged){
          this.bufferData( this.gl.ARRAY_BUFFER, this.attrBuffer.a_color, this.attrData.a_color)
        }

        if (this.scaleChange) {
          this.bufferData( this.gl.ARRAY_BUFFER, this.attrBuffer.a_scale, this.attrData.a_scale )
        }

        if (this.rotationChange) {
          this.bufferData( this.gl.ARRAY_BUFFER, this.attrBuffer.a_rotation, this.attrData.a_rotation )
        }
        
        this.checkReloadTexure()
        this.gl.clearColor(this.options.backgroundColor.r, this.options.backgroundColor.g, this.options.backgroundColor.b, this.options.backgroundColor.a);
        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
        this.glExt.drawElementsInstancedANGLE(
          this.gl.TRIANGLES,
          this.attrData.indicate.length,
          this.gl.UNSIGNED_INT, 0, 
          this.elementList.length
        )
       

        this.imageIdBufferChanged = false
        this.positionBufferChanged = false
        this.textureChange = false
        this.colorBufferChanged = false
        this.sizeChanged = false
    }

    private checkReloadTexure = () => {
        if(!this.textureChange) return
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textureManager.canvas)
        console.log('textureChange。。')
    }

    private initTexture() {
        this.gl.uniform2f(this.uniformLocations.u_textureSize, this.options.textureSize, this.options.textureSize)
        this.texture = this.gl.createTexture()
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textureManager.canvas)
    }

    private initBuffer(){

        Float32Array.prototype.forEach = Float32Array.prototype.forEach || Array.prototype.forEach as any as typeof Float32Array.prototype.forEach;
        Uint8Array.prototype.forEach = Uint8Array.prototype.forEach || Array.prototype.forEach as any as typeof Uint8Array.prototype.forEach;
        Uint32Array.prototype.forEach = Uint32Array.prototype.forEach ||  Array.prototype.forEach as any as typeof Uint32Array.prototype.forEach;

        this.attrData  = {
            a_position: new Float32Array(this.options.maxNumber * 2 ),
            a_spriteSize: new Float32Array(this.options.maxNumber *2 ),
            a_texCoord: new Float32Array(this.options.maxNumber *2 ),
            a_color: new Uint8Array(this.options.maxNumber * 4 ),
            a_scale: new Float32Array(this.options.maxNumber *2 ),
            a_rotation: new Float32Array(this.options.maxNumber * 1),
            a_direction: new Float32Array( [ 
              0, 0,  
              0, 1, 
              1, 0, 
              1, 1  
            ]),
            indicate: new Uint32Array(  [ 0, 1, 2, 2, 1, 3 ]),
        }
         /**
         *  P0 ++++++ P2
         *  +         +
         *  +         +
         *  P1 ++++++ P3
         * 
         *  P0 -> P1 -> P2
         *  P2 -> P1 -> P3
        */
       const directionBuffer = this.gl.createBuffer()
       this.gl.bindBuffer(this.gl.ARRAY_BUFFER, directionBuffer)
       this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_direction, this.gl.STATIC_DRAW )
       this.gl.enableVertexAttribArray(this.attribuitesLocations.a_direction)
       this.gl.vertexAttribPointer(this.attribuitesLocations.a_direction, 2, this.gl.FLOAT, false, 0,0)

        const positionBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_position, this.gl.STREAM_DRAW )
        this.gl.enableVertexAttribArray(this.attribuitesLocations.a_position)
        this.gl.vertexAttribPointer(this.attribuitesLocations.a_position, 2, this.gl.FLOAT, false, 0,0)
        this.glExt.vertexAttribDivisorANGLE(this.attribuitesLocations.a_position, 1)

        const sizeBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, sizeBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_spriteSize, this.gl.STREAM_DRAW )
        this.gl.enableVertexAttribArray(this.attribuitesLocations.a_spriteSize)
        this.gl.vertexAttribPointer(this.attribuitesLocations.a_spriteSize, 2, this.gl.FLOAT, false, 0,0)
        this.glExt.vertexAttribDivisorANGLE(this.attribuitesLocations.a_spriteSize, 1)

        const texCoord = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoord)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_texCoord, this.gl.STREAM_DRAW )
        this.gl.enableVertexAttribArray(this.attribuitesLocations.a_texCoord)
        this.gl.vertexAttribPointer(this.attribuitesLocations.a_texCoord, 2, this.gl.FLOAT, false, 0,0)
        this.glExt.vertexAttribDivisorANGLE(this.attribuitesLocations.a_texCoord, 1)

        const color = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, color)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_color, this.gl.STREAM_DRAW )
        this.gl.enableVertexAttribArray(this.attribuitesLocations.a_color)
        this.gl.vertexAttribPointer(this.attribuitesLocations.a_color, 4, this.gl.UNSIGNED_BYTE, true, 0,0)
        this.glExt.vertexAttribDivisorANGLE(this.attribuitesLocations.a_color, 1)


        const scale = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, scale)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_scale, this.gl.STREAM_DRAW )
        this.gl.enableVertexAttribArray(this.attribuitesLocations.a_scale)
        this.gl.vertexAttribPointer(this.attribuitesLocations.a_scale, 2, this.gl.FLOAT, false, 0,0)
        this.glExt.vertexAttribDivisorANGLE(this.attribuitesLocations.a_scale, 1)

        const rotation = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, rotation)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.attrData.a_rotation, this.gl.STREAM_DRAW )
        this.gl.enableVertexAttribArray(this.attribuitesLocations.a_rotation)
        this.gl.vertexAttribPointer(this.attribuitesLocations.a_rotation, 1, this.gl.FLOAT, false, 0,0)
        this.gl.vertexAttribPointer(this.attribuitesLocations.a_rotation, 1, this.gl.FLOAT, false, 0,0)
        this.glExt.vertexAttribDivisorANGLE(this.attribuitesLocations.a_rotation, 1)

        const indicate = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indicate )
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.attrData.indicate, this.gl.STATIC_DRAW )


        this.attrBuffer = {
          a_position : positionBuffer,
          a_spriteSize: sizeBuffer,
          a_texCoord: texCoord,
          a_color: color,
          a_scale: scale,
          a_rotation: rotation,
          a_direction: directionBuffer,
        }
    }

    setViewPort(){
        this.gl.viewport( 0, 0, this.gl.canvas.width , this.gl.canvas.height )
        this.gl.uniform2f(this.uniformLocations.u_windowSize, this.gl.canvas.width, this.gl.canvas.height )
    }
  
    createElement( params: IElementParams['I_IMAGE'] ): IElements['I_IMAGE'] {
        const handle: UpdateHandle = { 
            updatePosition: this.updatePosition,
            updateImg: this.updateImage,
            updateColor: this.updateColor,
            updateZindex: this.updateZindex,
            updateScale: this.updateScale,
            updateRotation: this.updateRotation,
            updateSize: this.updateSize,
            updateOffset: this.updateOffset,
        }
        if(this.elementPool.size <=0) {

            const el =  new Iimage(handle)
            el.elementIndex = this.elementList.length
            this.elementList.push(el)
            this.updateZindex()
            el.setPosition(params.position.x, params.position.y)
            el.setImgId(params.imgId)
            const { r, g, b, a } = params.color|| WHITE
            el.setColor( r, g, b, a )
            el.setRotation(0)
            el.setScale(1,1)
            const { w, h } = this.textureManager.getImageInfo(el.imgId)
            el.setTextureSize(w, h)
            el.setSize(w, h)
            return el

        }else{

            const el = Array.from(this.elementPool)[0]
            this.elementPool.delete(el)
            el.color.r =255
            el.color.g = 255
            el.color.b = 255
            el.color.a = 1
            for (let attr in params){
                (el as any)[attr] = params
            }
            this.elementList.push(el)
            this.updateZindex()
            this.updatePosition(el.elementIndex, el.position)
            this.updateImage(el.elementIndex, el.imgId)
            this.updateColor(el.elementIndex, el.color)
            el.setScale(1,1)
            const { w, h } = this.textureManager.getImageInfo(el.imgId)
            el.setTextureSize(w, h)
            el.setSize(w, h)
            return el as IElements['I_IMAGE']
        }
      
    }
    private updatePosition: UpdateHandle['updatePosition'] = (elementIndex, position ) => {

        const startIndex = elementIndex  * 2
        this.attrData.a_position[startIndex ] = position.x
        this.attrData.a_position[startIndex + OFFEST1] = position.y


        this.positionBufferChanged = true
        this.update()
    }

    destoryElement(ele: Ielement){
        const ind = this.elementList.findIndex(el => el === ele)
        if(ind > -1){
           const [deleted] =  this.elementList.splice(ind, 1)
           this.elementPool.add(deleted)
           deleted.position.x = Number.MIN_VALUE 
           deleted.position.y = Number.MIN_VALUE
        }
    }

    loadImg( imgs: HTMLCanvasElement|HTMLImageElement ): number {
      const ids = this.textureManager.setImage(imgs)
      this.textureChange = true
      return ids
    }
    
    private update = () => {
        if(this.rafing === true) return 
        this.rafing = true
        requestAnimationFrame(this.updateImidiatly)
    }

    private updateImage: UpdateHandle['updateImg'] = (elementIndex, imgId) => {

        const startIndex = elementIndex * 2

        const { x, y } = this.textureManager.getImageInfo(imgId)

        this.attrData.a_texCoord[startIndex] = x
        this.attrData.a_texCoord[startIndex + 1] = y

        this.imageIdBufferChanged = true
        this.update()
    }
  
    private updateColor: UpdateHandle['updateColor']=(elementIndex, color) => {

        const startIndex = elementIndex * 4
       
        const a = color.a * 255
        this.attrData.a_color[startIndex] = color.r
        this.attrData.a_color[startIndex + OFFEST1] = color.g
        this.attrData.a_color[startIndex + OFFEST2] = color.b
        this.attrData.a_color[startIndex + OFFEST3] = a

        this.colorBufferChanged = true
        this.update()
    }

    private updateScale: UpdateHandle['updateScale'] = (elementIndex, scale) => {

      const startIndex = elementIndex * 2
      const {x, y} = scale

      this.attrData.a_scale[startIndex] = x
      this.attrData.a_scale[startIndex + 1] = y

      this.scaleChange = true
      this.update()
    }

    private updateRotation: UpdateHandle['updateRotation'] = (elementIndex, rotation) => {
      const startIndex = elementIndex * 1

      this.attrData.a_rotation[startIndex] = rotation

      this.rotationChange = true
      this.update()

    }

    private updateSize: UpdateHandle['updateSize'] = (elementIndex, { x: w, y:h }) => {

      const startIndex = elementIndex  *2
      
      this.attrData.a_spriteSize[startIndex] = w
      this.attrData.a_spriteSize[startIndex + 1] = h

      this.sizeChanged = true
      this.update()

    }

    private updateOffset: UpdateHandle['updateOffset'] = () => {

    }

    private handleZindexChange() {
      if(this.zIndexChange) {

        this.elementList.sort((el1, el2) =>  el1.zIndex - el2.zIndex)
        this.elementList.forEach((el, index) => {
          if(index !==el.elementIndex) {
            el.elementIndex = index
            this.updatePosition(index, el.position)
            this.updateImage(index, el.imgId)
            this.updateColor(index, el.color)
          }
        })
        this.zIndexChange = false
      }
    }

    private updateZindex: UpdateHandle['updateZindex'] = () => {
      this.zIndexChange = true
    }

  }

