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

// Components
import { 
  View,
  Switch,
  TouchableOpacity
} from "react-native";
import { Text, Heading2 } from "../../../../../common/GText";
import StyleSheet from "../../../../../common/GStyleSheet";
import GButton from "../../../../../common/GButton";
import GCell from "../../../../../common/cell/GCell";

type Props = {

};

class Info extends React.Component {
  props: Props;

  render() {
    const { index, source } = this.props;

    if(source.list.length <= 0) return null
    return (
      <View style={styles.list}>
        <View style={styles.top}>
          {this.renderDaySelected(index, source)}
          <View style={styles.right}>
            {source.list.length >= 2 &&
              <GButton
                type="custom"
                color="#6b7079"
                icon={require("../../../../../common/img/buttons/icon-direction.png")}
                caption="Directions"
                onPress={() => this.props.onPressDirection(source)}
                style={styles.btn}
              />
            }
          </View>
        </View>
        <View style={[styles.bottom, styles.box]}>
          {this.renderMap(source, index)}
        </View>
      </View>
    );
  }

  renderDaySelected(index, source) {
    return (
      <View style={styles.left}>
        <Heading2>
          Day {index}
        </Heading2>
        <Text>
          {source.selectDay}
        </Text>
      </View>
    )
  }

  renderMap(source, getIndex) {
    const content = source.list.map((session, index) => {
      return (
        <GCell
          key={`list-${index}-cell`} 
          onPress={_ => this.props.onPress(session, getIndex, index)}
          session={session}
        />
      )
    })

    return content
  }
}

var styles = StyleSheet.create({
  list: {
    marginHorizontal: 20,
    marginBottom: 20
  },
  box: {
    backgroundColor: 'white',
    borderRadius: 9,
    paddingVertical: 0,
    paddingHorizontal: 0,
    flex: 1,
    android: {
      elevation: 1,
    }
  },
  top: {
    flexDirection: 'row',
    marginBottom: 5
  },
  right: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'flex-end',
  },
  circle: {
    margin: 20
  },
  btn: {
    paddingHorizontal: 0,
    minWidth: 50,
  },
  btnCircle: {
    width: 24,
    height: 24,
    borderColor: '#fe9375',
    borderWidth: 2,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtCircle: {
    textAlign: 'center',
    color: '#fe9375'
  }
});

module.exports = Info;
