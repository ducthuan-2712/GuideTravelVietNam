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

import { 
  Image,
  View,
  Dimensions
} from "react-native";
import StyleSheet from "../GStyleSheet";
import GHeader from "../GHeader";
import { Paragraph, HeaderTitle } from "../GText";

class GCellEmpty extends React.Component {
  render() {
    return (
      <View key="local" style={styles.container}>
        <Image 
          source={require('../../tabs/img/icon-active.png')}
          style={{width: 100, height: 100, marginBottom: 20}}
        />
        <HeaderTitle>Opp! Chúng tôi rất tiếc vì không tìm thấy dữ liệu.</HeaderTitle>
        <Paragraph style={styles.text}>
          Địa danh bạn tìm kiếm sẽ xuất hiện ở đây.
        </Paragraph>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'white',
    ios: {
      paddingTop: 75,
    },
    android: {
      height: Dimensions.get('window').height - GHeader.height - 25,
    }
  },
  text: {
    textAlign: 'center',
    marginBottom: 35,
  },
});

module.exports = GCellEmpty;
