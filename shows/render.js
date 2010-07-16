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

  doc = doc || {};
  doc.header = {}; // for partials
  doc.footer = {};

  return mustache.to_html(ddoc.templates.landing, {header : {}, footer: {}}, ddoc.templates.partials);    
};
