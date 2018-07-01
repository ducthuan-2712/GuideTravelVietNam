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
import { Modal, Animated, View, Alert } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { Text } from "./GText";
import StyleSheet from "./GStyleSheet";
import GColors from "./GColors";
import GButton from "./GButton";
import Hitbox from "Hitbox";

/* constants ================================================================ */
const GRADIENT_HEIGHT = 220,
  BUTTON_PADDING_T = 15,
  BUTTON_PADDING_H = 17,
  BUTTON_PADDING_B = 18,
  BUTTON_ANIM_DIST = 50,
  INTRO_ANIM_DUR = 180,
  OUTRO_ANIM_DUR = 150;

/**
* ==============================================================================
* <GActionSheet />
* ------------------------------------------------------------------------------
* @param {Array<Object>} actions Action buttons to render { text:str, onPress:fn }
* @param {function} onCancel 'x' button callback (called after outro animation)
* @param {?string} title Actions header
* @return {ReactElement}
* ==============================================================================
*/

class GActionSheet extends React.Component {
  constructor() {
    super();

    this.outro = this.outro.bind(this);

    this.state = {
      revealed: false,
      introTransition: new Animated.Value(0)
    };

    this.animatedContainer = {
      opacity: this.state.introTransition
    };
    this.animatedContent = {
      marginBottom: this.state.introTransition.interpolate({
        inputRange: [0, 1],
        outputRange: [-BUTTON_ANIM_DIST, 0]
      })
    };

    Animated.timing(this.state.introTransition, {
      toValue: 1,
      duration: INTRO_ANIM_DUR
    }).start();
  }

  render() {
    let actions = (this.props.actions || []).map((action, index) =>
      this.renderAction(action, index)
    );
    let title = this.props.title ? (
      <Text style={styles.title}>{this.props.title}</Text>
    ) : null;

    return (
      <Modal animationType="none" visible={true} transparent={true}>
        <Animated.View style={[styles.container, this.animatedContainer]}>
          <Hitbox onPress={_ => this.outro(this.props.onCancel)} />
          <Animated.View style={this.animatedContent} pointerEvents="box-none">
            <View pointerEvents="none">
              <LinearGradient
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.gradient}
                colors={[
                  GColors.colorWithAlpha("tangaroa", 0),
                  GColors.colorWithAlpha("tangaroa", 0.8)
                ]}
              />
            </View>
            <View style={styles.buttonGroup}>
              {title}
              {actions}
              {this.renderCancel()}
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }

  renderAction(obj, i) {
    return (
      <GButton
        key={`GASAB-${obj.text}`}
        style={styles.actionBtn}
        caption={obj.text}
        onPress={() => this.outro(obj.onPress)}
      />
    );
  }

  renderCancel() {
    return (
      <GButton
        key="GASCB"
        theme="white"
        type="round"
        style={styles.cancelBtn}
        icon={require("./img/buttons/icon-x.png")}
        onPress={_ => this.outro(this.props.onCancel)}
      />
    );
  }

  outro(cb) {
    Animated.timing(this.state.introTransition, {
      toValue: 0,
      duration: OUTRO_ANIM_DUR
    }).start(cb);
  }
}

/* StyleSheet =============================================================== */
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: GColors.colorWithAlpha("tangaroa", 0.5)
  },
  gradient: {
    height: GRADIENT_HEIGHT
  },
  buttonGroup: {
    paddingTop: BUTTON_PADDING_T,
    paddingHorizontal: BUTTON_PADDING_H,
    paddingBottom: BUTTON_PADDING_B,
    backgroundColor: GColors.colorWithAlpha("tangaroa", 0.8)
  },
  actionBtn: {
    marginBottom: 10
  },
  cancelBtn: {
    alignSelf: "center",
    marginTop: 5
  },
  title: {
    color: GColors.white,
    fontSize: 18,
    textAlign: "center",
    padding: 20
  }
});

/* playground cards ========================================================= */
const actionSheet = GActionSheet;
actionSheet.__cards__ = define => {
  const exampleActions = [
    { text: "Action 1", onPress: () => Alert.alert("Do action 1!") },
    { text: "Action 2", onPress: () => Alert.alert("Do action 2!") }
  ];

  define("Default", () => (
    <GActionSheet
      actions={exampleActions}
      title="This is a title!"
      onCancel={() => Alert.alert("Cancel")}
    />
  ));
};

/* exports ================================================================== */
module.exports = actionSheet;
