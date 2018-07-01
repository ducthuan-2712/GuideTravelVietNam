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
import { connect } from "react-redux";

// Components
import { 
  View,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";
import { Heading4, Heading5 } from "../../../../common/GText";
import StyleSheet from "../../../../common/GStyleSheet";

// Page
import Info from "./info/Info"
import List from "./list/List"
import Choose from "./choose/Choose"

// Config
import {
  updateMyPlanerSavedOffline
} from "../../../../actions";

type Props = {

};

class SwitchContainer extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {};

    this.handleSwitch = this.handleSwitch.bind(this)
    this.handleDirection = this.handleDirection.bind(this)
    this.handle = this.handle.bind(this)
    this.handChoose = this.handChoose.bind(this)
  }

  handleSwitch(value) {
    this.props.dispatch(updateMyPlanerSavedOffline(value))
  }

  handleDirection(session) {
    this.props.navigator.push({
      map: session,
      types: true
    })
  }

  handle(session, getIndex, index) {
    this.props.navigator.push({
      detail: session
    })
  }

  handChoose(slug) {
    switch(slug) {
      case 'saved_placed':
        this.handleSavedPlaced()
        break;
      case 'food_drink':
        this.handleFoodDrink()
        break;
      case 'getting_around':
        this.handleGettingAround()
        break;
      default:
    }
  }

  handleSavedPlaced() {
    // Realm
  }

  handleFoodDrink() {
    // This feature will be release in next version
  }

  handleGettingAround() {
    // This feature will be release in next version
  }

  render() {
    const { plan } = this.props;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          directionalLockEnabled={false}
          scrollEventThrottle={100}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Choose onPress={this.handChoose} />
          <Info
            plan={plan}
            checkedSaved={plan.show.checkedSaved}
            onPress={this.handleSwitch}
          />
          {plan.detail.map((data, index) => {
            return (
              <List
                key={`list-${index}-box`}
                index={index+1}
                source={data}
                onPressDirection={this.handleDirection}
                onPress={this.handle}
              />
            )
          })}
        </ScrollView>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f7'
  },
});

module.exports = connect()(SwitchContainer);
