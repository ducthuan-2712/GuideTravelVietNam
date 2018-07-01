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
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Navigator } from "react-native-deprecated-custom-components";
import GColors from '../common/GColors';
import GDrawerLayout from '../common/GDrawerLayout';
import MenuItem from './MenuItem';

// Pages
import GTripView from './trip/GTripView';
import GMyView from './my/GMyView';

// Config
import { switchTab } from '../actions';
import type { Tab } from '../reducers/navigation';

type Props = {
  tab: Tab;
  onTabSelect: (tab: Tab) => void;
  navigator: Navigator;
};

class GTabsView extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);

    this.renderNavigationView = this.renderNavigationView.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
  }

  getChildContext() {
    return {
      openDrawer: this.openDrawer,
      //hasUnreadNotifications: this.props.notificationsBadge > 0,
    };
  }

  openDrawer() {
    this.refs.drawer.openDrawer();
  }

  onTabSelect(tab: Tab) {
    if (this.props.tab !== tab) {
      this.props.onTabSelect(tab);
    }
    this.refs.drawer.closeDrawer();
  }

  renderNavigationView() {
    var accountItem = (
      <Image 
        source={require('./img/logo.png')} 
        style={{width: 250, height: 38}}
      />
    );

    return (
      <View style={styles.drawer}>
        <View 
          style={styles.header}>
          {accountItem}
        </View>
        <MenuItem
          title="Trust Me"
          selected={this.props.tab === 'trip'}
          onPress={this.onTabSelect.bind(this, 'trip')}
          icon={require('./trip/img/trip-icon.png')}
          selectedIcon={require('./trip/img/trip-icon-active.png')}
        />
        <MenuItem
          title="My Trip"
          selected={this.props.tab === 'my'}
          onPress={this.onTabSelect.bind(this, 'my')}
          icon={require('./my/img/my-icon.png')}
          selectedIcon={require('./my/img/my-icon-active.png')}
        />
      </View>
    );
  }

  renderContent() {
    switch (this.props.tab) {
      case 'trip':
        return <GTripView navigator={this.props.navigator} />;

      case 'my':
        return <GMyView navigator={this.props.navigator} />;
    }
    throw new Error(`Unknown tab ${this.props.tab}`);
  }

  render() {
    return (
      <GDrawerLayout
        ref="drawer"
        drawerWidth={290}
        drawerPosition="left"
        renderNavigationView={this.renderNavigationView}>
        <View style={styles.content} key={this.props.tab}>
          {this.renderContent()}
        </View>
      </GDrawerLayout>
    );
  }
}

GTabsView.childContextTypes = {
  openDrawer: React.PropTypes.func
};

var styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3f6072',
  }
});

function select(store) {
  return {
    tab: store.navigation.tab,
  };
}

function actions(dispatch) {
  return {
    onTabSelect: (tab) => dispatch(switchTab(tab))
  };
}

module.exports = connect(select, actions)(GTabsView);
