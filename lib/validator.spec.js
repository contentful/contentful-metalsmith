import test from 'ava'
import validator from './validator'

test('Validator.validateFile - it should throw when id and template are set', t => {
  t.throws(
    _ => validator.validateFile({ contentful: { entry_id: 1, entry_template: 'foo' } })
  )
})

test('Validator.validateFile - it should not throw when id,template or none are set', t => {
  t.notThrows(
    _ => validator.validateFile({ contentful: { entry_template: 'foo' } })
  )

  t.notThrows(
    _ => validator.validateFile({ contentful: { entry_id: 1 } })
  )

  t.notThrows(
    _ => validator.validateFile({ contentful: {} })
  )
})

test('Validator.validateFileAndOptions - it should throw when no space id is set', t => {
  t.throws(
    _ => validator.validateFileAndOptions({}, {})
  )
})

test('Validator.validateFileAndOptions - it should not throw when space id is set', t => {
  t.notThrows(
    _ => validator.validateFileAndOptions({ contentful: { space_id: 1, access_token: 2 } }, {})
  )

  t.notThrows(
    _ => validator.validateFileAndOptions({ contentful: { access_token: 2 } }, { space_id: 1 })
  )
})

test('Validator.validateFileAndOptions - it should throw when no access_token is set', t => {
  t.throws(
    _ => validator.validateFileAndOptions({ contentful: { space_id: 1 } }, {})
  )
})

test('Validator.validateFileAndOptions - it should not throw when an access token is set', t => {
  t.notThrows(
    _ => validator.validateFileAndOptions({ contentful: { access_token: 1, space_id: 2 } }, {})
  )

  t.notThrows(
    _ => validator.validateFileAndOptions({ contentful: { space_id: 2 } }, { access_token: 1 })
  )
})

test('Validator.validateFileNameForEntry - it should throw when pattern is found and global options is set', t => {
  t.throws(
    _ => validator.validateFileNameForEntry(
      'foo__bar__baz',
      {},
      /__bar__/,
      { throw_errors: true }
    )
  )
})

test('Validator.validateFileNameForEntry - it should not throw when pattern is not found or global option is not set', t => {
  t.notThrows(
    _ => validator.validateFileNameForEntry(
      'foo__bar__baz',
      { sys: { id: 123 } },
      /___bara___/,
      { throw_errors: true }
    )
  )

  t.notThrows(
    _ => validator.validateFileNameForEntry(
      'foo__bar__baz',
      { sys: { id: 123 } },
      /__bar__/,
      { throw_errors: false }
    )
  )
})

test('Validator.validateSingleEntryForFile - it should throw when entry is undefined', t => {
  t.throws(
    _ => validator.validateSingleEntryForFile(undefined, {})
  )
})

test('Validator.validateSingleEntryForFile - it should not throw when entry is defined', t => {
  t.notThrows(
    _ => validator.validateSingleEntryForFile({}, {})
  )
})
