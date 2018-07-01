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
 * @providesModule GImage
 * @flow
 */

'use strict';

import React from "react";
import {
  View,
  Image,
  ActivityIndicator,
  Animated
} from "react-native";
import GColors from "./GColors";

type Props = {
  sizeWidth?: number;
  sizeHeight?: number;
  sizeBorderRadius?: number;
  source: string;
  type: 'primary' | 'custom' | 'popup';
};

class GImage extends React.Component {
  props: Props;
  static defaultProps = {
    sizeWidth: 64,
    sizeHeight: 64,
    sizeBorderRadius: 32,
    source: null,
    type: 'primary'
  };

  constructor(props: Props) {
    super(props);
    this.state = { 
      isLoading: true,
      fadeAnim: new Animated.Value(1),
    };
  }

  changeBackground() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 0,
        duration: 200,
      }
    ).start(() => this.setState({ 
      isLoading: false
    }));
  }

  render(): ReactElement {
    var {sizeWidth, sizeHeight, sizeBorderRadius, source, type, style, borderRadius} = this.props;
    
    return (
      <View style={{width: sizeWidth, height: sizeHeight, borderRadius: sizeBorderRadius, backgroundColor: '#ddd'}}>
        <Animated.View 
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#ddd',
            opacity: this.state.fadeAnim,
            justifyContent: 'center', 
            alignItems: 'center', 
            borderRadius: sizeBorderRadius
          }}>
          <ActivityIndicator
            size="small"
            color={GColors.darkBackground}
          />
        </Animated.View>
        <Image 
          source={{ uri: source }}
          onLoadEnd={() => this.changeBackground()}
          style={{flex: 1, borderRadius: sizeBorderRadius}} />
      </View>
    );
  }
}

module.exports = GImage;
