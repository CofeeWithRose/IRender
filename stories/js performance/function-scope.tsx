import React, { useState } from 'react'


function create() {
    let a = { val: 0 }

    return {
        function1(){
            a.val++
            console.log('function1',a.val);
        }
    }
}

let { function1 } = create()


export const FunctionScope = () => {

    const [ s, setState ] = useState(100)
    console.log('update');
    
    return <div>
        <button onClick={() => setState(m => m+1)}> update </button>
        <br/>
        <button onClick={() => { 
            const i = create()
            function1 = i.function1
        }} >
            update functions
        </button>
        <br/>
        <button onClick={function1} >excute func</button>
    </div>
}