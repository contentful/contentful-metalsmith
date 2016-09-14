import test from 'ava'
import util from './util'

test('util.getEntriesQuery - it should set content_type properly', t => {
  let query = util.getEntriesQuery({})
  t.is(query.content_type, undefined)

  query = util.getEntriesQuery({ content_type: '*' })
  t.is(query.content_type, undefined)

  query = util.getEntriesQuery({ content_type: 'foo' })
  t.is(query.content_type, 'foo')
})

test('util.getEntriesQuery - it should set sys.id properly', t => {
  let query = util.getEntriesQuery({ entry_id: 'bar' })
  t.is(query['sys.id'], 'bar')
})

test('util.getEntriesQuery - it should set given properties properly', t => {
  let query = util.getEntriesQuery({ limit: 10 })
  t.is(query.limit, 10)

  query = util.getEntriesQuery({ filter: { foo: 'bar' } })
  t.is(query.foo, 'bar')

  query = util.getEntriesQuery({ order: 'ASC' })
  t.is(query.order, 'ASC')
})

test('util.getEntriesQuery - it should replace KEYWORD with the result of a function KEYWORD as defined in options.filterTransforms', t => {
  const aCertainNow = new Date().toISOString()

  let query = util.getEntriesQuery({ filter: { 'startdate[gt]': '__NOW__' } }, {
    __NOW__() {
      return aCertainNow
    }
  })

  t.is(query['startdate[gt]'], aCertainNow, 'filterTransforms correctly applied')
})

test('util.getFileName - should use the correct defaults', t => {
  const fileName = util.getFileName(
    {
      sys: {
        contentType: {
          sys: {
            id: 'foo'
          }
        },
        id: 'bar'
      }
    }
  )

  t.is(fileName, 'foo-bar.html')
  t.pass()
})

test('util.getFileName - should handle pattern correctly', t => {
  /* eslint-disable no-template-curly-in-string */
  const fileName = util.getFileName(
    {
      sys: {
        contentType: {
          sys: {
            id: 'foo'
          }
        },
        id: 'bar'
      },
      fields: {
        title: 'baz',
        author: {
          name: 'boing'
        }
      }
    },
    {
      entry_filename_pattern: '${sys.id}/${fields.author.name}-${fields.title}'
    }
  )

  t.is(fileName, 'bar/boing-baz.html')
  t.pass()
})

test('util.getFileName - should handle pattern and permalinks correctly', t => {
  /* eslint-disable no-template-curly-in-string */
  const fileName = util.getFileName(
    {
      sys: {
        contentType: {
          sys: {
            id: 'foo'
          }
        },
        id: 'bar'
      },
      fields: {
        title: 'baz',
        author: {
          name: 'boing'
        }
      }
    },
    {
      entry_filename_pattern: '${sys.id}/${fields.author.name}-${fields.title}',
      create_permalinks: true
    }
  )

  t.is(fileName, 'bar/boing-baz/index.html')
  t.pass()
})

test('util.getFileName - should handle extensions correctly', t => {
  /* eslint-disable no-template-curly-in-string */
  const fileName = util.getFileName(
    {
      sys: {
        contentType: {
          sys: {
            id: 'foo'
          }
        },
        id: 'foo'
      },
      fields: {
        title: 'bar'
      }
    },
    {
      entry_template: 'something.crazy',
      entry_filename_pattern: '${sys.id}/${fields.title}',
      use_template_extension: true
    }
  )

  t.is(fileName, 'foo/bar.crazy')
  t.pass()
})

test('util.getFileName - should set notFound key', t => {
  /* eslint-disable no-template-curly-in-string */
  const fileName = util.getFileName(
    {
      sys: {
        contentType: {
          sys: {
            id: 'foo'
          }
        },
        id: 'foo'
      },
      fields: {}
    },
    {
      entry_filename_pattern: '${sys.id}/${fields.notFound}'
    }
  )

  t.is(fileName, 'foo/__not-available__.html')
  t.pass()
})
