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
  Image, 
  StyleSheet 
} from "react-native";
import GColors from '../../common/GColors';
import GButton from '../../common/GButton';
import ListContainer from "../../common/ListContainer";
import GActivityIndicator from "../../common/GActivityIndicator";
import { Text } from '../../common/GText';

// Pages
import PlanContainer from "./component/PlanContainer"

// Config
import { API_KEY_GOOGLE } from "../../env";
import {
  resetMyPlanerDetail
} from "../../actions";


type Props = {

};

class GPlanView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {};

    this.close = this.close.bind(this)
    this.OK = this.OK.bind(this)
  }

  _close() {
    this.props.navigator.pop()
  }

  close() {
    const { isEdit } = this.props;
    if(!isEdit) {
      Promise.resolve(
        this.props.dispatch(resetMyPlanerDetail())
      ).then(() => {
        this._close()
      })
    } else {
      this._close()
    }
  }

  _callback() {
    this.props.navigator.pop()
    this.props.callback && this.props.callback()
  }

  OK() {
    const { plan } = this.props;

    for(let i = 0; i < plan.detail.length; i++) {
      if(i == plan.detail.length - 1) {
        if(plan.detail[i].list.length > 0) {
          this._callback()
          return
        } else {
          this.close()
        }
      }
      if(plan.detail[i].list.length > 0) {
        this._callback()
        return
      }
    }
  }

  render() {
    const { plan, isEdit, destination, isOnline } = this.props;

    const backItem = {
      title: "Menu",
      layout: "icon",
      icon: require("../../common/img/header/back.png"),
      onPress: this.close
    }

    const rightItem = {
      title: "OK",
      layout: "icon",
      icon: require("../../common/img/header/confirm.png"),
      onPress: this.OK
    }

    return (
      <ListContainer
        navItem={backItem}
        headerBackgroundColor="#fe9375"
        headerTitleColor={GColors.white}
        rightItem={rightItem}
      >
        <PlanContainer
          plan={plan}
          isEdit={isEdit}
          destination={destination}
          isOnline={isOnline}
          navigator={this.props.navigator}
        />
      </ListContainer>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f7'
  },
});

function select(store) {
  return {
    destination: store.destination.results,
    plan: store.plan.plan,
    isOnline: store.checkInternet,
  }
}

module.exports = connect(select)(GPlanView)
