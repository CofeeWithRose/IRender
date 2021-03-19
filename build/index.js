const Terser = require('terser')
const  fs = require('fs')
const path = require('path')
// path.resolve(__dirname, '../lib')

function readDir(dirPath) {
    return new Promise(resolve => {
        fs.readdir(dirPath, { encoding: 'utf-8', withFileTypes: true }, (error, files) => {
            resolve(files)
        })
    })
}

async function readDeepDir(dirPath, outFiles){
    console.log(dirPath)
    const files = await readDir(dirPath)
    for(let i=0; i< files.length; i++ ){
        const file = files[i]
        if(file.isDirectory()){
            await readDeepDir(dirPath+ '/'+file.name, outFiles)
         }else{
            outFiles.push(dirPath+ '/'+file.name)
         }
    }
   
    // .map( fileName =>))
}

const getFileList = async (dirPath, reg) => {
    const list = []
    await readDeepDir(dirPath, list)
    return list.filter( fileName => reg.test(fileName) ) 
}

async function readFile(filePath){
   return new Promise(resolve => {
        fs.readFile(filePath, 'utf-8', (error, code) => {
            resolve(code)
        })
    })
}

const minify = async (filePath) => {
    return new Promise(resolve => {
        fs.readFile(filePath, 'utf-8', (error, code) => {
            if(filePath.includes('/shader/')){
                code = code
                .replace(/\/\/((?!\\n).|\s)+\\n/g,'')
                .replace(/\/\*\*((?!\*\/).|\s)+\*\//g, '')
                .replace(/\s\s+/g, '')
            }
            const result = Terser.minify(code, { compress: {drop_console: true} })
            fs.writeFile(filePath, result.code, resolve)
        })
    })
}

const build = async () => {
    const files = await getFileList(path.resolve(__dirname, '../lib/src'), /[^(\.min)].js$/)
    files.forEach(minify)
    // const codes = await Promise.all(files.map( files => readFile(files) )) 
    // const map = {}
    // files.forEach((f, ind) => {
    //     // if(f.includes('/shader/')){
    //     //     codes[ind] = codes[ind].replace(/\s/g, '')
    //     // }
    //     map[f] = codes[ind]
    // })
    // const result = Terser.minify(map,{})
    // console.error(result.error)
    // fs.writeFile(path.resolve(__dirname, '../publish.js'), result.code, () => {
    //     console.log('complete!')
    // })
}
build()
// terser.minify()