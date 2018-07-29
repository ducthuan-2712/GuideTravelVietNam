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
import { View, Image } from "react-native";
import StyleSheet from "./GStyleSheet";
import { Heading2, Heading4 } from "./GText";

class GOffline extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image 
          source={require('../tabs/img/icon-offline.png')}
          style={{width: 120, height: 120, marginBottom: 10}}
        />
        <Heading2 style={[styles.center, styles.h2]}>Unable to connect to the machine word</Heading2>
        <Heading4 style={styles.center}>Can not find an Internet connection or weak connections. Please connect your device to a WiFi or Cellular and try again.</Heading4>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  h2: {
    marginBottom: 10,
  },
  center: {
    textAlign: 'center',
  }
})

module.exports = GOffline
