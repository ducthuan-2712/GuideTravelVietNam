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
import { Heading3, Paragraph } from "./GText";
import { Modal, Animated, View, StyleSheet } from "react-native";

/* constants ================================================================ */

const INTRO_DELAY_DUR = 300,
  SHOW_DELAY_DUR = 800,
  OUTRO_ANIM_DUR = 150,
  TRANSLATE_Y_DISTANCE = 60;

/**
* ==============================================================================
* <GToast />
* ------------------------------------------------------------------------------
* @param {?function} onComplete Outro animation callback
* @param {?string} title At least one of title/text is required
* @param {?string} text At least one of title/text is required
* @param {?string} backgroundColor Container background color
* @param {?string} titleColor Heading text color
* @param {?string} textColor Paragraph text color
* @return {ReactElement}
* ==============================================================================
*/

class GToast extends React.Component {
  static defaultProps = {
    backgroundColor: GColors.colorWithAlpha("tangaroa", 0.95),
    titleColor: GColors.white,
    textColor: GColors.white,
    onComplete: _ => {}
  };

  constructor() {
    super();

    this.state = {
      contentAnimation: new Animated.Value(0)
    };

    this.animatedContentStyles = {
      opacity: this.state.contentAnimation,
      transform: [
        {
          translateY: this.state.contentAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [TRANSLATE_Y_DISTANCE, 0]
          })
        }
      ]
    };

    this.intro();
  }

  render() {
    const { title, text, backgroundColor, titleColor, textColor } = this.props;
    if (!title && !text) {
      return null;
    }

    return (
      <Modal transparent={true} animationType="fade" visible={true}>
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.content,
              { backgroundColor },
              this.animatedContentStyles
            ]}
          >
            {title ? (
              <Heading3 style={[styles.title, { color: titleColor }]}>
                {title}
              </Heading3>
            ) : null}
            {text ? (
              <Paragraph style={[styles.text, { color: textColor }]}>
                {text}
              </Paragraph>
            ) : null}
          </Animated.View>
        </View>
      </Modal>
    );
  }

  intro = _ => {
    Animated.spring(this.state.contentAnimation, {
      delay: INTRO_DELAY_DUR,
      toValue: 1
    }).start(this.outro);
  };

  outro = _ => {
    Animated.timing(this.state.contentAnimation, {
      delay: SHOW_DELAY_DUR,
      toValue: 0,
      duration: OUTRO_ANIM_DUR
    }).start(this.props.onComplete);
  };
}

/* StyleSheet =============================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 4
  },
  title: {
    marginBottom: 4,
    textAlign: "center"
  },
  text: {
    textAlign: "center"
  }
});

/* exports & Playground cards =============================================== */

module.exports = GToast;
module.exports.__cards__ = define => {
  define("Default", _ => <GToast text="Thanks for your review!" />);
};
