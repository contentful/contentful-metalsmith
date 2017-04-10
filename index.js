'use strict'

const processor = require('./lib/processor')
const debug = require('debug')('metalsmith-contentful-files')

/**
 * Plugin function
 *
 * @param {Object|undefined} options
 *
 * @return {Function} Function to be used in metalsmith process
 */
function plugin (options) {
  options = options || {}

  /**
   * Function to process all read files by metalsmith
   *
   * @param  {Object}   files      file map
   * @param  {Object}   metalsmith metalsmith
   * @param  {Function} done       success callback
   */
  return function (files, metalsmith, done) {
    options.metadata = metalsmith.metadata()

    debug('Files before processing:')
    debug(files)

    return new Promise(resolve => {
      resolve(Object.keys(files))
    })
    .then(fileNames => {
      return Promise.all(
        fileNames.map(fileName => {
          files[fileName]._fileName = fileName

          return processor.processFile(files[fileName], options)
        })
      )
    })
    .then((fileMaps) => {
      fileMaps.forEach(map => {
        Object.assign(files, map)
      })

      debug('Files after processing:')
      debug(files)

      done()
    })
    .catch((error) => {
      // friendly error formatting to give
      // more information in error case by api
      // -> see error.details
      done(
        new Error(`
          ${error.message}
          ${error.details ? JSON.stringify(error.details, null, 2) : ''}
        `)
      )
    })
  }
}

module.exports = plugin
