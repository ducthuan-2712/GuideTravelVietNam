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
import React from "react"
import { connect } from 'react-redux'

// Components
import { 
  View,
} from "react-native";
import { Text, HeaderTitle } from "../../../../common/GText";
import StyleSheet from "../../../../common/GStyleSheet";
import GButton from "../../../../common/GButton";
import GHeader from "../../../../common/GHeader";
import GColors from "../../../../common/GColors";

// Page
import GCellContainer from "../../../../common/cell/GCellContainer";

type Props = {

};

class myFilter extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {};

    this.close = this.close.bind(this);
    this.handleData = this.handleData.bind(this);
  }

  showAlertOffline() {
    Alert.alert(
      'Không có kết nối internet',
      'Vui lòng di chuyển đến vùng sóng tốt hơn và thử lại !',
      [
        {text: 'Đồng ý', onPress: () => console.log('Cancel Pressed!')},
      ]
    )
  }

  close() {
    this.props.navigator.pop()
  }

  handleData(data) {
    if (this.props.isOnline) {
      this.props.navigator.push({
        detail: data
      })
    } else {
      this.showAlertOffline()
    }
  }

  render() {
    const backItem = {
      title: "Menu",
      layout: "icon",
      icon: require("../../../../common/img/header/back-blue.png"),
      onPress: this.close
    }

    return (
      <View style={styles.container}>
        <GHeader
          title="Danh sách"
          navItem={backItem}
          backgroundColor={GColors.white}
          titleColor={GColors.black}
        />
        <GCellContainer 
          source={this.props.results}
          onPress={this.handleData}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GColors.silver
  },
});

function select(store) {
  return {
    isOnline: store.checkInternet,
  }
}

module.exports = connect(select)(myFilter)
