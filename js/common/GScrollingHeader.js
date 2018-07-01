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

import React from "react";
import GColors from "./GColors";
import { PixelRatio, StyleSheet, Animated, Text } from "react-native";

/* constants ================================================================ */

const TRANSLATE_Y_DISTANCE = 10;

/**
* ==============================================================================
* <GScrollingHeader />
* ------------------------------------------------------------------------------
* @param {string} text the title text
* @param {?number} trigger the scroll position to trigger intro/outro animation
* @param {?number} duration intro/outro animation duration
* @return {ReactElement}
* ==============================================================================
*/

export default class GScrollingHeader extends React.Component {
  static defaultProps = {
    trigger: 200,
    duration: 180,
    contentInset: 30
  };

  constructor(props) {
    super(props);

    this.state = {
      revealed: false,
      anim: new Animated.Value(0)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scrollTop !== this.props.scrollTop) {
      let toValue = null;
      const { revealed } = this.state;
      const { trigger, scrollTop, duration } = nextProps;
      if (!revealed && scrollTop >= trigger) {
        toValue = 1;
      } else if (revealed && scrollTop < trigger) {
        toValue = 0;
      }
      if (toValue !== null) {
        this.setState({ revealed: toValue === 1 ? true : false });
        Animated.timing(this.state.anim, { toValue, duration }).start();
      }
    }
  }

  render() {
    const { text } = this.props;

    return (
      <Animated.View
        style={[
          styles.container,
          {
            left: Math.max(this.props.contentInset - 6, 0),
            right: Math.max(this.props.contentInset - 6, 0)
          },
          { opacity: this.state.anim, overflow: "hidden" }
        ]}
      >
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.text,
            {
              transform: [
                {
                  translateY: this.state.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-TRANSLATE_Y_DISTANCE, 0]
                  })
                }
              ]
            }
          ]}
        >
          {text}
        </Animated.Text>
      </Animated.View>
    );
  }
}

/* StyleSheet =============================================================== */

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 0,
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: "rgba(153, 162, 178, 1)"
  },
  text: {
    fontSize: 13,
    color: GColors.tangaroa
  }
});
