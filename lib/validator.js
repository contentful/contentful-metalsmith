'use strict'

/**
 * @param {Object} file file object containing settings
 *
 * @throws Error in case `entry_template` and `entry_id` are
 *         set in the same file
 */
function validateFile (file) {
  if (file.contentful.entry_id && file.contentful.entry_template) {
    throw new Error(`
      'entry_id' and 'entry_template' set in '${file._fileName}'.

      Please set only one of these as these are conflicting.
      For more infos check TODO docs.`)
  }
}

/**
 * @param {Object} file    file object containing settings
 * @param {Object} options options object containing metalsmith settings
 *
 * @throws Error in case no `space_id` is found in file or general settings
 */
function validateFileAndOptions (file, options) {
  let spaceId = file.contentful && file.contentful.space_id
                ? file.contentful.space_id
                : options.space_id

  if (!spaceId) {
    throw new Error(`
      No space id found.

      Please set the space id either in your 'metalsmith.json'

      "plugins": {
        "contentful-metalsmith": {
          "space_id" : "SPACE_ID"
        }
      }

      or in ${file._fileName}

      contentful:
        space_id: SPACE_ID

      You can find it in your contentful app ( https://app.contentful.com/ )
      under 'API -> Content delivery / preview keys'`
    )
  }

  let accessToken = file.contentful && file.contentful.access_token
                    ? file.contentful.access_token
                    : options.access_token

  if (!accessToken) {
    throw new Error(`
      No access token found found.

      Please set the access token either in your 'metalsmith.json'

      "plugins": {
        "contentful-metalsmith": {
          "access_token" : "ACCESS_TOKEN"
        }
      }

      or in ${file._fileName}

      contentful:
        access_token: ACCESS_TOKEN

      You can find it in your contentful app ( https://app.contentful.com/ )
      under 'API -> Content delivery / preview keys'`
    )
  }
}

/**
 * @param {Object} entry fetched entry
 * @param {Object} file  file that included `entry_id`
 *
 * @throws Error in case the fetched entry is undefined
 */
function validateSingleEntryForFile (entry, file) {
  if (!entry) {
    throw new Error(`
      Single entry with id '${file.contentful.entry_id}' defined in ${file._fileName} was not found.`
    )
  }
}

/**
 * @param {Object} fileName evaluated file name
 * @param {Object} entry    entry fetched from contentful
 * @parem {RexExp} regex    RegExp to check for
 * @param {Object} options  global metalsmith options
 *
 * @throws Error in case of detected pattern
 */
function validateFileNameForEntry (fileName, entry, regex, options) {
  if (regex.test(fileName)) {
    if (options.throw_errors) {
      throw new Error(
        `contentful-metalsmith: 'entry_file_pattern' for entry with id '${entry.sys.id}' could not be resolved`
      )
    } else {
      console.warn(
        `contentful-metalsmith: 'entry_file_pattern' for entry with id '${entry.sys.id}' could not be resolved -> falling back to ${fileName}`
      )
    }
  }
}

module.exports = {
  validateFile,
  validateFileAndOptions,
  validateFileNameForEntry,
  validateSingleEntryForFile
}
