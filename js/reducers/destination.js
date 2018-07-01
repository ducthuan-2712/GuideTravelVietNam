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

import type {Action} from '../actions/types';

type State = {
  results: Array;
  resultsDetail: Object;
  resultsNearby: Array;
};

const initialState: State = { 
	results: [],
	resultsDetail: {},
	resultsNearby: []
};

function destination(state: State = initialState, action: Action): State {
  if (action.type === 'LOADED_DESTINATION') {
    return { ...state, results: action.results }
  }
  if (action.type === 'GOOGLE_DETAILS_API') {
    return { ...state, resultsDetail: action.resultsDetail }
  }
  if (action.type === 'GOOGLE_NEARBY_API') {
    return { ...state, resultsNearby: action.resultsNearby }
  }
  if (action.type === 'RESET_DESTINATION') {
    return { ...state, resultsDetail: {}, resultsNearby: [] }
  }
  return state;
  // return initialState // Reset State
}

module.exports = destination;
