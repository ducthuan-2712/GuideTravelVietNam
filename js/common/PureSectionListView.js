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

var React = require('React');
var GColors = require('GColors');

import { 
  View,
  Text,
  Animated,
  StyleSheet,
  SectionList
} from 'react-native';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 100,
  waitForInteraction: true,
};

type RenderElement = () => ?ReactElement;

type Props = {
  renderEmptyList?: ?RenderElement;
  renderLoadMore?: ?RenderElement;
  renderRow?: ?RenderElement;
};

type State = {};

class PureSectionListView extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      getData: props.data,
    };

    (this: any).renderHeader = this.renderHeader.bind(this);
    (this: any).renderFooter = this.renderFooter.bind(this);
    (this: any).renderItem = this.renderItem.bind(this);
  }

  _scrollPos = new Animated.Value(0);
  _scrollSinkY = Animated.event(
    [{nativeEvent: { contentOffset: { y: this._scrollPos } }}],
    {useNativeDriver: true},
  );

  componentDidUpdate() {
    return this._innerRef.getNode().recordInteraction(); // e.g. flipping logViewable switch
  }

  render() {
    return (
      <AnimatedSectionList
        {...this.props}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        SectionSeparatorComponent={() => <View style={styles.separator} />}
        onScroll={this._scrollSinkY}
        renderItem={this.renderItem}
        viewabilityConfig={VIEWABILITY_CONFIG}
        // sections={[])
        // renderSectionHeader
      />
    );
  }

  renderItem(): ?ReactClass<any> {
    return this.props.renderRow && this.props.renderRow();
  }

  renderHeader(): ?ReactClass<any> {
    return this.props.renderHeader && this.props.renderHeader();
  }

  renderFooter(): ?ReactClass<any> {
    if (this.state.getData.length === 0) {
      return this.props.renderEmptyList && this.props.renderEmptyList();
    }

    if (this.props.onLoadMore) {
      return this.props.renderLoadMore && this.props.renderLoadMore(); 
    }

    return this.props.renderFooter && this.props.renderFooter();
  }
}

var styles = StyleSheet.create({
  separator: {
    backgroundColor: GColors.borderColor,
    height: 1,
  },
});

module.exports = PureSectionListView;
