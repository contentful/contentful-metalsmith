# Source file settings

Using `contentful-metalsmith` you can render singe or multiple files with your data on Contentful.

## Parameters

### `content_type` *(optional)*

**Render a collection page including multiple entries.**

You can define a `content_type` in your source file. This content type id is base for the depending data fetching.
The collection data will be available in the template under the `data.entries` key.

*`source/posts.html`*

```markdown
---
title: Post overview
contentful:
  content_type: post # id of the given content type
layout: posts.html
---
Your post overview content here
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
      </li>
    {{/each}}
    </ul>
    {{contents}}
</body>
</html>
```

### `entry_template` *(optional)*

**Render a collection page including multiple entries and render every entry using a separate template.**

*`source/posts.html`*

```markdown
---
title: Post overview
contentful:
  content_type: post        # id of the given content type - can refer to a hash
  entry_template: post.html # template found in `layouts` folder
layout: posts.html
---
Your post overview content here
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
        <!-- convenience property _fileName for easy linking -->
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
</body>
</html>
```

*For convenience and making it easier to link to the child files, the `_fileName` property was added to every fetched entry*.

### `entry_filename_pattern` *(optional)*

**Define custom file names for rendered child entries**

`source/posts-with-custom-file-name.html`

```markdown
---
title: test__posts__customFileName
contentful:
  content_type: 2wKn6yEnZewu2SCCkus4as
  entry_filename_pattern: post-${ fields.title }
  entry_template: post.html
layout: posts.html
---
POSTS-CONTENT-CUSTOM-FILENAME
```

Using `entry_filename_pattern` you can define what the file names of the entries should be. You can use `${}` notation to access any property of the given entry.

**Whatever you choose will be "slugged" using [slug](https://www.npmjs.com/package/slug).**

So you don't have to worry about whitespaces or anything.

E.g.
- `entry_filename_pattern: post-${ fields.title }`
- `entry_filename_pattern: ${ fields.title }-${ sys.id }`

**Default value:** `${sys.contentType.sys.id}-${sys.id}`

### `entry_filename_builder` *(optional)*

**Use a custom function to generate the filename**

`source/posts-that-need-fancy-filenames.html`

```markdown
---
title: test__posts__filenameBuilder
contentful:
  content_type: 2wKn6yEnZewu2SCCkus4as
  entry_filename_builder: aldente
  entry_template: post.html
layout: posts.html
---
POSTS-CONTENT-FILENAME-BUILDER
```

In your global configuration, define an object `filenameBuilders` with a property named to match `entity_filename_builder` with a function as its value. This function will be called with the arguments `entry` (the entry being processed) and `fileOptions`. Return the desired filename.

Note that a function cannot be specified in the site configuration if it is stored as JSON; rather you will need to invoke Metalsmith programmatically to use this feature.

### `entry_id` *(optional)*

**Render a file based on a single entry**

*`source/single-post.html`*

```markdown
---
title: Single entry to display
contentful:
  entry_id: A96usFSlY4G0W4kwAqswk
layout: single-post.html
---
POST-SINGLE-POST
```

*`layouts/single-post.html`*

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

### `filter` *(optional)*

**Filter the entries before rendering to one or multiple files**

```markdown
---
title: Post overview of entries including "rabbit"
contentful:
  content_type: post
  filter:
    query: 'rabbit'
layout: posts.html
---
Post that include rabbits are...
```

If you want to learn more about the filter syntax, check out the [Content Delivery API documentation](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters).

### `include` *(optional)*

**Retrieval of linked items (maximum of 10 levels)**

```markdown
---
title: Posts with up to 10 levels of linked items retrieved
contentful:
  content_type: post
  include: 10
layout: posts.html
---
posts with retrieved links are...
```

If you want to learn more about retrieval of linked items, check out the [Content Delivery API documentation](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/links).

### `limit` *(optional)*

**Limit the entries before rendering to one or multiple files**

```markdown
---
title: Post overview limited to ten entries
contentful:
  content_type: post
  limit: 10
layout: posts.html
---
10 posts are...
```

If you want to learn more about limits, check out the [Content Delivery API documentation](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/limit).

### `locale` *(optional)*

**Specify the locale used for entries**

```markdown
---
title: Posts in Traditional Chinese Hong Kong
contentful:
  content_type: post
  locale: zh-Hant-HK
layout: posts.html
---
posts in Traditional Chinese Hong Kong are...
```

If you want to learn more about locales, check out the [Content Delivery API documentation](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/localization).

### `order` *(optional)*

**Order the entries before rendering to one or multiple files**

```markdown
---
title: Post overview sorted by creation date
contentful:
  content_type: 2wKn6yEnZewu2SCCkus4as
  order: -sys.createdAt
layout: posts.html
---
The oldest posts are...
```

If you want to learn more about order settings, check out the [Content Delivery API documentation](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/order).

### `use_template_extension` *(optional)*

**Render child entries with template extension of the source file.**

*`source/single-post-with.extension`*

```markdown
---
title: test__posts__extension
contentful:
  content_type: 2wKn6yEnZewu2SCCkus4as
  use_template_extension: true
  entry_template: post.awesome
  foo: bar
layout: posts.html
---
POSTS-CONTENT-EXTENSION
```

This will render several child entry with the set `entry_filename_pattern` and the extension `awesome`.

### `create_permalinks` *(optional)*

**Render directories including an index file with the depending `entry_filename_pattern` e.g. `my/file/path.html` becomes `my/file/path/index.html`.**

*`source/single-post-with-permalinks.html`*

```markdown
---
title: test__posts__permalinks
contentful:
  content_type: 2wKn6yEnZewu2SCCkus4as
  entry_template: post.html
  create_permalinks: true
layout: posts.html
---
POSTS-CONTENT-PERMALINKS
```

### `space_id` & `access_token` *(optional)*

**Overwrite the space id and/or access token for a single file.**

*`source/different-space.html`*

```markdown
---
title: test__posts__from_somewhere_else
contentful:
  space_id: 1qptv5yuwnfh
  access_token: d599954af0e2ae1e3714f69ca9f0812cafc44578c9b5c5e8f87119757ce2b1e3
  content_type: 2wKn6yEnZewu2SCCkus4as
layout: posts.html
---
POSTS-CONTENT-DIFFERENT-SPACE
```

## File meta available in template

Contentful-metalsmith adds some [handy meta information](./file-meta.md) to the data available in data to make the generation of sites even easier.
