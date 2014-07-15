# contentful-metalsmith

A Metalsmith's plugin to get content from [Contentful](http://www.contentful.com)

## About

This plugin for [metalsmith](http://www.metalsmith.io) allows you to build a static site using the data stored at [Contentful](http://www.contentful.com). This
plugin is built on top of the [Contentful JavaScript Client](https://github.com/contentful/contentful.js).

## TL;DR

1. Install it

  ```javascript
    $ npm install contentful-metalsmith
  ```
2. Configure it (example for [metalsmith CLI](https://github.com/segmentio/metalsmith#cli))

  ```javascript
    $ vim metalsmith.json

    ----

    {
        "source": "src",
        "destination": "build",
        "plugins": {
          ...,
          "contentful-metalsmith": {
              "accessToken" : "YOUR_CONTENTFUL_ACCESS_TOKEN"
          },
          ...
        }
    }
  ```

3. Create a source file

  ```html

    ---
    title: OMG metalsmith-contentful
    contentful:
        space_id: AN_SPACE_ID
    template: entries.html
    ---

    [OPTIONAL CONTENT]
  ```

4. Create the template (handlebarsjs on this case)

  ```html
    <!doctype html>

    <html lang="en">
    <head>
        <meta charset="utf-8">

        <title>Contentful-metalsmith plugin example</title>
        <meta name="description" content="No description">
        <meta name="author" content="Contentful">

    </head>

    <body>

      {{contents}}
          <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Id</th>
                    <th>Updated</th>
                </tr>
              </thead>
              <tbody>
              {{#each contentful.entries}}
                <tr>
                    <td>
                      {{this.data.sys.contentType.sys.id}}
                  </td>
                    <td>
                      {{this.data.sys.id}}
                    </td>
                    <td>
                      {{this.data.sys.updatedAt}}
                    </td>
                </tr>
                {{/each}}
              </tbody>
           </table>
    </body>
  </html>
  ```

5. Enjoy

# Usage

The first thing that you have to do to use this plugin is to install and configure it (see the TL;DR section for that). Once you have done this you can create and setup source files to fetch data from [Contentful](http://www.contentful.com).

## Setup a source file

To fetch data from [Contentful](http://www.contentful.com) you have to include some extra metadata in a metalsmith source file. The available configuration parameters are the following:

* `space_id` (**required**), the id of the space from where you want to get entries.
* `entry_template` (optional), the template that will be used to render each individual entry.
* `filter` (optional), this parameter has to include some of the [filtering options](https://www.contentful.com/developers/documentation/content-delivery-api/http/#search) offered by the [Contentful's Content Delivery API](https://www.contentful.com/developers/documentation/content-delivery-api/).

All this parameters have to be nested under the key `contentful`.


An example:

```yaml

  ---
  title: OMG metalsmith-contentful
  contentful:
    space_id: cfexampleapi
      content_type: cat
      filter:
        sys.id[in]: 'finn,jake'
      entry_template: entry.html
  template: example.html
  ---
```

## Using the fetched entries on the templates

We have to make a distinction between two types of templates:

* The template rendered for the source file.
* And the template rendered for each individual entry.

In the context of the template rendered for the source file you will have access to a property named `contentful`. This property holds the following properties:

* `entries`, an array with all the fetched entries. The structure of each of this entry objects will be the same as the explained below for the entry template.
* `contentTypes`, an object with the id of the fetched [contentTypes](https://www.contentful.com/developers/documentation/content-delivery-api/http/#content-types) as keys. Under each key there will be an array with all the entries belonging to that particular contentType.

In the context of the template rendered for an individual entry you will have access to the following properties under the property `data`:

* `id`, a shortcut to the entry's id.
* `contentType`, a shortcut to the entry's contentType.
* `data`, the body of the entry as returned by [Contentful's Content Delivery API](https://www.contentful.com/developers/documentation/content-delivery-api/)


# License
MIT

