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
"use strict";

import { Linking } from "react-native";

const WHITELISTED_URL_SCHEMES = [
  "https:",
  "http:",
  "mailto:",
  "comgooglemaps-x-callback:"
];
const ERR_NOT_LISTED = "GLinking: URL does not match whitelisted schemes";

function allowed(source: string) {
  return !!WHITELISTED_URL_SCHEMES.find(p => source.indexOf(p) === 0);
}

export default class GLinking {
  static async openURL(source: string) {
    if (!allowed(source)) {
      throw new Error(ERR_NOT_LISTED);
    }
    return Linking.openURL(source);
  }
  static async canOpenURL(source: string) {
    if (!allowed(source)) {
      return false;
    }
    return Linking.canOpenURL(source);
  }
}
