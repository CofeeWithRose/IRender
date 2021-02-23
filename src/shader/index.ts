export const VERTEX_SHADER = `
    precision mediump float;
    
    #define PI 3.14159265358979323846264338327950288

    // gl窗口大小.
    uniform vec2 u_windowSize;

    uniform vec2 u_cameraPosition;

    uniform vec2 u_cameraSize;

    // 纹理大小.
    uniform vec2 u_textureSize;

    // 实际品目坐标.
    attribute vec2 a_position;

    attribute vec2 a_direction;

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

      return y >= 0.0? (atan(y/x) + PI) : (atan(y/x) - PI);
    }


    vec2 rotateVec2 (float rad, vec2 center, vec2 point) {

      float dist = distance(point, center);
      float xd = ( point.x - center.x )/dist;
      float yd = ( point.y - center.y )/dist;
      float angle = rad + atant2( point.y - center.y, point.x - center.x ); 
      return center + vec2( cos(angle) * dist, sin(angle) * dist );
    }

    void main() {

        v_color = a_color;

        vec2 spriteSize = a_spriteSize * a_scale;


        vec2 center = a_position;

        vec2 direction = a_direction;

        vec2 texCoord = a_texCoord + direction * a_spriteSize;

        v_texCoord =  (texCoord + a_offset )/u_textureSize;

        vec2 position = center + (direction * spriteSize -  0.5 * spriteSize);

        float rotation = radians(a_rotation);

        /**
         *  P1 ++++++ P3
         *  +         +
         *  +         +
         *  P2 ++++++ P4
         * 
         *  P1 -> P2 -> P3
         *  P3 -> P2 -> P4
        */
        vec2 positionScale = u_windowSize/u_cameraSize;
        vec2 canvasPosition = (rotateVec2( rotation, center, position) - u_cameraPosition) * positionScale;
        gl_Position = vec4( (canvasPosition/u_windowSize *2.0 -1.0) * vec2(1, -1), 1, 1 );

    }
`

export const FRAGMENT_SHADER =`
    precision mediump float;

    uniform sampler2D u_image;

    varying vec2 v_texCoord;

    varying vec4 v_color;

    void main(){
        vec4 textColor = texture2D(u_image, v_texCoord);
        gl_FragColor = textColor * vec4( v_color.r, v_color.g, v_color.b, 1 ) * v_color.a; 
    }
`