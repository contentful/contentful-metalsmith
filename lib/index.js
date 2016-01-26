'use strict';

var _          = require('lodash');
var each       = require('async').each;
var contentful = require('contentful');
var debug      = require('debug')('contentful-metalsmith');
var slug       = require('slug-component');

/**
 * Expose the plugin
 */
module.exports = plugin;


function plugin(options){
  enforcep(options, 'accessToken');

  return function(files, metalsmith, done){
    var keys         = Object.keys(files);

    each(keys, processFile, done);

    //TODO: switch to bluebird promises
    function processFile(file, fileProcessedCallback){
      var fileMetadata = files[file], client, query;

      if (!fileMetadata.contentful) {
        fileProcessedCallback();
        return;
      }

      enforcep(fileMetadata.contentful, 'space_id');

      /*
       * contentTypes will contain all the contentTypes
       * fetched for this source file
         */
      fileMetadata.contentful.contentTypes = {};

      /*
       * entries will contain the entries fetched from the API
       * for this file
       */
      fileMetadata.contentful.entries = [];

      client = createContentfulClient(options.accessToken, fileMetadata.contentful.space_id, options.host),
      query  = _.extend({},
          (fileMetadata.contentful.content_type ? {content_type : fileMetadata.contentful.content_type} : undefined),
          fileMetadata.contentful.filter
          );

      client.entries(query).then(onSuccessfulEntriesFetch(fileMetadata.contentful, fileProcessedCallback), onErroneousEntriesFetch(fileProcessedCallback));

      /*
       * Proceed to next file
       */
      debug('Processed file ' + file );
    }

    function onSuccessfulEntriesFetch(options, done) {
      return function(data){
        each(data,
          entryProcessor({
            entries              : options.entries,
            template             : options.entry_template,
            contentTypes         : options.contentTypes,
            filenameField        : options.entry_filename_pattern,
            asPermalink          : options.permalink_style,
            useTemplateExtension : options.use_template_extension
          }),
          done);
      };
    }

    function onErroneousEntriesFetch(done) {
      return function(err) {
        debug('An unexpected error happened while trying to fetch the entries (' + err.message +')');
        done(err);
      };
    }


    function ensureContentType(contentTypes, contentType){
      contentTypes[contentType] = contentTypes[contentType] || [];
      return contentTypes;
    }

    function pushEntryToContentType(contentTypes, contentType, entry){
      contentTypes[contentType].push(entry);
    }

    function entryProcessor(options) {
      return function (entry, entryProcessedCallback){
        var file,
            //TODO: fix the contentType
            contentType = options.contentType ? contentType : entry.sys.contentType.sys.id;
        var extension = (options.useTemplateExtension) ? options.template.split('.').slice(1).pop() : 'html';
        
        /**
         * Builds a filename out of a pattern if provided.
         * 
         * @param  {Object} entry
         * @return {String}
         */
        var getFilename = function getFilename (entry) {
          // Default filename
          var filename = contentType + '-' + file.id + "." + extension;
          /**
           * Get the params from a `pattern` string.
           *
           * @param {String} pattern
           * @return {Array}
           */
          var getParams = function getParams (pattern) {
            var matcher = /:([\w]+\.[\w]+)/g;
            var ret = [];
            var m;
            while (m = matcher.exec(pattern)) ret.push(m[1]);
            return ret;
          }

          if (options.filenameField) {
            var pattern = options.filenameField;
            var params = getParams(pattern);

            params.forEach(function(element, index){
              var element_parts = element.split('.');
              var prefix = element_parts[0];
              var item = element_parts[1];

              if (entry[prefix] && void 0 !== entry[prefix][item]) {
                pattern = pattern.replace(":" + element, slug(entry[prefix][item].toString()));
              }
            });
            
            // Check all have been processed            
            if (getParams(pattern).join('') === '') {
              filename = (options.asPermalink) ? pattern + "/index.html" : pattern + "." + extension;
            }
          }
          return filename;
        };

        /*
         * Create a "virtual" (virtual because it doesn't exist in the src/ dir)
         * file that will be processed by metalsmith
         */
        file = {
          contents    : "", // Contents needs to be defined beacuse other plugins expect it
          data        : entry,
          id          : entry.sys.id,
          contentType : contentType,
          template    : options.template
        };

        /*
         * Give a name to the file that will be created on
         * the build dir
         */
        if (options.template){
          files[getFilename(entry)] = file;
        }

        // This check is being performed for each entry, it might be done out of this loop
        ensureContentType(options.contentTypes, contentType);
        pushEntryToContentType(options.contentTypes, contentType, file);
        options.entries.push(file);

        entryProcessedCallback();
      };
    }

    function createContentfulClient(accessToken, spaceId, host){
      var options = {
        space : spaceId,
        accessToken : accessToken,
      };
      if (host) {
        options.host = host;
      }
      return contentful.createClient(options);
    }
  };

  function exists(value){
    return value != null;
  }

  function enforcep(object, property) {
    if (!exists(object[property]))
      throw new TypeError('Expected property ' + property);
  }
}
