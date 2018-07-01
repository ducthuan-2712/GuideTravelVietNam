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
import { Text } from "./GText";
import { View, StyleSheet, Image } from "react-native";
import _ from 'lodash';

class GRating extends React.Component {
  static defaultProps = {
    transparent: true,
    animationType: "fade"
  };

  render() {
    const { star } = this.props;
    const rating = star === parseInt(star, 10) ? star * 2 : Math.floor((star || 0) * 2) % 2 === 0 ? Math.ceil((star || 0) * 2) : Math.floor((star || 0) * 2)

    return (
      <View style={styles.container} key={`rating-${star}`}>
        <Text style={styles.rating}>{star}</Text>
        {this.renderIcon(rating)}
      </View>
    );
  }

  renderIcon(rating) {
    return (
      <View style={styles.icon}>
        {_.range(Math.floor(rating / 2)).map(function(value) {
          return (
            <Image 
              key={`key-${value}-img`}
              source={require('./img/icon-star.png')}
              style={styles.ico}
            />
          );
        })}
        {_.range(Math.floor(rating % 2) !== 0).map(function(value) {
          return (
            <Image 
              key={`key-${value}-img-half`}
              source={require('./img/icon-star-half.png')}
              style={styles.ico}
            />
          );
        })}
      </View>
    );
  }
}

/* StyleSheet
============================================================================= */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 22
  },
  rating: {
    color: '#fe9375'
  },
  icon: {
    flexDirection: 'row',
    marginLeft: 5
  },
  ico: {
    width: 14,
    height: 12
  }
});

/* Exports
============================================================================= */
module.exports = GRating;
