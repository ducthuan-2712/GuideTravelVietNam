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
import React from 'react'
import { connect } from 'react-redux'
import { Navigator } from 'react-native-deprecated-custom-components'
// import { createSelector } from "reselect";

// Components
import { 
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  InteractionManager
} from 'react-native'
import GColors from '../../common/GColors'
import ListContainer from '../../common/ListContainer'
import GDrawerLayout from '../../common/GDrawerLayout'
import GActivityIndicator from '../../common/GActivityIndicator'
import GOffline from '../../common/GOffline'

// Page
import FilterScreen from '../common/filter/FilterScreen'
import GTripContainer from './component/GTripContainer'

// Config
import {
  loadFilterDestination,
  loadAPIFromGooglePlace,
  applyTopics,
  updateMyPlanerDestination,
  resetDestination,
  switchTab,
  updateMyPlanerSwitch,
  resetAll
} from '../../actions'

type Props = {
  navigator: Navigator;
}

class GTripView extends React.Component {
  props: Props
  _drawer: ?GDrawerLayout

  static contextTypes = {
    openDrawer: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {}

    this.openFilterScreen = this.openFilterScreen.bind(this);
    this.openMenuDrawwer = this.openMenuDrawwer.bind(this);
    this.renderNavigationView = this.renderNavigationView.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleMore = this.handleMore.bind(this);
  }

  componentDidMount() {
    if (this.checkIsOnline(this.props.isOnline)) {
      this._fetch()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isOnline !== nextProps.isOnline) {
      if (this.checkIsOnline(nextProps.isOnline)) {
        this._fetch()
      }
    }
  }

  checkIsOnline(isOnline) {
    const { detail, nearby } = this.props
    if (!isOnline && (Object.keys(detail).length == 0 || nearby.length == 0)) {
      return false
    }
    return true
  }

  _fetch() {
    const { filter } = this.props
    if (Object.keys(filter).length == 0) {
      Promise.resolve(
        this.props.dispatch(loadFilterDestination())
      ).then(() => {
        this.props.dispatch(loadAPIFromGooglePlace(filter, 'nearbysearch', 'GOOGLE_NEARBY_API')),
        this.props.dispatch(loadAPIFromGooglePlace(filter, 'details', 'GOOGLE_DETAILS_API'))
      })
    }
  }

  openMenuDrawwer() {
    this.context.openDrawer()
  }

  renderNavigationView() {
    return (
      <FilterScreen 
        results={this.props.destination}
        closeDrawer={_ => this._drawer && this._drawer.closeDrawer()}
        navigator={this.props.navigator}
        callback={this.handleCallback}
      />
    ) 
  }

  openFilterScreen() {
    if (this.checkIsOnline(this.props.isOnline)) {
      if (Platform.OS === 'ios') {
        this.props.navigator.push({
          filter: this.props.destination,
          callback: this.handleCallback
        })
      } else {
        this._drawer && this._drawer.openDrawer()
      }
    }
  }

  handleCallback(data) {
    Promise.resolve(
      this.props.dispatch(resetDestination())
    ).then(() => {
      this.props.dispatch(applyTopics(data))
    }).then(() => {
      this.props.dispatch(loadAPIFromGooglePlace(data, 'nearbysearch', 'GOOGLE_NEARBY_API')),
      this.props.dispatch(loadAPIFromGooglePlace(data, 'details', 'GOOGLE_DETAILS_API'))
    })
  }

  handleCheck() {
    if (Object.keys(this.props.plan).length != 0) {
      Promise.resolve(
        this.props.dispatch(updateMyPlanerSwitch(false))
      ).then(() => {
        this.props.dispatch(resetAll())
      }).then(() => {
        this._handleCheck()
      })
    } else {
      this._handleCheck()
    }
  }

  _handleCheck() {
    Promise.resolve(
      this.props.dispatch(updateMyPlanerDestination(this.props.filter))
    ).then(() => {
      this.props.dispatch(switchTab('my'))
    })
  }

  handleMore() {
    this.props.navigator.push({
      myFilter: this.props.nearby
    })
  }

  render() {
    const { detail, nearby } = this.props

    if (!this.checkIsOnline(this.props.isOnline)) {
      return <GActivityIndicator />
    }

    if (Platform.OS === 'ios') {
      return this.renderContent()
    }

    return (
      <View style={styles.container}>
        <GDrawerLayout
          ref={(drawer) => { this._drawer = drawer; }}
          drawerWidth={290}
          drawerPosition="right"
          renderNavigationView={this.renderNavigationView}>
          {this.renderContent()}
        </GDrawerLayout>
      </View>
    )
  }

  renderContent() {
    const { destination, filter, detail, nearby, plan, isOnline } = this.props

    const backItem = {
      title: "Menu",
      layout: "icon",
      icon: require("../../common/img/header/menu.png"),
      onPress: this.openMenuDrawwer
    }

    const rightItem = {
      title: "Filter",
      layout: "icon",
      icon: require("../../common/img/header/filter.png"),
      onPress: this.openFilterScreen
    }

    return (
      <ListContainer
        title="Trip Me"
        headerBackgroundColor={GColors.white}
        headerTitleColor={GColors.black}
        headerItemsColor={GColors.black}
        navItem={backItem}
        rightItem={rightItem}
      >
        {this.checkIsOnline(isOnline)
          ? <GTripContainer
              destination={destination}
              detail={detail}
              nearby={nearby}
              filter={filter}
              plan={plan}
              isOnline={isOnline}
              navigator={this.props.navigator}
              onPressCheck={this.handleCheck}
              onPressMore={this.handleMore}
            />
          : <GOffline />
        }
      </ListContainer>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

// const data = createSelector(
//   store => store.sessions,
//   (store, props) => props.friend.schedule,
//   (sessions, schedule) => FilterSessions.bySchedule(sessions, schedule)
// );

function select(store) {
  return {
    destination: store.destination.results,
    detail: store.destination.resultsDetail,
    nearby: store.destination.resultsNearby,
    filter: store.filter.topic,
    plan: store.plan.plan,
    isOnline: store.checkInternet,
  }
}

module.exports = connect(select)(GTripView)
