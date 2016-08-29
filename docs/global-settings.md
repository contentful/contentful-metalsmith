# Global settings

To communication with Contentful you have to set at least `access_token` and `space_id`.
You can find these in your [app](https://app.contentful.com) at `APIs -> Content delivery API Keys`.

```json
{
  "source": "src",
  "destination": "build",
  "plugins": {
    "contentful-metalsmith": {
      "access_token" : "YOUR_CONTENTFUL_ACCESS_TOKEN",
      "space_id": "YOUR_CONTENTFUL_SPACE_ID",
      "host": "preview.contentful.com"
    }
  }
}
```

## Parameters

### `access_token` *(optional)*

Global access token used to connect with the Contentful API.
You can define the `access_token` global in your `metalsmith.json` or define it separately in given source files.

*Recommended way here is to set the `access_token` and `space_id` of your mainly used space in the `metalsmith.json` or global config and overwrite it if needed in depending source files.*

**Side note:** When you decide to not set a global `access_token` you have to set it in every single source file.

See [source file settings](./source-file-settings.md) for further information.

### `space_id` *(optional)*

Global space id the data will be fetched from.
You can define the `space_id` global in your `metalsmith.json` or define it separately in given source files.

*Recommended way here is to set the `access_token` and `space_id` of your mainly used space in the `metalsmith.json` or global config and overwrite it if needed in depending source files.*

**Side note:** When you decide to not set a global `space_id` you have to set it in every single source file.

See [source file settings](./source-file-settings.md) for further information.

### `host` *(optional)*

In case you want to use the [Content Preview API](https://www.contentful.com/developers/docs/references/content-preview-api/) you can set the depending token
and change the `host` property to `preview.contentful.com`.

For using the [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/) you can ignore this option, as it is defaulting to **Content Delivery API**.

*Recommended way here is to set the `host` in the `metalsmith.json` or global config and overwrite it if needed in depending source files.*

