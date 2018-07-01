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

import React from "react";
import { connect } from "react-redux";
import { skipLogin } from "../actions";
import GColors from "../common/GColors";
import GFonts from "../common/GFonts";
import { Text, Heading1 } from "../common/GText";
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  View,
  TouchableOpacity,
  StyleSheet
} from "react-native";

/* Config/Constants
============================================================================= */

const SKIP_BTN_HEIGHT = 24,
  WINDOW_WIDTH = Dimensions.get("window").width,
  WINDOW_HEIGHT = Dimensions.get("window").height,
  VERTICAL_BREAKPOINT = WINDOW_HEIGHT <= 600,
  HEADER_HEIGHT = VERTICAL_BREAKPOINT ? 220 : 285,
  SKIP_BTN_MARGIN_TOP = VERTICAL_BREAKPOINT ? 15 : 23,
  WHENWHERE_PADDING_TOP = VERTICAL_BREAKPOINT ? 12 : 18,
  RENDER_ARROW_SECTION = VERTICAL_BREAKPOINT ? false : true,
  LOGIN_PADDING_BOTTOM = VERTICAL_BREAKPOINT ? 20 : 33,
  CONTENT_PADDING_H = VERTICAL_BREAKPOINT ? 15 : 20;

/* =============================================================================
<LoginScreen />
--------------------------------------------------------------------------------

Props:
  ?

============================================================================= */

class LoginScreen extends React.Component {
  state = {
    anim: new Animated.Value(0)
  };

  componentDidMount() {
    Animated.timing(this.state.anim, { toValue: 3000, duration: 3000 }).start();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        <View style={styles.header}>
          <Image
            source={require("../common/img/pattern-dots.png")}
            style={styles.headerPattern}
          />
          <Image
            resizeMode="cover"
            source={require("./img/illustration.png")}
            style={styles.headerIllustration}
          />
          <Image source={require("./img/logo.png")} />
        </View>
        <View style={styles.content}>
          <View style={styles.mainHeadingSection}>
            <Animated.View style={this.fadeIn(500, 5)}>
              <Heading1 style={styles.h1}>
                Facebook Developer Conference
              </Heading1>
            </Animated.View>
            <Animated.Text
              style={[styles.whenWhereText, this.fadeIn(1200, 10)]}
            >
              APRIL 18 + 19 / SAN JOSE, CALIFORNIA
            </Animated.Text>
          </View>

          {this.renderArrowSection()}

          <Animated.View style={[styles.loginSection, this.fadeIn(1900, 20)]}>
            <Text style={styles.loginComment}>
              Use Facebook to find your friends at GuideTravelVietNam.
            </Text>
            <TouchableOpacity
              onPress={_ => this.props.dispatch(skipLogin())}
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>SKIP FOR NOW</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  renderArrowSection() {
    if (RENDER_ARROW_SECTION) {
      return (
        <Animated.View style={[styles.arrowSection, this.fadeIn(1500, 15)]}>
          <Image source={require("./img/arrow.png")} />
        </Animated.View>
      );
    } else {
      return null;
    }
  }

  fadeIn(delay, from = 0) {
    const { anim } = this.state;
    return {
      opacity: anim.interpolate({
        inputRange: [delay, Math.min(delay + 500, 3000)],
        outputRange: [0, 1],
        extrapolate: "clamp"
      }),
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [delay, Math.min(delay + 500, 3000)],
            outputRange: [from, 0],
            extrapolate: "clamp"
          })
        }
      ]
    };
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GColors.bianca
  },

  //header styles
  header: {
    height: HEADER_HEIGHT,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  headerPattern: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    height: HEADER_HEIGHT - 30
  },
  headerIllustration: {
    position: "absolute",
    left: 0,
    width: WINDOW_WIDTH,
    bottom: 80
  },

  content: {
    flex: 1,
    justifyContent: "space-around",
    paddingHorizontal: CONTENT_PADDING_H
  },

  h1: {
    marginTop: 16,
    textAlign: "center"
  },
  whenWhereText: {
    marginTop: WHENWHERE_PADDING_TOP,
    textAlign: "center",
    color: GColors.tangaroa,
    fontFamily: GFonts.helvetica
  },

  arrowSection: {
    alignItems: "center",
    justifyContent: "center"
  },

  loginSection: {
    paddingBottom: LOGIN_PADDING_BOTTOM,
    alignItems: "center",
    paddingHorizontal: 20
  },
  loginComment: {
    textAlign: "center",
    fontSize: 15,
    color: GColors.pink,
    fontFamily: GFonts.fontWithWeight("helvetica", "semibold"),
    marginBottom: 23
  },
  skipButton: {
    marginTop: SKIP_BTN_MARGIN_TOP,
    height: SKIP_BTN_HEIGHT,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center"
  },
  skipText: {
    color: GColors.colorWithAlpha("tangaroa", 0.5),
    fontFamily: GFonts.helvetica
  }
});

/* Export
============================================================================= */
module.exports = connect()(LoginScreen);
