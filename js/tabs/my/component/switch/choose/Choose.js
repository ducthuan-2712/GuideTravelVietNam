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
  Image,
  ScrollView
} from "react-native";
import { Text, Heading5 } from "../../../../../common/GText";
import StyleSheet from "../../../../../common/GStyleSheet";
import GColors from "../../../../../common/GColors";

class Choose extends React.Component {
  render() {
    const list = [
      {
        icon: require("../img/icon_saved.png"),
        name: 'Saved Placed',
        slug: 'saved_placed'
      },
      // {
      //   icon: require("../img/icon_food.png"),
      //   name: 'Food Drink',
      //   slug: 'food_drink'
      // },
      // {
      //   icon: require("../img/icon_getting_around.png"),
      //   name: 'Getting Around',
      //   slug: 'getting_around'
      // },
    ]

    return (
      <ScrollView
        style={styles.container}
        directionalLockEnabled={false}
        scrollEventThrottle={100}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal={true}
      >
        {list.map((session, index) => {
          return (
            <TouchableOpacity
              key={`return-key-${index}`}
              activeOpacity={1} 
              onPress={_ => this.props.onPress(session.slug)}
              style={styles.box}
            >
              <Image style={styles.icon} source={session.icon} />
              <Text style={styles.text}>{session.name}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GColors.secondMain,
    borderRadius: 6,
    marginRight: 15,
    android: {
      elevation: 1
    }
  },
  icon: {
    width: 56,
    height: 52,
  },
  text: {
    marginRight: 15,
    color: GColors.white,
  }
});

module.exports = Choose;
