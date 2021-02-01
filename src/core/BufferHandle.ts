export class BufferHandle {

  data: ArrayBuffer

  protected attrLocation: number

  public changed = true

  constructor( 
    protected gl: WebGLRenderingContext,
    program: WebGLProgram, 
    bufferType: typeof ArrayBuffer, 
    bufferLength: number,
    private attrSize: number, 
    attrType: number,
    normalized =false,
  ){
    // this.data = new Float32Array(this.options.maxNumber * POINT_NUMBER * 3 ),
    this.data = new bufferType(bufferLength);

    this.attrLocation = gl.getAttribLocation(program, 'a_position')

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STREAM_DRAW )
    gl.enableVertexAttribArray(this.attrLocation)
    // gl.vertexAttribPointer(this.attrLocation, 3, gl.FLOAT, false, 0,0)
    gl.vertexAttribPointer(this.attrLocation, this.attrSize, attrType, normalized, 0,0)
  }

  bufferData() {
    this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.attrLocation )
    this.gl.bufferSubData( this.gl.ARRAY_BUFFER, 0, this.data )
    this.changed = false
  }

  // bufferData( this.gl.ARRAY_BUFFER, this.attrBuffer.a_position, this.attrData.a_position)

}
