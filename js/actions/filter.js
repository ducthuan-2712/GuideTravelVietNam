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

import type { Action, ThunkAction } from "./types";

type destination = {key: Object};

function randomFilter(results): ThunkAction {
  return (dispatch, getState) => {
  	let topic = results[Math.floor(Math.random()*results.length)];

    // TODO: Make sure reducers clear their state
    return dispatch({
      type: "APPLY_TOPICS",
      topic
    });
  };
}

function loadFilterDestination(): ThunkAction {
	return (dispatch, getState) => {
    if(Object.keys(getState().filter.topic).length == 0) {
			dispatch(randomFilter(getState().destination.results));
		}
	}
}

function applyTopics(topic: destination): Action {
  return {
    type: 'APPLY_TOPICS',
    topic
  };
}

function clearFilter(): Action {
  return {
    type: 'CLEAR_FILTER',
  };
}


module.exports = {
  applyTopics,
  clearFilter,
  loadFilterDestination
};
