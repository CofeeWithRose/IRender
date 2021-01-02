const Terser = require('terser')
const  fs = require('fs')
const path = require('path')
// path.resolve(__dirname, '../lib')
const getFileList = (dirPath, reg) => {
    return new Promise(resolve => {
        fs.readdir(dirPath, { encoding: 'utf-8', withFileTypes: true }, (error, fileNames) => {
            resolve( 
                fileNames
                .map( fileName =>path.normalize(`${dirPath}/${fileName.name}`))
                .filter( filePath => reg.test(filePath) ) 
            )
        })
    })
}

const minify = async (filePath) => {
    return new Promise(resolve => {
        fs.readFile(filePath, 'utf-8', (error, code) => {
            const result = Terser.minify(code)
            fs.writeFile(filePath, result.code, resolve)
        })
    })
}

const build = async () => {
    const filePaths = await getFileList(path.resolve(__dirname, '../lib'), /[^(\.min)].js$/)
    filePaths.map( async filePath => {
        minify(filePath)
    })
}
build()
// terser.minify()