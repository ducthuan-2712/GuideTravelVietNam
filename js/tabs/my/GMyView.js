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
import { Navigator } from "react-native-deprecated-custom-components";

// Components
import { 
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  InteractionManager,
  Alert
} from "react-native";
import GColors from "../../common/GColors";
import ListContainer from "../../common/ListContainer";
import GActivityIndicator from "../../common/GActivityIndicator";

// Page
import GMyContainer from "./component/GMyContainer";
import SwitchContainer from "./component/switch/SwitchContainer"

// Config
import {
  updateMyPlanerSwitch,
  resetAll
} from "../../actions";

type Props = {
  navigator: Navigator;
};

class GMyView extends React.Component {
  props: Props;

  static contextTypes = {
    openDrawer: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {}

    this.openMenuDrawwer = this.openMenuDrawwer.bind(this)
    this.deleteTrip = this.deleteTrip.bind(this)
    this.editTrip = this.editTrip.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
  }

  openMenuDrawwer() {
    this.context.openDrawer();
  }

  handleClose() {
    Promise.resolve(
      this.props.dispatch(updateMyPlanerSwitch(false))
    ).then(() => {
      this.props.dispatch(resetAll())
    })
  }

  handleSwitch() {
    this.props.dispatch(updateMyPlanerSwitch(true))
  }

  deleteTrip() {
    Alert.alert(
      'Dữ liệu đã xoá sẽ không thể phục hồi lại',
      'Bạn có chắc chắn muốn xoá',
      [
        {text: 'Đồng ý', onPress: _ => this.handleClose()},
        {text: 'Huỷ bỏ', onPress: _ => console.log('Cancel Pressed!')},
      ]
    )
  }

  editTrip() {
    this.props.navigator.push({
      plan: true,
      isEdit: true
    })
  }

  render() {
    const { destination, plan } = this.props;    

    const backItem = {
      title: "Menu",
      layout: "icon",
      icon: require("../../common/img/header/menu.png"),
      onPress: this.openMenuDrawwer
    }

    let rightItem, leftItem
    if(plan.switch) {
      rightItem = {
        title: "Clear",
        layout: "icon",
        icon: require("../../common/img/header/delete.png"),
        onPress: this.deleteTrip
      }

      leftItem = {
        title: "Edit",
        layout: "icon",
        icon: require("../../common/img/header/edit_blue.png"),
        onPress:  this.editTrip
      }
    }

    return (
      <ListContainer
        title="My Trip"
        headerBackgroundColor={GColors.white}
        headerTitleColor={GColors.black}
        headerItemsColor={GColors.black}
        navItem={backItem}
        leftItem={leftItem}
        rightItem={rightItem}
      >
        {plan.switch ? this.renderSwitchContainer() : this.renderGMyContainer()}
      </ListContainer>
    )
  }

  renderSwitchContainer() {
    return (
      <SwitchContainer
        title={this.props.plan.show.name}
        plan={this.props.plan}
        navigator={this.props.navigator}
      />
    )
  }

  renderGMyContainer() {
    return (
      <GMyContainer
        destination={this.props.destination}
        plan={this.props.plan}
        navigator={this.props.navigator}
        onPress={this.handleSwitch}
      />
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

function select(store) {
  return {
    destination: store.destination.results,
    plan: store.plan.plan
  };
}
module.exports = connect(select)(GMyView);
