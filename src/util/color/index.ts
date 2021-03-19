import { RGBA } from "../../Data/RGBA";
import * as KEYWORDS_COLOR from './const'

Object.values(KEYWORDS_COLOR).forEach(v => Object.freeze(v))

export type ColorStr = keyof typeof KEYWORDS_COLOR

export function converColorStr(keywordColor: ColorStr): RGBA| undefined

export function converColorStr(colorStr: string): RGBA| undefined

/**
 * https://www.w3.org/TR/css-color-3/#colorunits
 * 根据css color规范实现color string的解析转换.
 * 
 * @param colorStr 
 * 支持格式,以红色为例：
 * 
 * red
 * 
 * #f00 #ff0000 #f00f  #ff0000ff  
 * 
 * rgb(255,0,0) rgb(300,0,0) rgb(255，-10,0) rgb(110％，0％，0％)
 * 
 * rgba(255,0,0,1)  rgba(100％，0％，0％，1)  rgba(100％，0％，0％，100%)
 *
 *  @returns 解析成功返回 { r:0-255, g: 0-255, b: 0-255, a: 0-1 }, 失败返回undefined.
 */
export function converColorStr(colorStr: ColorStr|string):RGBA|undefined {
    try{
        return converColor(colorStr)
    }catch(e){
        console.warn('fail to convert color' + colorStr)
    }
}



function converColor(colorStr: string):RGBA|undefined {
    
    const str = (colorStr||'').replace(/\s/g, '').toLowerCase()
    
    // key workds color.
    const keywordsColor = KEYWORDS_COLOR[str]
    if(keywordsColor) return keywordsColor
    

    //  #rrggbb | #rgba | #rrggbbaa.
    if(str.startsWith('#')){
        const subStr = str.substr(1)
        if(subStr.length ===3){
            // rgb
            const [r, g, b ] = subStr.split('')
            return { 
                r:  clipColor(parseInt(`${r}${r}`, 16)), 
                g:  clipColor(parseInt(`${g}${g}`, 16)),
                b:  clipColor(parseInt(`${b}${b}`, 16)),
                a:1 
            } 
        }
        if(subStr.length ===4) {
            // rgba
            const [r, g, b, a ] = subStr.split('')
            return { 
                r:  clipColor(parseInt(`${r}${r}`, 16)), 
                g:  clipColor(parseInt(`${g}${g}`, 16)),
                b:  clipColor(parseInt(`${b}${b}`, 16)),
                a:  clipColor(parseInt(`${a}${a}`, 16))/255,
            } 
        }

        if(subStr.length === 6) {
            // rrggbb
            const [r1, r2,  g1, g2 , b1, b2 ] = subStr.split('')
            return { 
                r:  clipColor(parseInt(`${r1}${r2}`, 16)), 
                g:  clipColor(parseInt(`${g1}${g2}`, 16)), 
                b:  clipColor(parseInt(`${b1}${b2}`, 16)), 
                a: 1
            } 
        }

        if(subStr.length === 8) {
            // rrggbbaa
            const [r1, r2,  g1, g2 , b1, b2, a1, a2 ] = subStr.split('')
            return { 
                r:  clipColor(parseInt(`${r1}${r2}`, 16)), 
                g:  clipColor(parseInt(`${g1}${g2}`, 16)), 
                b:  clipColor(parseInt(`${b1}${b2}`, 16)), 
                a: clipColor(parseInt(`${a1}${a2}`, 16))/255, 
            } 
        }
    }

    /**
     * rgba color rgba( r, g, b, a).
     * 
     * em {color：rgb(255,0,0)} / *整数范围0-255 * /
     * em {color：rgba(255,0,0,1)/ *相同，显式不透明度为1 * /
     * em {color：rgb(100％，0％，0％)} / *浮动范围0.0％-100.0％* /
     * em {color：rgba(100％，0％，0％，1)} / *相同，显式不透明度为1 * /
     * 
     */
    if(str.startsWith('rgba')){
        const match = str.match(/\(.*\)/)
        if(match&&match[0]){
            const subStrList = match[0].replace(/\(|\)/g, '').split(',')
            const [r, g, b, a] = subStrList.map((subStr, index) => {
                if(subStr.includes('%')){
                    return clipColor(parseFloat(subStr) * 0.01 * 255)
                }else{
                    return (subStrList.length-1) === index? 
                    clipColor(parseFloat(subStr) * 255 ) : 
                    clipColor(parseFloat(subStr))
                }
            }) 
            return { r, g, b, a: a/255 }
        }
    }
    

    /**
     * rgb color.
     * 
     * em {color：rgb(255,0,0)} / *整数范围0-255 * /
     * em {color：rgb(300,0,0)} / *裁剪为rgb(255,0,0)* /
     * em {color：rgb(255，-10,0)} / *裁剪为rgb(255,0,0)* /
     * em {color：rgb(110％，0％，0％)} / *裁剪为rgb(100％，0％，0％)* /
     */
    if(str.startsWith('rgb')){
        const match = str.match(/\(.*\)/)
        if(match&&match[0]){
            const subStrList = match[0].replace(/\(|\)/g, '').split(',')
            const [r, g, b] = subStrList.map((subStr) => {
                if(subStr.includes('%')){
                    return clipColor(parseFloat(subStr) * 0.01 * 255)
                }else{
                    return clipColor(parseFloat(subStr))
                }
            }) 
            return { r, g, b, a: 1  }
        }
    }
    
    // // hls color.
    // if(str.startsWith('hsl')) {

    // }

}


/**
 *  将数值区间限定在 [0, 255].
 */
function clipColor (value: number) {
    return Math.min(Math.max(0, value), 255)
 }

 