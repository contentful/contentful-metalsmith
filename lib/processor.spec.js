import test from 'ava'
import proxyquire from 'proxyquire'
import contentful from 'contentful'

test('processor.processFile - return the initial file when no contentful meta is set', t => {
  const processor = proxyquire(
    './processor',
    {
      contentful
    }
  )

  const file = {}

  t.is(processor.processFile(file), true)
})

test.cb('processor.processFile - call entries with correct properties coming from file meta', t => {
  const processor = proxyquire(
    './processor',
    {
      contentful: {
        createClient: function (options) {
          t.is(options.accessToken, 'bar')
          t.is(options.host, 'baz')
          t.is(options.space, 'foo')

          t.end()

          return {
            getEntries: function () {
              return new Promise(resolve => resolve({items: []}))
            }
          }
        }
      }
    }
  )

  processor.processFile({
    contentful: {
      host: 'baz',
      space_id: 'foo'
    }
  }, {
    access_token: 'bar'
  })
})

test('processor.processFile - call entries with correct properties coming from global settings', t => {
  const processor = proxyquire(
    './processor',
    {
      contentful: {
        createClient: function (options) {
          t.is(options.accessToken, 'global-bar')
          t.is(options.host, 'global-baz')
          t.is(options.space, 'global-foo')

          return {
            getEntries: function () {
              return new Promise(resolve => resolve({items: []}))
            }
          }
        }
      }
    }
  )

  return processor.processFile({
    contentful: {}
  }, {
    access_token: 'global-bar',
    host: 'global-baz',
    space_id: 'global-foo'
  })
})

test('processor.processFile - resolves correctly for a single entry', t => {
  const entryToBeReturned = {
    sys: {
      id: 'bazinga',
      contentType: {
        sys: {
          id: 'boing'
        }
      }
    },
    fields: {
      name: 'John Doe'
    }
  }

  const processor = proxyquire(
    './processor',
    {
      contentful: {
        createClient: function () {
          return {
            getEntries: function () {
              return new Promise(resolve => resolve({items: [ entryToBeReturned ]}))
            }
          }
        }
      }
    }
  )

  return processor.processFile({
    contentful: {
      entry_id: '123456789'
    },
    _fileName: 'awesome-file.html'
  }, {
    access_token: 'global-bar',
    host: 'global-baz',
    space_id: 'global-foo'
  }).then(fileMap => {
    t.is(typeof fileMap['awesome-file.html'], 'object')
    t.is(fileMap['awesome-file.html'].data, entryToBeReturned)
  })
})

test('processor.processFile - resolves correctly for multiple entries', t => {
  const entriesToBeReturned = [
    {
      sys: {
        id: 'bazinga',
        contentType: {
          sys: {
            id: 'boing'
          }
        }
      },
      fields: {
        name: 'John Doe'
      }
    },
    {
      sys: {
        id: 'badabum',
        contentType: {
          sys: {
            id: 'kazum'
          }
        }
      },
      fields: {
        name: 'Jane Doe'
      }
    }
  ]

  const processor = proxyquire(
    './processor',
    {
      contentful: {
        createClient: function () {
          return {
            getEntries: function () {
              return new Promise(resolve => resolve({items: entriesToBeReturned}))
            }
          }
        }
      }
    }
  )

  /* eslint-disable no-template-curly-in-string */
  return processor.processFile({
    contentful: {
      content_type: 'article',
      entry_filename_pattern: 'article/${ fields.name }',
      entry_template: 'template.html'

    },
    _fileName: 'awesome-file.html'
  }, {
    access_token: 'global-bar',
    host: 'global-baz',
    space_id: 'global-foo',
    metadata: {
      global: 'meta'
    }
  }).then(fileMap => {
    t.deepEqual(
      fileMap['article/john-doe.html'],
      {
        contents: '',
        data: entriesToBeReturned[0],
        id: entriesToBeReturned[0].sys.id,
        contentType: 'article',
        layout: 'template.html',
        global: 'meta',
        _fileName: 'article/john-doe.html',
        _parentFileName: 'awesome-file.html'
      }
    )

    t.deepEqual(
      fileMap['article/jane-doe.html'],
      {
        contents: '',
        data: entriesToBeReturned[1],
        id: entriesToBeReturned[1].sys.id,
        contentType: 'article',
        layout: 'template.html',
        global: 'meta',
        _fileName: 'article/jane-doe.html',
        _parentFileName: 'awesome-file.html'
      }
    )
  })
})

test('processor.getCommonContentForSpace - load a set of common content', t => {
  const options = {
    access_token: 'global-bar',
    host: 'global-baz',
    space_id: 'global-foo',
    common: {
      doublets: {
        filter: 'mulledwine'
      }
    }
  }

  const entriesToBeReturned = [
    {
      sys: {
        id: 'bazinga',
        contentType: {
          sys: {
            id: 'boing'
          }
        }
      },
      fields: {
        name: 'John Doe'
      }
    },
    {
      sys: {
        id: 'badabum',
        contentType: {
          sys: {
            id: 'kazum'
          }
        }
      },
      fields: {
        name: 'Jane Doe'
      }
    }
  ]

  const processor = proxyquire(
    './processor',
    {
      contentful: {
        createClient: function () {
          return {
            getEntries: function () {
              return new Promise(resolve => resolve({items: entriesToBeReturned}))
            }
          }
        }
      }
    }
  )

  processor.processFile({ contentful: {}, _fileName: 'turnip.html' }, options)
  .then(fileMap => {
    t.is(fileMap['turnip.html'].common.doublets, entriesToBeReturned)
  })
})

test.cb('processor.createFilesFromEntries - create new files from global options', t => {
  const options = {
    access_token: 'global-bar',
    host: 'global-baz',
    space_id: 'global-foo',
    entry_key: '_key',
    entry_extension: 'md',
    contentful: {
      entry_id: 'A96usFSlY4G0W4kwAqswk'
    }
  }

  const entriesToBeReturned = [
    {
      sys: {
        id: 'A96usFSlY4G0W4kwAqswk',
        contentType: {
          sys: {
            id: 'boing'
          }
        }
      },
      fields: {
        name: 'John Doe',
        _key: 'pages/index',
        layout: 'home.html',
        contents: 'Home Page Content'
      }
    }
  ]

  const processor = proxyquire(
    './processor',
    {
      contentful: {
        createClient: function () {
          return {
            getEntries: function () {
              return new Promise(resolve => resolve({items: entriesToBeReturned}))
            }
          }
        }
      }
    }
  )

  processor.createFilesFromEntries(options)
    .then(fileMap => {
      // add the correct file name
      t.is(typeof fileMap['pages/index.md'], 'object')
      t.is(fileMap['pages/index.md'].layout, 'home.html')
      t.is(fileMap['pages/index.md'].contents.toString(), 'Home Page Content')

      t.end()
    })
})
