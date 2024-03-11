const { pipeline } = require('node:stream/promises')
const fs = require('node:fs')
const crypto = require('node:crypto')
const path = require('node:path')

const filesystemController = () => {
  const read_file = async (data) => {
    const fileName = crypto.randomUUID() + '.' + data.filename.split('.').pop()
    const staticUrl = path.join(process.cwd(), 'images', fileName)

    await pipeline(data.file, fs.createWriteStream(staticUrl))
    return path.join('images', fileName)
  }

  return {
    readFile: async (part) => {
      const pathUrl = await read_file(part)
      return pathUrl
    },
    readFiles: async (parts) => {
      console.log('_______', parts)
      const paths = []
      for await (const part of parts) {
        const url = await read_file(part)
        paths.push(url)
      }

      return paths
    }
  }
}

module.exports = filesystemController
