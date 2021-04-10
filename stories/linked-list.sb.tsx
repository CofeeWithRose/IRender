import { LinkedList, ListNode } from 'i-render';
import React, { useEffect, useRef, useState } from 'react'
import { Ielement } from '../src/Ielement/Ielement';
import { ConverColorStr } from './color.sb';
import { startFPS, stopFPS } from './fps';
import { loadCircle, loadReact, loadText } from './utils';

export default {
    title: 'Linked List Demo',
    component: LinkedListDemo,
};

let id=0

export function LinkedListDemo(){
    const [ linkedList, setLinkedList ] = useState(new LinkedList<number>())
    

    const add = () => {
        
        linkedList.add({value: id++})
        setLinkedList(linkedList.clone())
    }

    const remove = (node: ListNode<number>) => {
        linkedList.delete(node)
        setLinkedList(linkedList.clone())
    }
    

    return <>
        {
            
            Array.from(linkedList).map(node => <div
                key={node.value}
            >
                <span>{node.value}</span>
                <button onClick={() => remove(node)}>remove</button>
            </div>
            )
        }   
        <button onClick={add} >add</button>
    </>
}