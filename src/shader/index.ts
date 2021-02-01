/*
 * @Author: muyin
 * @Date: 2020-12-19 09:44:46
 * @email: muyin.ph@alibaba-inc.com
 */
export const VERTEX_SHADER = `

    #define PI 3.14159265358979323846264338327950288

    // gl窗口大小.
    uniform vec2 u_windowSize;

    // 纹理大小.
    uniform vec2 u_textureSize;

    // 实际品目坐标.
    attribute vec3 a_position;

    attribute vec2 a_texCoord;

    attribute vec2 a_scale;

    attribute vec2 a_spriteSize;

    attribute vec2 a_offset;

    // 单位 deg 0-360;
    attribute float a_rotation;


    attribute vec4 a_color;

    varying vec2 v_texCoord;

    
    varying vec4 v_color;

    float atant2 (float y, float x) {

      if( x > 0.0 ) {
        return atan(y/x);
      }

      if ( x == 0.0 ) {
        return y > 0.0? 0.5 * PI : - 0.5 * PI;
      }

      if ( x < 0.0 ) {
        return y >= 0.0? (atan(y/x) + PI) : (atan(y/x) - PI);
      }
     
    }


    vec2 rotateVec2 (float rad, vec2 center, vec2 point) {

      float dist = distance(point, center);
      float xd = ( point.x - center.x )/dist;
      float yd = ( point.y - center.y )/dist;
      float angle = rad + atant2( point.y - center.y, point.x - center.x ); 
      return center + vec2( cos(angle) * dist, sin(angle) * dist );
    }

    void main() {

        vec2 scale = a_scale;
        
        vec2 spriteSize = a_spriteSize * scale;

        vec2 center = vec2(a_position.x, a_position.y);

        vec2 position = center -  0.5 * spriteSize;
        v_color = vec4( a_color.r, a_color.g, a_color.b, 1 ) * a_color.a;
        
        float dist = distance(position,center);
        float rotation = radians(a_rotation);

        vec2 texCoord = vec2(a_texCoord.x, a_spriteSize.y - a_texCoord.y); 

        /**
         *  P1 ++++++ P2
         *  +         +
         *  +         +
         *  P3 ++++++ P4
        */
        if( a_position.z <= 1.0 ){
            // 第1个点
            gl_Position = vec4((rotateVec2( rotation, center, position)/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
            v_texCoord =  (a_texCoord + a_offset )/u_textureSize;
            return;
        } 
        if( a_position.z <= 2.0  ){
            // 第二个点
            gl_Position = vec4(( rotateVec2( rotation, center,  position + vec2( spriteSize.x, 0 ))/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
            v_texCoord = (a_texCoord + a_offset + vec2( a_spriteSize.x, 0 ))/u_textureSize;
            return;
        }
        if( a_position.z <= 3.0  ){
            // 第3个点
            gl_Position = vec4(( rotateVec2(rotation, center, position + vec2(0, spriteSize.y))/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
            v_texCoord = (a_texCoord + a_offset + vec2(0, a_spriteSize.y))/u_textureSize;
            return;
        }
        if( a_position.z <= 4.0  ){
          // 第4个点
          gl_Position = vec4(( rotateVec2( rotation, center, position + spriteSize )/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
          v_texCoord = (a_texCoord + a_offset + a_spriteSize)/u_textureSize;
          return;
        }
        gl_Position = vec4((position/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
    }
`

export const FRAGMENT_SHADER =`
    precision highp float;

    uniform sampler2D u_image;

    varying vec2 v_texCoord;

    varying vec4 v_color;

    void main(){
        vec4 textColor = texture2D(u_image, v_texCoord);
        gl_FragColor = textColor * v_color;
    }
`