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
import { HeaderTitle, Text } from "./GText";
import { Modal, Animated, View, StyleSheet, Image } from "react-native";
import Hitbox from "./Hitbox";

const ARROW_WIDTH = 23,
  ARROW_HEIGHT = 13,
  TOOLTIP_INSET = 23,
  TRANSLATE_Y_DISTANCE = 10;

/**
* ==============================================================================
* <GTooltip />
* ------------------------------------------------------------------------------
* @param {?string} title at least one of title/text is required (no content, no render)
* @param {?string} text at least one of title/text is required (no content, no render)
* @param {?number} x x position
* @param {?number} y x position
* @param {?string} align top or bottom placement of tooltip // TODO
* @param {?string} hitboxColor background overlay color
* @param {?function} onDismiss Callback
* @return {ReactElement}
* ==============================================================================
*/

class GTooltip extends React.Component {
  static defaultProps = {
    x: 0,
    y: 0,
    align: "top",
    hitboxColor: GColors.colorWithAlpha("tangaroa", 0.2),
    onDismiss: _ => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      anim: new Animated.Value(props.visible ? 1 : 0)
    };

    this.animatedTransforms = {
      transform: [
        {
          translateY: this.state.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [TRANSLATE_Y_DISTANCE, 0]
          })
        }
      ]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible) {
      this.state.anim.setValue(0);
      Animated.spring(this.state.anim, { toValue: 1 }).start();
    }
  }

  render() {
    const { x, y, visible, title, text, hitboxColor, onDismiss } = this.props;
    if (!title && !text) {
      return null;
    }

    const { left, top } = this.getArrowPosition(x, y);

    return (
      <Modal
        style={styles.modal}
        visible={visible}
        transparent={true}
        animationType="fade"
      >
        <Hitbox onPress={onDismiss} style={{ backgroundColor: hitboxColor }} />
        <Animated.View
          pointerEvents="box-none"
          style={[styles.tooltip, this.animatedTransforms, { top }]}
        >
          <Image
            style={[styles.arrow, { left }]}
            source={require("./img/tooltip-arrow.png")}
          />
          <View style={styles.content}>
            {title ? (
              <HeaderTitle style={styles.title}>{title}</HeaderTitle>
            ) : null}
            {text ? <Text style={styles.text}>{text}</Text> : null}
          </View>
        </Animated.View>
      </Modal>
    );
  }

  getArrowPosition(x, y) {
    const left = x - ARROW_WIDTH / 2;
    const top = y;
    return { left, top };
  }
}

// StyleSheet ==================================================================

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },

  hitbox: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },

  tooltip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: TOOLTIP_INSET
  },

  arrow: {
    position: "absolute",
    left: 0,
    top: TOOLTIP_INSET - ARROW_HEIGHT + 1 // prevent hairline separation
  },

  content: {
    backgroundColor: GColors.white,
    borderRadius: 4,
    paddingTop: 21,
    paddingBottom: 16, // 5 less to account for marginBottom's
    paddingHorizontal: 24,
    alignItems: "center"
  },
  title: {
    marginBottom: 5,
    color: GColors.blue,
    textAlign: "center"
  },
  text: {
    marginBottom: 5,
    textAlign: "center"
  }
});

// export ======================================================================

export default GTooltip;
