import React from 'react'
import { Sort1, Sort2 } from './sort';

/**
 * js performance test.
 */
export default {
    title: 'Js Test',
    component: JsTest,
};

export function JsTest(){
    return <p>
        js 性能测试.
    </p>
}

export {PropertyAccess} from './property-access'
Sort1()
Sort2()