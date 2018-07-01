/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @flow
 */

'use strict';

const Parse = require('parse/react-native');
const logError = require('logError');
const InteractionManager = require('InteractionManager');

import type { ThunkAction } from './types';

const destination = Parse.Object.extend('destination');
const experiences = Parse.Object.extend('experiences');
// const infoexperiences = Parse.Object.extend('infoexperiences');
const FAQ = Parse.Object.extend('FAQ');
const guide = Parse.Object.extend('guide');

function loadParseQuery(type: string, query: Parse.Query): ThunkAction {
  return (dispatch) => {
    return query.find({
      success: (list) => {
        // We don't want data loading to interfere with smooth animations
        InteractionManager.runAfterInteractions(() => {
          // Flow can't guarantee {type, list} is a valid action
          dispatch(({type, list}: any));
        });
      },
      error: logError,
    });
  };
}

module.exports = {
  loadDestination: (): ThunkAction =>
    loadParseQuery(
      'LOADED_DESTINATION',
        new Parse.Query(destination)
    ),
  loadExperiences: (): ThunkAction =>
    loadParseQuery(
      'LOADED_EXPERIENCES',
        new Parse.Query(experiences)
    ),
  // loadInfoExperiences: (): ThunkAction =>
  //   loadParseQuery(
  //     'LOADED_INFOEXPERIENCES',
  //       new Parse.Query(infoexperiences)
  //   ),
  loadFAQ: (): ThunkAction =>
    loadParseQuery(
      'LOADED_FAQ',
        new Parse.Query(FAQ)
    ),
  loadSights: (value): ThunkAction =>
    loadParseQuery(
      'LOADED_SIGHTS',
        new Parse.Query(guide)
          .equalTo("value_des", value)
          .equalTo("admin", true)
    ),
};
