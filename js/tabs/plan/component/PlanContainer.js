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
  Dimensions,
  ScrollView,
  Switch,
  ActivityIndicator
} from "react-native";
import { Text } from "../../../common/GText";
import StyleSheet from "../../../common/GStyleSheet";
import GImage from "../../../common/GImage";
import GColors from "../../../common/GColors";

// Page
import Info from "./info/Info"
import List from "./list/List"
import Modals from "./modal/Modals"

// Config
import {
  updateMyPlanerDetail,
  updateMyPlanerSavedOffline
} from "../../../actions";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

type Props = {

};

class PlanContainer extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };

    this.handleSwitch = this.handleSwitch.bind(this)
    this.handleDirection = this.handleDirection.bind(this)
    this.handle = this.handle.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleChooseType = this.handleChooseType.bind(this)
    this.handleCallback = this.handleCallback.bind(this)
  }

  componentDidMount() {
    let { isEdit } = this.props;
    if(!isEdit) {
      this._fetch()
    }
  }

  _fetch() {
    let { plan } = this.props;
    let pushData = []

    for(let i = 0; i < Object.keys(plan.mySelectDay).length; i++) {
      if(i == Object.keys(plan.mySelectDay).length - 1) {
        this.props.dispatch(updateMyPlanerDetail(pushData))
      }
      pushData.push({
        selectDay: Object.keys(plan.mySelectDay)[i], 
        list: []
      })
    }
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
    const mergeArr = this.props.plan.detail
    mergeArr[getIndex].list.splice(index,1);

    this.props.dispatch(updateMyPlanerDetail(mergeArr))
  }

  handleAdd(index) {
    this.setState({ 
      modalVisible: true,
      indexModal: index
    })
  }

  handleChooseType(slug) {
    let { plan } = this.props
    let mergeArr = []

    for(let i = 0; i < plan.resultsNearby.length; i++) {
      if(slug === plan.resultsNearby[i].types[0]) {
        mergeArr.push(plan.resultsNearby[i])
      }
    }

    this.setState({ 
      modalVisible: false
    },() => {
      this.props.navigator.push({
        filter: mergeArr,
        callback: this.handleCallback
      })
    })
  }

  handleCallback(data) {
    const mergeArr = this.props.plan.detail
    mergeArr[this.state.indexModal].list.push(data)

    this.props.dispatch(updateMyPlanerDetail(mergeArr))
  }

  render() {
    const { plan } = this.props;

    return (
      <ScrollView
        style={styles.container}
        directionalLockEnabled={false}
        scrollEventThrottle={100}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.containers}>
          <View style={styles.fakeBg} />
          <Info 
            plan={plan}
            checkedSaved={plan.show.checkedSaved}
            onPress={this.handleSwitch}
          />
          {plan.detail.map((data, index) => {
            return (
              <List 
                key={`list-${index}-box`} 
                index={index}
                source={data}
                onPressDirection={this.handleDirection}
                onPress={this.handle}
                onPressAdd={this.handleAdd}
              />
            )
          })}
        </View>
        <Modals 
          modalVisible={this.state.modalVisible} 
          onPress={this.handleChooseType} 
          onRequestClose={() => this.setState({modalVisible: false})}
        />
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f7'
  },
  containers: {
    flex: 1,
  },
  fakeBg: {
    backgroundColor: '#fe9375',
    height: 60
  }
});

module.exports = connect()(PlanContainer);