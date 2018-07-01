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
 */

"use strict";

// Dependencies
// =============================================================================

import React from "react";
import ReactNative from "react-native";
import GColors from "./GColors";
import GFonts from "./GFonts";
import StyleSheet from "./GStyleSheet";

// Text Elements
// =============================================================================

export function Text({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.text, style]} {...props} />;
}

export function Heading1({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.h1, style]} {...props} />;
}

export function Heading2({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.h2, style]} {...props} />;
}

export function Heading3({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.h3, style]} {...props} />;
}

export function Heading4({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.h4, style]} {...props} />;
}

export function Heading5({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.h5, style]} {...props} />;
}

export function Paragraph({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.p, style]} {...props} />;
}

// export function Hyperlink({style, ...props}: Object): ReactElement {
//   return <ReactNative.Text style={[styles.a, style]} {...props} />;
// }

export function HeaderTitle({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.headerTitle, style]} {...props} />;
}

export function HorizontalRule({ style, ...props }: Object): ReactElement {
  return <ReactNative.View style={[styles.hr, style]} {...props} />;
}

// Styles
// =============================================================================

const styles = StyleSheet.create({
  text: {
    fontFamily: GFonts.default
  },
  h1: {
    fontFamily: GFonts.h1,
    fontSize: GFonts.normalize(30),
    lineHeight: GFonts.lineHeight(37),
    color: GColors.blue
  },
  h2: {
    fontFamily: GFonts.h2,
    fontSize: GFonts.normalize(23),
    lineHeight: GFonts.lineHeight(27), //, 1.4
    color: GColors.tangaroa,
    letterSpacing: -0.24
  },
  h3: {
    fontFamily: GFonts.h3,
    fontSize: GFonts.normalize(18),
    lineHeight: GFonts.lineHeight(20),
    color: GColors.sapphire,
    letterSpacing: -0.11
  },
  h4: {
    fontFamily: GFonts.h4,
    fontSize: GFonts.normalize(14),
    lineHeight: GFonts.lineHeight(22),
    color: GColors.tangaroa
  },
  h5: {
    fontFamily: GFonts.helvetica,
    fontSize: GFonts.normalize(12),
    lineHeight: GFonts.lineHeight(22),
    color: GColors.tangaroa
  },
  p: {
    fontFamily: GFonts.p,
    fontSize: GFonts.normalize(17),
    lineHeight: GFonts.lineHeight(25), //, 1.25
    color: GColors.tangaroa
  },
  // a: {
  //   color: GColors.blue,
  //   textDecorationLine: 'underline',
  // },
  hr: {
    height: 1,
    backgroundColor: GColors.colorWithAlpha("black", 0.1)
  },
  headerTitle: {
    fontFamily: GFonts.fontWithWeight("helvetica", "semibold"),
    ios: { fontSize: 17 },
    android: { fontSize: 20 }
  }
});
