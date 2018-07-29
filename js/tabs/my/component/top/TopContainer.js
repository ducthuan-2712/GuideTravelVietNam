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
  TouchableOpacity,
  Image
} from "react-native";
import { Heading4, Heading5, Text } from "../../../../common/GText";
import StyleSheet from "../../../../common/GStyleSheet";
import GButton from "../../../../common/GButton";
import GColors from "../../../../common/GColors";

type Props = {

};

class TopContainer extends React.Component {
  props: Props;

  render() {
    const { myTitleSelectCalendarFr, myTitleSelectCalendarTo, myTitleSelectWith } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.calendar}>
          <TouchableOpacity 
            style={styles.containers}
            accessibilityTraits="button"
            activeOpacity={0.8}
            onPress={_ => this.props.onPress()}
          >
            <View style={styles.iCon}>
              <Image 
                source={require('../../img/icon-date.png')}
              />
            </View>
            <View style={styles.info}>
              <Heading5 style={styles.h5}>When?</Heading5>
              {myTitleSelectCalendarFr
                ? <Heading4 style={[styles.h4, styles.h4Select]}>
                    <Text style={[styles.h5, styles.h4Custom]}>From </Text>{myTitleSelectCalendarFr} <Text style={[styles.h5, styles.h4Custom]}>  To </Text>{myTitleSelectCalendarTo}
                  </Heading4>
                : <Heading4 style={[styles.h4, styles.h4Custom]}>
                    Select a range date
                  </Heading4>
              }
            </View>
          </TouchableOpacity>
        </View>
        {/*<View style={styles.line} />*/}
        {/*<View style={styles.with}>
                  <TouchableOpacity 
                    style={styles.containers}
                    accessibilityTraits="button"
                    activeOpacity={0.8}
                    onPress={_ => this.props.onPressWith()}
                  >
                    <View style={styles.widthInfo}>
                      <Heading5 style={styles.h5}>With?</Heading5>
                      {myTitleSelectWith
                        ? <Heading4 style={[styles.h4, styles.h4Select]}>
                            {myTitleSelectWith}
                          </Heading4>
                        : <Heading4 style={[styles.h4, styles.h4Custom]}>
                            Alone
                          </Heading4>
                      }
                    </View>
                  </TouchableOpacity>
                </View>*/}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  calendar: {
    flex: 1,
    paddingRight: 15
  },
  line: {
    width: 1,
    backgroundColor: GColors.lightSilver,
  },
  containers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  widthInfo: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingLeft: 30
  },
  info: {
    flex: 1,
    paddingHorizontal: 15
  },
  h5: {
    fontSize: 12
  },
  h4: {
    fontSize: 14,
    padding: 0,
    margin: 0,
    lineHeight: 18,
    height: 18
  },
  h4Select: {

  },
  h4Custom: {
    color: GColors.darkSilver,
  }
});

module.exports = TopContainer;
