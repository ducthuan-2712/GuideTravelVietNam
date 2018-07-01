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
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import GLinking from "./GLinking";
import ProfilePicture from "./ProfilePicture";
import MessengerModal from "./MessengerModal";

/* constants ================================================================ */

const LOGO_OFFSET_RIGHT = 5,
  LOGO_OFFSET_BOTTOM = 7,
  PROFILE_PICTURE_SIZE = 54,
  CONTAINER_WIDTH = PROFILE_PICTURE_SIZE + LOGO_OFFSET_RIGHT,
  CONTAINER_HEIGHT = PROFILE_PICTURE_SIZE + LOGO_OFFSET_BOTTOM;

/* =============================================================================
<MessengerChatHead />
============================================================================= */

class MessengerChatHead extends React.Component {
  constructor() {
    super();

    this.state = {
      messengerModal: false
    };
  }

  render() {
    const { user } = this.props;
    if (!user && user.id) {
      return false;
    } else {
      return (
        <View style={[styles.container, this.props.style]}>
          <TouchableOpacity onPress={this.onPress}>
            <ProfilePicture userID={user.id} size={PROFILE_PICTURE_SIZE} />
            <Image
              style={styles.logo}
              source={require("./img/chathead-logo.png")}
            />
          </TouchableOpacity>
          <MessengerModal
            visible={this.state.messengerModal}
            dismiss={_ => this.setState({ messengerModal: false })}
          />
        </View>
      );
    }
  }

  onPress = _ => {
    const { user } = this.props;
    // If possible, try and link to friend's fb profile URL. If friend object
    // has no profile link, go to m.me to contact them via Messenger instead
    const userUrl = user.link || "https://m.me";
    GLinking.openURL(userUrl).catch(() =>
      this.setState({ messengerModal: true })
    );
  };
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT
  },
  logo: {
    position: "absolute",
    right: 0,
    bottom: 0
  }
});

/* export
============================================================================= */
export default MessengerChatHead;
