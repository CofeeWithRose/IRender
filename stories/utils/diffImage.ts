export function diffImage(data1: ImageData, data2: ImageData) {
    const {data: data2d, width} = data1
    const datagl = data2.data
    for(let i=0; i< data2d.length-4; i+=4) {
        let isequle = true
        for(let j = i; j <i+4; j++ ){
            if(data2d[j]!==datagl[j]) {
                isequle = false
                continue;
            }
        }

        if(!isequle){
            const pixNumber = Math.ceil(i/4)
            const position = { 
                x: pixNumber%width +1,
                y: Math.ceil(pixNumber/width)
            }
            
            const color2d = {
                r: data2d[i],
                g: data2d[i+1],
                b: data2d[i+2],
                a: data2d[i+3],
            }
            const colorgl = {
                r: datagl[i],
                g: datagl[i+1],
                b: datagl[i+2],
                a: datagl[i+3],
            }
            console.log('2d:',color2d, 'gl: ',colorgl, 'position', position)
        }
    }
}