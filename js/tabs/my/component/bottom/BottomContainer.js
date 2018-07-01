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

'use strict';

// Depdencies
import React from "react";

// Components
import { 
  View,
  TouchableOpacity,
  Image
} from "react-native";
import { Heading4, Heading5 } from "../../../../common/GText";
import StyleSheet from "../../../../common/GStyleSheet";
import GButton from "../../../../common/GButton";


type Props = {

};

class BottomContainer extends React.Component {
  props: Props;

  render() {
    const { plan } = this.props;

    return (
      <TouchableOpacity 
        style={styles.container}
        accessibilityTraits="button"
        activeOpacity={0.8}
        onPress={_ => this.props.onPress()}
      >
        <View style={styles.iCon}>
          <Image 
            source={require('../../img/icon-place.png')}
          />
        </View>
        <View style={styles.info}>
          <Heading5 style={styles.h5}>Destination?</Heading5>
          {plan.show.name
            ? <Heading4 style={[styles.h4, styles.h4Select]}>
                {plan.show.name}
              </Heading4>
            : <Heading4 style={[styles.h4, styles.h4Custom]}>
                Select a place...
              </Heading4>
          }
        </View>
        <View style={styles.iCon}>
          <Image 
            source={require('../../img/icon-arrow.png')}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  info: {
    flex: 1,
    paddingHorizontal: 15
  },
  h5: {
    fontSize: 12,
    margin: 0,
    padding: 0
  },
  h4: {
    fontSize: 14,
    padding: 0,
    margin: 0,
    lineHeight: 18,
    height: 18
  },
  h4Select: {

  },
  h4Custom: {
    color: '#c1c1c1',
  }
});

module.exports = BottomContainer;
