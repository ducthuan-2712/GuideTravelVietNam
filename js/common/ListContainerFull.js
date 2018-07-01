
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
 * @providesModule ListContainerFull
 */
'use strict';

var React = require('React');
var GHeader = require('GHeader');
var StyleSheet = require('GStyleSheet');
var { Text } = require('GText');
var ViewPager = require('./ViewPager');

import {
  View,
  Image,
  Dimensions,
  Animated,
  Platform,
  TouchableOpacity 
} from 'react-native';

type Props = {
  title: string;
  leftItem?: HeaderItem;
  rightItem?: HeaderItem;
  selectedSegment?: number;
  onSegmentChange?: (segment: number) => void;
  children?: any;
};

type State = {
  idx: number;
  anim: Animated.Value;
};

const EMPTY_CELL_HEIGHT = Dimensions.get('window').height;
const EMPTY_CELL_WIDTH = Dimensions.get('window').width;

class ListContainerFull extends React.Component {
  props: Props;
  state: State;
  _refs: Array<any>;

  static contextTypes = {
    openDrawer: React.PropTypes.func,
    hasUnreadNotifications: React.PropTypes.number,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      idx: this.props.selectedSegment || 0,
      anim: new Animated.Value(0),
      OldImgageAnimated: this.props.dataBackground[0].imgUrlBlur,
      CurrentImgageAnimated: this.props.dataBackground[0].imgUrlBlur,
      fadeAnim: new Animated.Value(1),
      scrollEnabled: true,
    };

    (this: any).handleShowMenu = this.handleShowMenu.bind(this);
    (this: any).handleSelectSegment = this.handleSelectSegment.bind(this);
    this._refs = [];
  }

  changeBackground() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 200,
      }
    ).start(() => this.setState({ 
      OldImgageAnimated: this.state.CurrentImgageAnimated,
      // scrollEnabled: true
    }));
  }

  render() {
    var leftItem = this.props.leftItem;
    if (!leftItem && Platform.OS === 'android') {
      leftItem = {
        title: 'Menu',
        icon: this.context.hasUnreadNotifications
          ? require('./img/hamburger-unread.png')
          : require('./img/hamburger.png'),
        onPress: this.handleShowMenu,
      };
    }

    const segments = [];
    const content = React.Children.map(this.props.children, (child, idx) => {
      segments.push(child.props.title);
      return React.cloneElement(child, {
        ref: (ref) => { this._refs[idx] = ref; },
        showsVerticalScrollIndicator: false,
        automaticallyAdjustContentInsets: false,
      });
    });

    var renderImg = (
      <View>
        <Image
          source={{ uri: this.state.OldImgageAnimated }} 
          style={{
            position: 'absolute', 
            left: 0,
            top: 0, 
            width: EMPTY_CELL_WIDTH, 
            height: EMPTY_CELL_HEIGHT, 
          }} 
        />
        <Animated.Image
          source={{ uri: this.state.CurrentImgageAnimated }}
          onLoadEnd={() => this.changeBackground()}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: EMPTY_CELL_WIDTH,
            height: EMPTY_CELL_HEIGHT,
            opacity: this.state.fadeAnim,
          }}
        />
      </View>
    );

    var bottombutton = (
      <View style={styles.bottom}>
        <TouchableOpacity 
          style={styles.btnWeather}
          onPress={() => this.updateState()}
          activeOpacity={0.8}>
          <Text style={styles.textWhite}>KHÁM PHÁ</Text>
          <View style={{marginLeft: 15, flexDirection: 'row'}}>
            <Text style={[styles.textWhite, {fontWeight: 'bold'}]}>{this.state.idx+1}</Text>
            <Text style={[styles.textWhite, {marginLeft: 5, fontSize: 11}]}>/</Text>
            <Text style={[styles.textWhite, {fontSize: 11}]}>{this.props.dataBackground.length}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );

    return (
      <View style={styles.container}>
        {renderImg}
        <View style={styles.headerWrapper}>
          <GHeader
            title={this.props.title}
            leftItem={leftItem}
            rightItem={this.props.rightItem}>
          </GHeader>
        </View>
        <ViewPager
          count={segments.length}
          selectedIndex={this.state.idx}
          onSelectedIndexChange={this.handleSelectSegment}
          scrollEnabled={this.state.scrollEnabled}>
          {content}
        </ViewPager>
        {bottombutton}
      </View>
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    if (typeof nextProps.selectedSegment === 'number' &&
        nextProps.selectedSegment !== this.state.idx) {
      this.setState({idx: nextProps.selectedSegment});
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {

  }

  updateState() {
    var state = this.props.dataBackground[this.state.idx];
    this.props.onPress(state);
  }

  handleSelectSegment(idx: number) {
    if (this.state.idx !== idx) {
      const {onSegmentChange} = this.props;
      this.setState({idx}, () => onSegmentChange && onSegmentChange(idx));

      // Check URL
      this.state.fadeAnim.setValue(0);
      this.setState({ CurrentImgageAnimated: this.props.dataBackground[idx].imgUrlBlur });
      // ISSUE BUG - Một số trường hợp không load được image nên không thể scroll tiếp được
      // if (this.props.stopScroll) {
      //   this.setState({ scrollEnabled: false });
      // }

    }
  }

  handleShowMenu() {
    this.context.openDrawer();
  }
}

const actuallyBottom = Platform.OS === 'ios' 
  ? (( Dimensions.get('window').height / 3 ) / 2) - 40 
  : (( Dimensions.get('window').height / 3 ) / 2) - 60;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bottom: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: actuallyBottom,
    left: 0,
    right: 0,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnWeather: {
    width: (Dimensions.get('window').width / 3) * 1.5,
    height: 40,
    borderRadius: 26,
    backgroundColor: '#e84d4d',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  textWhite: {
    color: '#FFF',
  },
});

module.exports = ListContainerFull;
