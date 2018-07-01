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

import Animated from "Animated";
import NativeModules from "NativeModules";
import GHeader from "./GHeader";
import GSegmentedControl from "./GSegmentedControl";
import React from "react";
import ReactNative from "react-native";
import StyleSheet from "./GStyleSheet";
import View from "View";
import ViewPager from "./ViewPager";

import GColors from "./GColors";
import ActionsOverlay from "./ActionsOverlay";

import type { Item as HeaderItem } from "./GHeader";

type Props = {
  title: string,
  leftItem?: HeaderItem,
  rightItem?: HeaderItem,
  centerItem?: HeaderItem,
  extraItems?: Array<HeaderItem>,
  selectedSegment?: number,
  selectedSectionColor: string,
  backgroundImage: number,
  backgroundColor: string,
  parallaxContent?: ?ReactElement,
  stickyHeader?: ?ReactElement,
  onSegmentChange?: (segment: number) => void,
  children?: any
};

type State = {
  idx: number,
  anim: Animated.Value,
  stickyHeaderHeight: number
};

class ListContainer extends React.Component {
  props: Props;
  state: State;
  _refs: Array<any>;
  _pinned: any;

  static defaultProps = {
    selectedSectionColor: "white"
  };

  static contextTypes = {
    openDrawer: React.PropTypes.func,
    hasUnreadNotifications: React.PropTypes.number
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      idx: this.props.selectedSegment || 0,
      stickyHeaderHeight: 0
    };

    (this: any).handleSelectSegment = this.handleSelectSegment.bind(this);
    this._refs = [];
  }

  render() {
    const segments = [];
    const content = React.Children.map(this.props.children, (child, idx) => {
      segments.push({
        title: child.props.title,
        hasUpdates: child.props.hasUpdates
      });
      return React.cloneElement(child, {
        ref: ref => {
          this._refs[idx] = ref;
        },
        // onScroll: (e) => this.handleScroll(idx, e),
        style: styles.listView,
        showsVerticalScrollIndicator: false,
        scrollEventThrottle: 16,
        // contentInset: {bottom: 141, top: 0},
        automaticallyAdjustContentInsets: false,
        // renderHeader: this.renderFakeHeader,
        scrollsToTop: idx === this.state.idx
      });
    });

    let { stickyHeader } = this.props;
    if (segments.length > 1) {
      stickyHeader = (
        <View>
          <GSegmentedControl
            values={segments}
            selectedIndex={this.state.idx}
            onChange={this.handleSelectSegment}
            backgroundColor={this.props.headerBackgroundColor}
            textColor={this.props.segmentedTextColor}
            borderColor={this.props.segmentedBorderColor}
          />
          {stickyHeader}
        </View>
      );
    }

    let modalClose;
    if (this.props.modalClose) {
      modalClose = <ActionsOverlay onPress={this.props.modalClose} />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <GHeader
            title={this.props.title}
            type={this.props.headerType}
            navItem={this.props.navItem}
            leftItem={this.props.leftItem}
            rightItem={this.props.rightItem}
            centerItem={this.props.centerItem}
            extraItems={this.props.extraItems}
            backgroundColor={this.props.headerBackgroundColor}
            titleColor={this.props.headerTitleColor}
            itemsColor={this.props.headerItemsColor}
          >
            {this.props.headerContent}
          </GHeader>
          {stickyHeader}
        </View>
        <ViewPager
          count={segments.length}
          selectedIndex={this.state.idx}
          onSelectedIndexChange={this.handleSelectSegment}
        >
          {content}
        </ViewPager>
        {modalClose}
      </View>
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      typeof nextProps.selectedSegment === "number" &&
      nextProps.selectedSegment !== this.state.idx
    ) {
      this.setState({ idx: nextProps.selectedSegment });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!NativeModules.GScrolling) {
      return;
    }

    if (
      this.state.idx !== prevState.idx ||
      this.state.stickyHeaderHeight !== prevState.stickyHeaderHeight
    ) {
      if (
        this._refs[prevState.idx] &&
        this._refs[prevState.idx].getScrollResponder
      ) {
        const oldScrollViewTag = ReactNative.findNodeHandle(
          this._refs[prevState.idx].getScrollResponder()
        );
        NativeModules.GScrolling.unpin(oldScrollViewTag);
      }
    }
  }

  handleSelectSegment(idx: number) {
    if (this.state.idx !== idx) {
      const { onSegmentChange } = this.props;
      this.setState({ idx }, () => onSegmentChange && onSegmentChange(idx));
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GColors.bianca
  },
  headerWrapper: {
    android: {
      // elevation: 2,
      backgroundColor: "transparent",
      // FIXME: elevation doesn't seem to work without setting border
      borderRightWidth: 1,
      marginRight: -1,
      borderRightColor: "transparent"
    }
  },
  listView: {
    flex: 1,
    backgroundColor: "transparent"
  }
});

module.exports = ListContainer;
