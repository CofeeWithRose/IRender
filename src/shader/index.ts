/*
 * @Author: muyin
 * @Date: 2020-12-19 09:44:46
 * @email: muyin.ph@alibaba-inc.com
 */
export const VERTEX_SHADER = `
    // gl窗口大小.
    uniform vec2 u_windowSize;

    // 纹理大小.
    uniform vec2 u_textureSize;

    // 实际品目坐标.
    attribute vec3 a_position;
    attribute vec2 a_size;
    attribute vec2 a_texCoord;

    attribute vec4 a_color;

    varying vec2 v_texCoord;
    varying vec2 v_end;
    varying vec4 v_color;

    void main() {
        
        
        vec2 position = vec2(a_position.x, a_position.y);
        v_color = a_color;
        v_end = position + a_size;

        if(a_position.z <= 1.0){
            // 第1个点
            gl_Position = vec4((position/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
            v_texCoord = a_texCoord/u_textureSize;
            
            return;
        } 
        if( a_position.z <= 2.0  ){
            // 第二个点
            gl_Position = vec4(( (position + vec2( a_size.x*2.0, 0 ))/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
            v_texCoord = (a_texCoord + vec2( a_size.x*2.0, 0 ))/u_textureSize;
            return;
        }
        if( a_position.z <= 3.0  ){
            // 第3个点
            gl_Position = vec4(( (position + vec2(0, a_size.y*2.0))/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
            v_texCoord = (a_texCoord + vec2(0, a_size.y*2.0))/u_textureSize;
            return;
        }
        
        gl_Position = vec4((position/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
    }
`

export const FRAGMENT_SHADER =`
    precision highp float;

    uniform sampler2D u_image;

    uniform vec2 u_windowSize;

    varying vec2 v_texCoord;
    varying vec2 v_end;
    varying vec4 v_color;


    void main(){
      // gl_PointCoord
        if( 
            (u_windowSize.y - gl_FragCoord.y) > v_end.y || 
            gl_FragCoord.x > v_end.x 
        ) {
            discard;
            return;
        }
        vec4 textColor = texture2D(u_image, v_texCoord);
        // gl_FragColor = v_color;
        gl_FragColor = textColor * v_color;
    }
`