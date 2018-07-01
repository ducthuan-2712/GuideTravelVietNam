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
import GColors from "../common/GColors";
import { Dimensions, View, Image, StyleSheet } from "react-native";
import { Navigator } from "react-native-deprecated-custom-components";
import { Heading2 } from "../common/GText";
import GBackgroundRepeat from "../common/GBackgroundRepeat";
import GButton from "../common/GButton";
import LoginButton from "../common/LoginButton";

import GModal from "../common/GModal";

/* constants ================================================================ */

const WINDOW_WIDTH = Dimensions.get("window").width,
  WINDOW_HEIGHT = Dimensions.get("window").height,
  RENDER_ARROW_SECTION = WINDOW_HEIGHT <= 600 ? false : true,
  CONTENT_PADDING_V = WINDOW_HEIGHT <= 600 ? 20 : 32,
  MODAL_PADDING_H = 10,
  MODAL_WIDTH = WINDOW_WIDTH - MODAL_PADDING_H * 2;

/* <LoginModal />
============================================================================= */

class LoginModal extends React.Component {
  props: {
    navigator: Navigator,
    onLogin: () => void
  };

  render() {
    return (
      <GModal
        renderContent={this.renderContent}
        renderFooter={this.renderFooter}
        bottomGradient={[
          GColors.colorWithAlpha("tangaroa", 0),
          GColors.colorWithAlpha("tangaroa", 1)
        ]}
        {...this.props}
      />
    );
  }

  renderContent = _ => {
    return (
      <View>
        <View style={styles.header}>
          <GBackgroundRepeat
            width={MODAL_WIDTH}
            height={210}
            source={require("../common/img/pattern-dots.png")}
            style={styles.headerBackground}
          />
          <Image source={require("./img/login-modal.png")} />
        </View>
        <View style={styles.content}>
          <Heading2 style={styles.h2}>
            {"Log in to add sessions\nto My G."}
          </Heading2>
          {this.renderArrow()}
          <LoginButton onLoggedIn={this.loggedIn} />
        </View>
      </View>
    );
  };

  renderArrow() {
    if (RENDER_ARROW_SECTION) {
      return <Image style={styles.arrow} source={require("./img/arrow.png")} />;
    } else {
      return null;
    }
  }

  renderFooter = _ => {
    return (
      <GButton
        style={{ marginBottom: 27 }}
        theme="white"
        type="round"
        icon={require("../common/img/buttons/icon-x.png")}
        onPress={this.dismiss}
      />
    );
  };

  dismiss = _ => {
    this.props.onClose && this.props.onClose();
  };

  loggedIn = _ => {
    this.props.onLogin();
    this.dismiss();
  };
}

/* StyleSheet =============================================================== */

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    overflow: "hidden"
  },
  headerBackground: {
    position: "absolute",
    left: 0,
    top: 0
  },

  content: {
    paddingHorizontal: 23,
    paddingVertical: CONTENT_PADDING_V,
    alignItems: "center"
  },
  h2: {
    color: GColors.blue,
    textAlign: "center",
    marginBottom: 20
  },

  arrow: {
    marginBottom: 20
  }
});

/* exports ================================================================== */
module.exports = LoginModal;
