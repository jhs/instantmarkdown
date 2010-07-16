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
  var mustache = require('vendor/mustache');
  var util = require('vendor/util');

  values = {};

  // For partials
  values.header = {};
  values.footer = {};

  var section = req.id || 'home';
  values[section] = {};

  var sections = ['home', 'about', 'api'];
  for(var a = 0; a < sections.length; a++) {
    values[sections[a] + '_class'] = (section == sections[a]) ? 'active' : 'inactive';
  }

  var markdown;
  if(section == 'home' && req.method == 'POST') {
    values.result = {};
    var kvs = req.body.split('&');
    for(var a = 0; a < kvs.length; a++) {
      var kv = kvs[a].split('=');
      if(kv[0] == 'markdown') {
        markdown = unescape(kv[1]).replace(/\+/g, ' ');
      }
    }
  }

  // TODO: For the API, check GET or POST
  if(markdown) {
    // Showdown is not a CommonJS module so just make it.
    ddoc.vendor.showdown = [
      '(function() {',
      ddoc.vendor.showdown_src.compressed.showdown,
      'exports.converter = Showdown.converter;',
      '})()'
    ].join("\n");
    var showdown = require('vendor/showdown');
    var converter = new showdown.converter();
    values.result.html = converter.makeHtml(markdown);
    values.markdown = markdown;
  }

  debug = JSON.stringify(req);
  debug = util.dir(req);
  //values.debug = {"val": debug}; // Uncomment to activate

  return mustache.to_html(ddoc.templates.landing, values, ddoc.templates.partials);    
};
