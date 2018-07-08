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

import React from 'react'
import {
  View,
  Platform,
} from 'react-native'

// Components
import GColors from '../../../common/GColors'
import GHeader from '../../../common/GHeader'
import StyleSheet from '../../../common/GStyleSheet'
import ListContainer from '../../../common/ListContainer'

// Pages
import GCellContainer from '../../../common/cell/GCellContainer'

type Props = {
  dispatch: (action: any) => void;
  navigator: any;
}

class FilterScreen extends React.Component {
  props: Props

  constructor(props: Props) {
    super(props)
    this.state = {}

    this.clearFilter = this.clearFilter.bind(this);
    this.close = this.close.bind(this);
    this.handleData = this.handleData.bind(this);
  }

  handleData(data) {
    // Case verison 2 - multiple selected
    // this.state.multiData.map((item) => {
    //   if (item.id === data.id) {
    //     item.check = !item.check
    //     if (item.check === true) {
    //       return item.check
    //     } else if (item.check === false) {
    //       return item.check
    //     }
    //   }
    // })
    // this.setState({multiData: this.state.multiData})

    // Case version 1 - Single selected
    const { navigator, callback } = this.props
    requestAnimationFrame(() => {
      navigator.pop()
      callback && callback(data)
    })
  }

  render(): ReactElement {
    let leftItem, rightItem
    if (Platform.OS === 'ios' || Platform.OS === 'android' && !this.props.closeDrawer) {
      leftItem = {
        title: 'Quay về',
        layout: "icon",
        icon: require('../../../common/img/header/back.png'),
        onPress: this.close
      }
    }
    if (Platform.OS === 'android' && this.props.closeDrawer) {
      rightItem = {
        title: 'Làm mới',
        icon: require('../../../common/img/x-white.png'),
        onPress: this.clearFilter,
      }
    }

    const cell = (
      <ListContainer
        title="Tìm kiếm"
        navItem={leftItem}
        rightItem={rightItem}
        backgroundColor={GColors.darkBackground}
        headerTitleColor={GColors.white}>
        <GCellContainer 
          source={this.props.results}
          onPress={this.handleData}
        />
      </ListContainer>
    )

    if (Platform.OS === 'ios') {
      return cell
    }

    return (
      <View style={styles.container}>
        <GHeader
          title="Tìm kiếm"
          navItem={leftItem}
          rightItem={rightItem}
          titleColor={GColors.white}
          style={styles.bgSearchHeader}
        />
        <GCellContainer 
          source={this.props.results}
          onPress={this.handleData}
        />
      </View>
    )
  }

  clearFilter() {
    this.props.closeDrawer && this.props.closeDrawer()
  }

  close() {
    const { navigator } = this.props;
    requestAnimationFrame(() => {
      navigator.pop()
    })
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f7'
  },
  bgSearchHeader: {
    backgroundColor: '#3f6072',
  },
})

module.exports = FilterScreen

