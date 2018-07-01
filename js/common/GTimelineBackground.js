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

import React from "react";
import { View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import StyleSheet from "./GStyleSheet";
import GColors from "./GColors";
import GTimelineSegment from "./GTimelineSegment";

/* =============================================================================
<GTimelineBackground />
============================================================================= */

class GTimelineBackground extends React.Component {
  static defaultProps = {
    left: 77,
    height: 118,
    fadeOut: true
  };

  render() {
    const { style, left, fadeOut, height } = this.props;
    let gradient = fadeOut ? this.renderGradient() : null;
    return (
      <View style={[styles.container, { height }, style]}>
        <GTimelineSegment left={left} dot={false} />
        {gradient}
      </View>
    );
  }

  renderGradient() {
    return (
      <LinearGradient
        pointerEvents="none"
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
        colors={[
          GColors.colorWithAlpha("bianca", 0),
          GColors.colorWithAlpha("bianca", 1)
        ]}
      />
    );
  }
}

/* StyleSheet
============================================================================= */
const styles = StyleSheet.create({
  container: {},
  gradient: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }
});

/* Export
============================================================================= */
export default GTimelineBackground;
