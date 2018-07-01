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
  plan: Object;
};

const initialState: State = { 
  plan: {
    mySelectDay: {},
    destination: {},
    detail: [],
    show: {
      name: null,
      minDate: null,
      maxDate: null,
      myTitleSelectCalendarFr: null,
      myTitleSelectCalendarTo: null,
      checkedSaved: false
    },
    resultsNearby: [],
    switch: false
  }
};

function plan(state: State = initialState, action: Action): State {
  if (action.type === 'UPDATE_PLAN') {
    return {...state, plan: action.plan}
  }
  if (action.type === 'GOOGLE_NEARBY_PLAN') {
    const googlePlan = state.plan
    googlePlan.resultsNearby = action.resultsNearby
    
    return {...state, plan: googlePlan}
  }
  if (action.type === 'CLEAR_PLAN') {
    return initialState;
  }
  return state;
  // return initialState // Reset State
}

module.exports = plan;
