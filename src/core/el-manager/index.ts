import { Iimage } from "../../Ielement/Iimage";
import { LinkedList, ListNode } from "../../util";


export class ElManager {

    private _length = 0   
    
    private imageListArray: LinkedList<Iimage>[] = []

    private changedMinIndex = NaN

    // private elNodeMap = new Map<Iimage, ListNode<Iimage>>()

    get length() {
        return this._length
    }
    protected rewriteElement: (el: Iimage) => void

    constructor(rewriteElement: (el: Iimage) => void){
        this.rewriteElement = rewriteElement
    }

    add(el: Iimage): void {
        const zIndex = el.zIndex
        const node = { value: el }
        el.node = node
        this.addNode(node, zIndex)
        // this.elNodeMap.set(el, node)
        this.changedMinIndex = isNaN(this.changedMinIndex)? zIndex : Math.min(this.changedMinIndex, zIndex)
        this._length++
    }

    remove(el: Iimage): void {
        const node = el.node
        if ( node) {
            this.removeNode(node, el.zIndex)
        }
        const zIndex = el.zIndex
        this.changedMinIndex = isNaN(this.changedMinIndex)? zIndex : Math.min(this.changedMinIndex, zIndex)
        this._length--
    }

    private addNode(node: ListNode<Iimage>, zIndex: number) {
        let list = this.imageListArray[zIndex]
        if(!list){
            this.imageListArray[zIndex] = list = new LinkedList()
        }
        list.add(node)
    }

    private removeNode(node: ListNode<Iimage>, zIndex: number) {
        const list = this.imageListArray[zIndex]
        if (list) {
            list.delete(node)
        }
    }

    updateZindex(el: Iimage, oldZIndex: number): void {
        const node = el.node
        if (node) {
            this.removeNode(node, oldZIndex)
            this.addNode(node, el.zIndex)

            const z = Math.min(oldZIndex, el.zIndex)
            this.changedMinIndex = isNaN(this.changedMinIndex)? z : Math.min(this.changedMinIndex, z)
        }
    }

    updateElementIndex () {
        
        if(!isNaN(this.changedMinIndex)) {
            let curElIndex = 0
            this.imageListArray.forEach( (linedList, index) => {

                if(this.changedMinIndex <= index ) {

                    linedList.forEach( (node, index)  => {
                        curElIndex++
                        const iImage = node.value as Iimage
                        iImage.zIndex = curElIndex
                        this.rewriteElement(iImage)
                    })

                }else {
                    curElIndex+= linedList.length
                }
               
            });
        }
        this.changedMinIndex = NaN
    }




}