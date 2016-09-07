# File meta

Contentful-metalsmith enriches the data available in templating with useful metadata.

## `_fileName`

**Which files:** all

Every by contentful-metalsmith rendered file includes this meta information.
This can be convenient when linking to child pages.

```html
<!doctype html>
<html lang="en">
<head></head>
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

## _parentFileName

**Which files:** entry pages of a collection

When rendering a collection page for a given content type and also rendering every entry of this content type the child page for each entry will include this parent file information.
For further information check the [entry_template option](https://github.com/contentful-labs/contentful-metalsmith/blob/master/docs/source-file-settings.md#entry_template-optional).

```html
<!doctype html>
<html lang="en">
<head></head>
<body>
  <main class="l-container">
    <a href="/{{ _parentFileName }}">Go back</a>
  </main>
</body>
</html>