import React, { useCallback, useState } from 'react'


const SMALL_PROPERTIES = Array.from({length: 19}).map( (_, ind) => String.fromCharCode('a'.charCodeAt(0) + ind) )

const LARGE_PROPERTIES = Array.from({length: 20}).map( (_, ind) => String.fromCharCode('a'.charCodeAt(0) + ind) )

function createSmallOrderProperty() {
    const properties = [...SMALL_PROPERTIES]
    const obj: any = {}
    properties.forEach((v) => { obj[v] = Math.ceil(Math.random() * 100)})
    return obj
}

function createSmallRandomProperty() {
    const properties = [...SMALL_PROPERTIES]
    const obj: any = {}
     while(properties.length) { 
        const keyIndex = Math.floor( Math.random() * properties.length )
        const v = properties[keyIndex]
        properties.splice(keyIndex, 1)
        obj[v] = properties.length
    }
    return obj
}

function createLargeOrderProperty() {
    const properties = [...LARGE_PROPERTIES]
    const obj: any = {}
    properties.forEach((v) => { obj[v] = Math.ceil(Math.random() * 100)})
    return obj
}

function createLargeRandomProperty() {
    const properties = [...LARGE_PROPERTIES]
    const obj: any = {}
     while(properties.length) { 
        const keyIndex = Math.floor( Math.random() * properties.length )
        const v = properties[keyIndex]
        properties.splice(keyIndex, 1)
        obj[v] = properties.length
    }
    return obj
}

const orderSmallObjList: any[] = []
const randomSmallObjList: any[] = []

const orderLargeObjList: any[] = []
const randomLargeObjList: any[] = []

for(let i = 0; i< 40000; i++) {
    orderSmallObjList.push(createSmallOrderProperty())
    randomSmallObjList.push(createSmallRandomProperty())

    orderLargeObjList.push(createLargeOrderProperty())
    randomLargeObjList.push(createLargeRandomProperty())
}

let t = 0
function accessProperty(obj: any) {
    t = obj.a
    t = obj.b
    t = obj.c
    t = obj.d
}

function foreachSmallOrderPropertyObj (){
    // console.time('foreachSmallOrderPropertyObj')
    orderSmallObjList.forEach(accessProperty)
    // console.timeEnd('foreachSmallOrderPropertyObj')
}

function foreachSmallRandomProperty (){
    // console.time('foreachSmallRandomProperty')
    randomSmallObjList.forEach(accessProperty)
    // console.timeEnd('foreachSmallRandomProperty')
}


function foreachLargeOrderPropertyObj (){
    // console.time('foreachLargeOrderPropertyObj')
    orderLargeObjList.forEach(accessProperty)
    // console.timeEnd('foreachLargeOrderPropertyObj')
}

function foreachLargeRandomProperty (){
    // console.time('foreachLargeRandomProperty')
    randomLargeObjList.forEach(accessProperty)
    // console.timeEnd('foreachLargeRandomProperty')
}




/**
 * 对比乱序属性创建对象， 按顺序属性创建对象.
 * @returns 
 */
export function PropertyAccess() {

    const [ time, setTime ] = useState(0)

    const test = useCallback((fun: Function) => {
        const n = performance.now()
        fun()
        setTime( Math.round(performance.now() -n))
    }, [])
    
    return <div>
        <h1>js object property access performance test</h1>
       
        <p>
            <pre dangerouslySetInnerHTML={{
                __html:`
                const SMALL_PROPERTIES = Array.from({length: 19}).map( (_, ind) => String.fromCharCode('a'.charCodeAt(0) + ind) )
                const LARGE_PROPERTIES = Array.from({length: 20}).map( (_, ind) => String.fromCharCode('a'.charCodeAt(0) + ind) )
                `
            }}/>

            <pre dangerouslySetInnerHTML={{
                __html:`
                function createSmallOrderProperty() {
                    const properties = [...SMALL_PROPERTIES]
                    const obj = {}
                    properties.forEach((v) => { obj[v] = Math.ceil(Math.random() * 100)})
                    return obj
                }`
            }}/>        
            
            <button onClick={() =>console.log(createSmallOrderProperty())} >log smallOrderProperty</button>

            <pre dangerouslySetInnerHTML={{
                __html:`
                function createSmallRandomProperty() {
                    const properties = [...SMALL_PROPERTIES]
                    const obj = {}
                     while(properties.length) { 
                        const keyIndex = Math.floor( Math.random() * properties.length )
                        const v = properties[keyIndex]
                        properties.splice(keyIndex, 1)
                        obj[v] = properties.length
                    }
                    return obj
                }`
            }}/> 

            <button onClick={() =>console.log(createSmallRandomProperty())} >log smallRandomProperty</button>
            <br/>

            <pre dangerouslySetInnerHTML={{
                __html:`
                function createLargeOrderProperty() {
                    const properties = [...LARGE_PROPERTIES]
                    const obj = {}
                    properties.forEach((v) => { obj[v] = Math.ceil(Math.random() * 100)})
                    return obj
                }`
            }}/> 
            <button onClick={() =>console.log(createLargeOrderProperty())} >log largeOrderProperty</button>

            <pre dangerouslySetInnerHTML={{
                __html:`
                function createLargeRandomProperty() {
                    const properties = [...LARGE_PROPERTIES]
                    const obj = {}
                     while(properties.length) { 
                        const keyIndex = Math.floor( Math.random() * properties.length )
                        const v = properties[keyIndex]
                        properties.splice(keyIndex, 1)
                        obj[v] = properties.length
                    }
                    return obj
                }`
            }}/> 
            <button onClick={() =>console.log(createLargeRandomProperty())} >log largeRandomProperty</button>
        </p>
        <pre
            dangerouslySetInnerHTML={{__html: `
            let t = 0
            function accessProperty(obj: any) {
                t = obj.a
                t = obj.b
                t = obj.c
                t = obj.d
            }

            function foreachSmallOrderPropertyObj (){
                // console.time('foreachSmallOrderPropertyObj')
                orderSmallObjList.forEach(accessProperty)
                // console.timeEnd('foreachSmallOrderPropertyObj')
            }

            function foreachSmallRandomProperty (){
                // console.time('foreachSmallRandomProperty')
                randomSmallObjList.forEach(accessProperty)
                // console.timeEnd('foreachSmallRandomProperty')
            }


            function foreachLargeOrderPropertyObj (){
                // console.time('foreachLargeOrderPropertyObj')
                orderLargeObjList.forEach(accessProperty)
                // console.timeEnd('foreachLargeOrderPropertyObj')
            }

            function foreachLargeRandomProperty (){
                // console.time('foreachLargeRandomProperty')
                randomLargeObjList.forEach(accessProperty)
                // console.timeEnd('foreachLargeRandomProperty')
            }
            `}}
        />
        <h3 > result: {time} ms </h3>
        <p>
            <button onClick={() => test(foreachSmallOrderPropertyObj)} >foreach small OrderProperty</button>
            <button onClick={() => test(foreachSmallRandomProperty)} >foreach small RandomProperty</button>
        </p>


        <p>
            <button onClick={() => test(foreachLargeOrderPropertyObj)} >foreach large OrderProperty</button>
            <button onClick={() => test(foreachLargeRandomProperty)} >foreach large RandomProperty</button>
        </p>
       

    </div>
}



