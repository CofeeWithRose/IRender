import React from 'react'
import { excute } from './compile';
import { excute2 } from './tree';


/**
 * js performance test.
 */
export default {
    title: 'Coding',
    component: Coding,
};

export function Coding() {


    return <pre>{excute()}</pre>
}
excute2()