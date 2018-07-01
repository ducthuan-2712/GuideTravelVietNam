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

import type { Destination } from '../reducers/destination';
import type { Experiences } from '../reducers/experiences';
import type { Sight } from '../reducers/sight';

export type ValueListData = {
  [value: string]: {
    [sessionID: string]: Destination;
  };
};

export type ValueDesListData = {
  [value_des: string]: {
    [sessionID: string]: Experiences;
  };
};

export type ValueExpListData = {
  [value_exp: string]: {
    [sessionID: string]: Experiences;
  };
};

export type GuideListData = {
  [admin: boolean]: {
    [sessionID: boolean]: Sight;
  };
};

export type CheckListData = {
  [check: boolean]: {
    [sessionID: boolean]: Sight;
  };
};

function byValue(sessions: Array<Destination>): ValueListData {
  var data = {};
  sessions.forEach((session) => {
    var valueSectionKey = session.value;
    data[valueSectionKey] = data[valueSectionKey] || {};
    data[valueSectionKey][session.id] = session;
  });

  return data;
}

function byEx(sessions: Array<Experiences>): ValueDesListData {
  var data = {};
  sessions.forEach((session) => {
    var valueSectionKey = session.value_des;
    data[valueSectionKey] = data[valueSectionKey] || {};
    data[valueSectionKey][session.id] = session;
  });

  return data;
}

function byGuideList(sessions: Array<Sight>): ValueExpListData {
  var data = {};
  sessions.forEach((session) => {
    var valueSectionKey = session.value_exp;
    data[valueSectionKey] = data[valueSectionKey] || {};
    data[valueSectionKey][session.id] = session;
  });

  return data;
}

function byGuide(sessions: Array<Sight>): GuideListData {
  var data = {};
  sessions.forEach((session) => {
    var valueSectionKey = session.admin;
    data[valueSectionKey] = data[valueSectionKey] || {};
    data[valueSectionKey][session.id] = session;
  });

  return data;
}

function byCheck(sessions: Array<Sight>): CheckListData {
  var data = {};
  sessions.forEach((session) => {
    var valueSectionKey = session.check;
    data[valueSectionKey] = data[valueSectionKey] || {};
    data[valueSectionKey][session.id] = session;
  });

  return data;
}

module.exports = {byValue, byEx, byGuideList, byGuide, byCheck};
