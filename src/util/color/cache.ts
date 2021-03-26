export class Cache<V> {

    protected map = {}

    protected countMap = new Map<string, number>()

    constructor( 
        protected size: number = 100
    ){}

    set(key: string, val:V) {
        
        // if(this.map.size >= this.size) {
        //     this.map.clear()
        // }
        // this.map.set(key, val)

        this.map[key] = val
    }

    get(key: string) {
        // return this.map.get(key)
        return this.map[key]
    }
}