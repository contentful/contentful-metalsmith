# contentful-metalsmith
[![Build Status](https://travis-ci.org/contentful/contentful-metalsmith.svg?branch=master)](https://travis-ci.org/contentful/contentful-metalsmith)
[![Coverage Status](https://coveralls.io/repos/github/contentful-labs/contentful-metalsmith/badge.svg?branch=refactor)](https://coveralls.io/github/contentful-labs/contentful-metalsmith?branch=refactor)

A Metalsmith' plugin to generate files using content from [Contentful](http://www.contentful.com)

## About

This plugin for [metalsmith](http://www.metalsmith.io) allows you to build a static site using the data stored at [Contentful](http://www.contentful.com). It is built on top of the [Contentful JavaScript Client](https://github.com/contentful/contentful.js).

## Example

To get an idea on how this works, you can check out an [example blog site](https://github.com/contentful-labs/contentful-metalsmith-example) which is completely generated using contentful-metalsmith.

## Getting started

### Install

```bash
$ npm install contentful-metalsmith
```

### Configure required globals

When you use metalsmith using the [cli](https://github.com/metalsmith/metalsmith#cli) edit your `metalsmith.json` and add `contentful-metalsmith` in the plugins section.

```javascript
// metalsmith.json

{
  "source": "src",
  "destination": "build",
  "plugins": {
    "contentful-metalsmith": {
      "access_token": "YOUR_CONTENTFUL_ACCESS_TOKEN",
      "space_id": "YOUR_CONTENTFUL_SPACE_ID"
    }
  }
}
```

When you use the [JavaScript Api](https://github.com/metalsmith/metalsmith#api) add `contentful-metalsmith` to the used plugins.

```javascript
metalsmith.source('src')
metalsmith.destination('build')

metalsmith.use(require('contentful-metalsmith')({ 'access_token' : 'YOUR_CONTENTFUL_ACCESS_TOKEN' }))
```

**Global parameters:**

- `access_token`
- `space_id`

You can find the `access_token` and `space_id` in your [app](https://app.contentful.com) at `APIs -> Content delivery API Keys`.

------------------------------

To read more on all global parameters and settings read the [global settings documentation](./docs/global-settings.md).

### Create files based on the files defined in your source folder

We're considering that you use [metalsmith-layouts](https://github.com/superwolff/metalsmith-layouts) for file rendering. That for the `layout` key is used for rendered source files and child templates.

*`source/posts.html`*

```markdown
---
title: metalsmith-contentful file
contentful:
  content_type: post
  entry_filename_pattern: blog/post-${ sys.id }
  entry_template: post.html
layout: posts.html
---

[OPTIONAL CONTENT]
```

*`layouts/posts.html`*

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{{title}}</title>
  <meta name="description" content="No description">
  <meta name="author" content="Contentful">
  <link rel="stylesheet" href="scss/style.css?v=1.0">
</head>
<body>
  <ul>
    <!-- available data fetched from contentful -->
    {{#each data.entries }}
      <li>
        <h2>{{fields.title}}</h2>
        <p>{{fields.description}}</p>
        <p><a href="{{_fileName}}">Read more</a></p>
      </li>
    {{/each}}
    </ul>
    {{contents}}
</body>
</html>
```

*`layouts/post.html`*

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{{data.fields.title}}</title>
  <meta name="description" content="No description">
  <meta name="author" content="Contentful">
  <link rel="stylesheet" href="scss/style.css?v=1.0">
</head>
<body>
  <h1>{{data.fields.title}}<h1>
  <p>{{data.fields.description}}</p>

  {{contents}}
</body>
</html>
```

**This example will**

- render `posts.html` providing data of the entries of content type `post`
- render several single files with the template `post.html` providing the data of a particular post

------------------------------

To read more on source file parameters and settings read the [source file documentation](./docs/source-file-settings.md).

## Debugging

This project uses [debug](https://www.npmjs.com/package/debug) under the hood. If you want to see all debug messages by contentful-metalsmith you can do so by setting a wildcard debug environment variable.

```bash
$ DEBUG=metalsmith-contentful* your command
```

Currently there are two different variables available to give you information about a specific area:

- `metalsmith-contentful-files` - get information about file data before/after processing
- `metalsmith-contentful-queries` - get information about queries and related files

For example if you want to see what files went into the plugin and got out again:

```bash
$ DEBUG=metalsmith-contentful-files your command
```

:point_up: *This debug information is good to validate what data is available in [metalsmith-layouts](https://www.npmjs.com/package/metalsmith-layouts).*

# License

MIT
