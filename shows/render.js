/*
 * Copyright 2010 Jason Smith
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function(doc, req) {
  var ddoc = this;
  var section = req.id || 'home';

  // Showdown is not a CommonJS module so this makes it one.
  var showdown_mod;
  var get_showdown_converter = function() {
    if(!showdown_mod) {
      ddoc.vendor.showdown = [
        '(function() {',
        ddoc.vendor.showdown_src.compressed.showdown,
        'exports.converter = Showdown.converter;',
        '})()'
      ].join("\n");
      showdown_mod = require('vendor/showdown');
    }

    return new showdown_mod.converter();
  }

  var query_to_obj = function(str) {
    var result = {};
    var kvs = str.split('&');
    for(var a = 0; a < kvs.length; a++) {
      var kv = kvs[a].split('=');
      result[kv[0]] = unescape(kv[1]).replace(/\+/g, ' ');
    }
    return result;
  }

  // Handle the API first.
  if(section == 'api') {
    var result = {"code": 200, "headers":{"Content-Type":"text/plain"}}; // TODO: I did this for security so browsers wouldn't render. Is that necessary?

    if(req.method == 'GET' && req.query.markdown) {
      result.body = get_showdown_converter().makeHtml(req.query.markdown);
      return result;
    } else if(req.method == 'POST') {
      // Support cURL which unfortunately by default sets the form content-type even when sending raw data.
      var markdown = req.body;
      if(req.headers['Content-Type'] == 'application/x-www-form-urlencoded' && req.body.match(/^markdown=/))
        markdown = query_to_obj(req.body).markdown
      result.body = get_showdown_converter().makeHtml(markdown || '');
      return result;
    }
  }

  //
  // Handle normal rendering.
  //

  var mustache = require('vendor/mustache');
  var util = require('vendor/util');

  values = {};
  values.base = 'http://' + req.headers.Host;
  values.here = values.base + '/' + (req.id || '');

  // For partials
  values.header = {};
  values.footer = {};

  values[section] = {};

  var sections = ['home', 'couchdb', 'api'];
  for(var a = 0; a < sections.length; a++) {
    values[sections[a] + '_class'] = (section == sections[a]) ? 'active' : 'inactive';
  }

  var markdown = query_to_obj(req.body).markdown;
  if(markdown) {
    values.result = {};
    var startTime, endTime;
    var converter = get_showdown_converter();

    startTime = new Date();
    values.result.html = converter.makeHtml(markdown);
    endTime = new Date();

    values.result.time = (endTime - startTime) / 1000;
    values.markdown = markdown;
    values.zeroclipboard = true;
  }

  debug = util.dir(req);
  //values.debug = {"val": debug}; // Uncomment to activate

  return mustache.to_html(ddoc.templates.landing, values, ddoc.templates.partials);    
};
