export class Cache<K, V> {

    protected map = new Map<K,V>()

    protected countMap = new Map<K, number>()

    constructor( 
        protected size: number = 100
    ){}

    set(key: K, val:V) {
        
        if(this.map.size >= this.size) {
            this.map.clear()
        }
        this.map.set(key, val)
    }

    get(key: K) {
        return this.map.get(key)
    }
}