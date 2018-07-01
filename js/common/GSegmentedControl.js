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
import StyleSheet from "./GStyleSheet";
import { Text } from "./GText";
import GColors from "./GColors";
import GFonts from "./GFonts";
import { View, TouchableOpacity } from "react-native";

/* constants ================================================================ */

const BUTTON_HEIGHT = 32,
  CONTAINER_PADDING_B = 12,
  NOTIFICATION_ICON_SIZE = 5;

/* <GSegmentedControl />
============================================================================= */

class GSegmentedControl extends React.Component {
  props: {
    values: Array<string>,
    selectedIndex: number,
    onChange: (newIndex: number) => void,
    style?: any
  };

  static defaultProps = {
    backgroundColor: GColors.blue,
    textColor: GColors.white,
    borderColor: GColors.white
  };

  render() {
    const { backgroundColor, borderColor, textColor } = this.props;

    const segments = this.props.values.map((value, index) => (
      <Segment
        key={value.title}
        value={value.title}
        textColor={textColor}
        borderColor={borderColor}
        hasUpdates={value.hasUpdates}
        isSelected={index === this.props.selectedIndex}
        onPress={() => this.props.onChange(index)}
      />
    ));
    return (
      <View style={[styles.container, { backgroundColor }, this.props.style]}>
        {segments}
      </View>
    );
  }
}

class Segment extends React.Component {
  props: {
    value: string,
    borderColor: ?string,
    textColor: ?string,
    isSelected: boolean,
    onPress: () => void
  };

  render() {
    const { value, isSelected, borderColor, textColor } = this.props;

    const title = value && value.toUpperCase();

    let selectedButtonStyle;
    if (isSelected) {
      selectedButtonStyle = { borderColor };
    }

    let accessibilityTraits = ["button"];
    if (isSelected) {
      accessibilityTraits.push("selected");
    }

    return (
      <TouchableOpacity
        accessibilityTraits={accessibilityTraits}
        activeOpacity={0.8}
        onPress={this.props.onPress}
        style={[styles.button, selectedButtonStyle]}
      >
        <Text style={[styles.label, { color: textColor }]}>{title}</Text>
        {this.renderNotificationIcon()}
      </TouchableOpacity>
    );
  }

  renderNotificationIcon() {
    if (this.props.hasUpdates) {
      return <View style={styles.notificationIcon} />;
    } else {
      return null;
    }
  }
}

/* StyleSheet =============================================================== */

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingBottom: CONTAINER_PADDING_B,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    height: BUTTON_HEIGHT,
    paddingHorizontal: 20,
    borderRadius: BUTTON_HEIGHT / 2,
    borderWidth: 1
  },
  label: {
    fontSize: 13,
    color: "white",
    fontFamily: GFonts.helvetica
  },
  notificationIcon: {
    position: "absolute",
    right: 11,
    top: 7,
    width: NOTIFICATION_ICON_SIZE,
    height: NOTIFICATION_ICON_SIZE,
    backgroundColor: GColors.yellow,
    borderRadius: NOTIFICATION_ICON_SIZE / 2
  }
});

/* exports ================================================================== */
module.exports = GSegmentedControl;
