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
import { StyleSheet, View, TouchableOpacity, Image, Alert } from "react-native";

/* constants ================================================================ */

const BUTTON_SIZE = 76,
  BUTTON_SIZE_SM = 16;

/**
* ==============================================================================
* <PlayButton />
* ------------------------------------------------------------------------------
* @param {?string} type Display style default "large" || "small"
* @param {?string} buttonColor Background color
* @param {?string} iconColor Icon tint color
* @param {?function} onPress event callback
* @return {ReactElement}
* ==============================================================================
*/

class PlayButton extends React.Component {
  static defaultProps = {
    type: "large",
    buttonColor: GColors.yellow,
    iconColor: GColors.pink
  };

  render() {
    // color theming (with defaults)
    const buttonColorStyles = { backgroundColor: this.props.buttonColor };
    const iconColorStyles = { tintColor: this.props.iconColor };
    // size variation
    const {
      buttonSizeStyles,
      iconSizeStyles,
      iconImage
    } = this.getSizeStyles();
    // icon element
    const image = (
      <Image
        style={[styles.icon, iconColorStyles, iconSizeStyles]}
        source={iconImage}
      />
    );

    // return TouchableOpacity container if there's an onPress handler else use a View
    if (this.props.onPress) {
      return (
        <TouchableOpacity
          onPress={this.onPress}
          activeOpacity={0.8}
          style={[styles.button, buttonColorStyles, buttonSizeStyles]}
        >
          {image}
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={[styles.button, buttonColorStyles, buttonSizeStyles]}>
          {image}
        </View>
      );
    }
  }

  onPress = _ => {
    this.props.onPress && this.props.onPress();
  };

  getSizeStyles() {
    const { type } = this.props;
    let buttonSizeStyles, iconSizeStyles, iconImage;
    if (type === "small") {
      buttonSizeStyles = {
        width: BUTTON_SIZE_SM,
        height: BUTTON_SIZE_SM,
        borderRadius: BUTTON_SIZE_SM / 2
      };
      iconSizeStyles = { transform: [{ translateX: 0.5 }] };
      iconImage = require("./img/buttons/play-small.png");
    } else {
      buttonSizeStyles = {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2
      };
      iconSizeStyles = { transform: [{ translateX: 4 }] };
      iconImage = require("./img/buttons/play-large.png");
    }
    return { buttonSizeStyles, iconSizeStyles, iconImage };
  }
}

/* StyleSheet =============================================================== */

const styles = StyleSheet.create({
  button: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    tintColor: "white"
  }
});

/* playground cards ========================================================= */

const playButton = PlayButton;
playButton.__cards__ = define => {
  define("Large Yellow/Pink (Default)", _ => <PlayButton />);
  define("Small Yellow/Pink", _ => <PlayButton type="small" />);

  define("Large Blue/Green", _ => (
    <PlayButton
      buttonColor={GColors.blue}
      iconColor={GColors.green}
      onPress={() => Alert.alert("<PlayButton /> pressed!")}
    />
  ));

  define("Small Pink/Yellow", _ => (
    <PlayButton
      type="small"
      buttonColor={GColors.pink}
      iconColor={GColors.yellow}
      onPress={() => Alert.alert("<PlayButton /> pressed!")}
    />
  ));
};

/* exports ================================================================== */
module.exports = playButton;
