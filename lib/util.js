'use strict'

const validator = require('./validator')
const pick = require('lodash.pick')
const template = require('lodash.template')
const slug = require('slug-component')

const propertiesToPickEasily = ['locale', 'include', 'limit', 'skip', 'order']
const notFoundKey = '__not-available__'
const notFoundRegex = new RegExp(notFoundKey)

/**
 * Wrapped slug function to return
 * dummy string in case of no value
 *
 * @param {String|undefined} value string to be "slugged"
 *
 * @return {String}                slug or placeholder
 */
function _slug (value) {
  if (value) {
    return slug(value)
  }

  return notFoundKey
}

/**
 * Get entries query
 *
 * @param {Object} options file meta options
 * @param {Object} filterTransforms transformations for filter values
 *
 * @return {Object}        query obejct
 */
function getEntriesQuery (options, filterTransformsOptions) {
  const query = {}

  const filterTransforms = filterTransformsOptions || {}

  if (options.content_type && options.content_type !== '*') {
    query.content_type = options.content_type
  }

  if (options.entry_id) {
    query['sys.id'] = options.entry_id
  }

  if (options.filter) {
    // If a transformation is available for this keyword, apply it.
    for (let key in options.filter) {
      if (typeof filterTransforms[options.filter[key]] === 'function') {
        options.filter[key] = filterTransforms[options.filter[key]]()
      }
    }

    Object.assign(query, options.filter)
  }

  Object.assign(query, pick(options, propertiesToPickEasily))

  return query
}

/**
 * @param {Object} entry   contentful entry
 * @param {Object} options file meta options
 *
 * @return {String} file name
 */
function getFileName (entry, fileOptions, globalOptions) {
  fileOptions = fileOptions || {}
  globalOptions = globalOptions || {}

  // Hand off control if a specified custom filename builder exists.
  if (fileOptions.entry_filename_builder &&
      typeof globalOptions.filenameBuilders[fileOptions.entry_filename_builder] === 'function') {
    return globalOptions.filenameBuilders[fileOptions.entry_filename_builder](entry, fileOptions)
  }

  const extension = fileOptions.use_template_extension
                    ? fileOptions.entry_template.split('.').slice(1).pop()
                    : 'html'

  let renderedPattern = `${entry.sys.contentType.sys.id}-${entry.sys.id}`

  if (fileOptions.entry_filename_pattern) {
    /* eslint-disable no-template-curly-in-string */
    const pattern = fileOptions.entry_filename_pattern.replace(
      /\${\s*?(.*?)\s*?}/g,
      '${_slug($1)}'
    )

    const renderData = Object.assign({ _slug }, entry)
    renderedPattern = template(pattern)(renderData)

    validator.validateFileNameForEntry(renderedPattern, entry, notFoundRegex, globalOptions)
  }

  if (fileOptions.create_permalinks) {
    return `${renderedPattern}/index.${extension}`
  }

  return `${renderedPattern}.${extension}`
}

module.exports = {
  getEntriesQuery,
  getFileName
}
