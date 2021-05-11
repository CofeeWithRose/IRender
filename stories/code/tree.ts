
export function limitAsync(fun: (...param: any) => Promise<any>, limit: number) {
    const tasks: (() => Promise<void>)[] = []
    let activeCount = 0

    const runTask = async () => {
       
        
        if(activeCount >= limit) return
        const task = tasks.shift()
        if(task) {
            activeCount++
            try {
              console.log('activeCount', activeCount);
              await task()
            } catch (error) {}
            activeCount--
            runTask()
        }
    }

    return async (...param: any): Promise<any> => {
        const promise =  new Promise( (resolve, reject) => {
            tasks.push( async () => {
               try {
                resolve(await fun(param))
               } catch (error) {
                   reject(error)
               }
            })
        })
        runTask()
        return promise
    }
}

let count = 0
const asyncFun = async () => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            console.log(count++);
            resolve()
        }, Math.random()*1000)
    })
}

const f = limitAsync(asyncFun, 2)

export const excute2 = () => {
    for (let index = 0; index < 100; index++) {
        f()
    }
}