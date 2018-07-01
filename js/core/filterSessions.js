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

type StringMap = {[key: string]: boolean};

function byDestination(sessions: Array<Destination>, sectionID: StringMap): Array<Destination> {
  return sessions.filter(
    (session) => session.value !== sectionID
  );
}

function byCategories(sessions: Array<Experiences>, sectionID: StringMap): Array<Experiences> {
  return sessions.filter(
    (session) => session.value_des === sectionID
  );
}

function bySights(sessions: Array<Sight>, sectionID: StringMap): Array<Sight> {
  return sessions.filter(
    (session) => session.value_exp === sectionID
  );
}

module.exports = {byDestination, byCategories, bySights};
