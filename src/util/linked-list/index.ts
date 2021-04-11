import { ListNode } from "./list-node"


export class LinkedList<T> implements ArrayLike<T>{

    protected _length = 0;

    [index: string]: any;

    protected startNode: ListNode<T> = { };


    protected curNode = this.startNode;


    get length(){
        return this._length
    };

    get [Symbol.toStringTag]() {
        return 'LinkedList'
    }


    [Symbol.iterator](): Iterator<ListNode<T>>{
        let curNode: ListNode<T>| undefined = this.startNode.next
        return {
            next: (): IteratorResult<ListNode<T>> => {
                const node = curNode
                curNode = node?.next
                return  {
                    value: node, 
                    done: !node as true,
                }
            }
        }
    }    

    add(newNode: ListNode<T>): ListNode<T> {
        newNode.pre = this.curNode
        this.curNode.next = newNode
        this.curNode = newNode
        this._length++
        return newNode
    }

    clear(): void {
        this.startNode = {}
        this.curNode = this.startNode
        this._length = 0
    }
    
    delete(node: ListNode<T>): void {
        (node.pre as ListNode<T>).next = node.next
        this._length--
        return 
    }
    
    forEach(callbackfn: (node: ListNode<T>, index: number) => void): void{
        let curNode = this.startNode.next
        let index = 0
        while(curNode) {
            callbackfn(curNode, index++)
            curNode = curNode.next
        }
    }

    clone(): LinkedList<T> {
        const cloned = new LinkedList<T>()
        this.forEach(v => {
            cloned.add(v)
        })
        return cloned
    }

}

export type { ListNode } from './list-node'


// const a = new Set<{}>()
// a.delete()