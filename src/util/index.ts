export enum SHADER_TYPE {
    VERTEX_SHADER='VERTEX_SHADER',
    FRAGMENT_SHADER='FRAGMENT_SHADER',
  }
  
export  type SHADER_TYPE_MAP = {[ key in SHADER_TYPE]: number}

export  function compileShader(
    gl: WebGLRenderingContext, 
    program: WebGLProgram,
    source: string, 
    type: SHADER_TYPE
  ): WebGLShader {
    const map: SHADER_TYPE_MAP= {
      [SHADER_TYPE.VERTEX_SHADER]: gl.VERTEX_SHADER,
      [SHADER_TYPE.FRAGMENT_SHADER]: gl.FRAGMENT_SHADER,
    }
    const shader = gl.createShader(map[type])
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    console.log('compile shader success:', gl.getShaderParameter(shader, gl.COMPILE_STATUS) )
    console.log('compile log', gl.getShaderInfoLog(shader))
    gl.attachShader(program, shader)
    return shader
  }