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
  Animated,
  StyleSheet,
  FlatList
} from 'react-native';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 100,
  waitForInteraction: true,
};

type Rows = Array<Object>;
type RowsAndSections = {
  [sectionID: string]: Object;
};

export type Data = Rows | RowsAndSections;
type RenderElement = () => ?ReactElement;

type Props = {
  data: Data;
  renderEmptyList?: ?RenderElement;
  renderLoadMore?: ?RenderElement;
  renderRow?: ?RenderElement;
};

type State = {
  horizontal: boolean;
  fixedHeight: boolean;
};

// _onChangeFilterText = (filterText) => {
//   this.setState({filterText});
// };

// _onChangeScrollToIndex = (text) => {
//   this._listRef.getNode().scrollToIndex({viewPosition: 0.5, index: Number(text)});
// };

// _listRef: FlatList<*>;

class PureFlatListView extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      getData: props.data,
      horizontal: false,
      fixedHeight: true,
    };

    (this: any).renderHeader = this.renderHeader.bind(this);
    (this: any).renderFooter = this.renderFooter.bind(this);
    (this: any).renderItem = this.renderItem.bind(this);
    (this: any)._getItemLayout = this._getItemLayout.bind(this);
  }

  _scrollPos = new Animated.Value(0);
  _scrollSinkX = Animated.event(
    [{nativeEvent: { contentOffset: { x: this._scrollPos } }}],
    {useNativeDriver: true},
  );
  _scrollSinkY = Animated.event(
    [{nativeEvent: { contentOffset: { y: this._scrollPos } }}],
    {useNativeDriver: true},
  );

  componentDidUpdate() {
    return this._innerRef.getNode().recordInteraction(); // e.g. flipping logViewable switch
  }

  render() {
    return (
      <AnimatedFlatList
        {...this.props}
        data={this.state.getData}
        renderItem={this.renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        getItemLayout={this.state.fixedHeight ?
          this._getItemLayout :
          undefined
        }
        horizontal={this.state.horizontal}
        key={(this.state.horizontal ? 'h' : 'v') +
          (this.state.fixedHeight ? 'f' : 'd')
        }
        legacyImplementation={false}
        numColumns={1}
        onScroll={this.state.horizontal ? this._scrollSinkX : this._scrollSinkY}
        viewabilityConfig={VIEWABILITY_CONFIG}
      />
    );
  }

  _getItemLayout(data: any, index: number): ?ReactClass<any> {
    return getItemLayout(data, index, this.state.horizontal);
  }

  renderItem(): ?ReactClass<any> {
    // if (this.state.getData.getItemCount() === 0) {
    //   continue;
    // }
    return this.props.renderRow && this.props.renderRow();
  }

  renderHeader(): ?ReactClass<any> {
    // if (this.state.getData.getItemCount() === 0) {
    //   continue;
    // }
    return this.props.renderHeader && this.props.renderHeader();
  }

  renderFooter(): ?ReactClass<any> {
    if (this.state.getData.getItemCount() === 0) {
      return this.props.renderEmptyList && this.props.renderEmptyList();
    }

    if (this.props.onLoadMore) {
      return this.props.renderLoadMore && this.props.renderLoadMore(); 
    }

    return this.props.renderFooter && this.props.renderFooter();
  }
}

const HORIZ_WIDTH = 200;
const HEADER = {height: 30, width: 100};
const SEPARATOR_HEIGHT = StyleSheet.hairlineWidth;

function getItemLayout(data: any, index: number, horizontal?: boolean) {
  const [length, separator, header] = horizontal ?
    [HORIZ_WIDTH, 0, HEADER.width] : [84, SEPARATOR_HEIGHT, HEADER.height];
  return {length, offset: (length + separator) * index + header, index};
}

var styles = StyleSheet.create({
  separator: {
    backgroundColor: GColors.borderColor,
    height: 1,
  },
});

module.exports = PureFlatListView;
