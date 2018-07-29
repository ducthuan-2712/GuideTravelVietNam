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
  Switch
} from "react-native";
import { Text } from "../../../../../common/GText";
import StyleSheet from "../../../../../common/GStyleSheet";
import GColors from "../../../../../common/GColors";

type Props = {

};

class Info extends React.Component {
  props: Props;

  render() {
    const { plan, checkedSaved } = this.props;

    return (
      <View style={styles.top}>
        <Text style={styles.title} />
        <View style={styles.box}>
          <View style={styles.date}>
            <View style={styles.subDate}>
              <Text style={styles.titleText}>
                From
              </Text>
              <Text style={styles.text}>
                {Object.keys(plan.mySelectDay)[0]}
              </Text>
            </View>
            <View style={styles.subDate}>
              <Text style={styles.titleText}>
                To
              </Text>
              <Text style={styles.text}>
                {Object.keys(plan.mySelectDay)[Object.keys(plan.mySelectDay).length-1]}
              </Text>
            </View>
          </View>
          {/*<View style={styles.save}>
                      <Text style={[styles.titleText, styles.titleTextCustom]}>
                        Saved
                      </Text>
                      <Switch
                        onValueChange={(value) => this.props.onPress(value)}
                        value={checkedSaved}
                      />
                    </View>*/}
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  top: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10
  },
  box: {
    backgroundColor: GColors.white,
    borderRadius: 9,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    android: {
      elevation: 1
    }
  },
  date: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  save: {
    borderLeftWidth: 1,
    borderLeftColor: GColors.darkSilver,
    borderStyle: 'solid',
    paddingLeft: 15
  },
  subDate: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 10
  },
  titleText: {
    fontSize: 12,
    color: GColors.silver
  },
  titleTextCustom: {
    marginLeft: 5
  },
  text: {
    marginLeft: 5,
    color: GColors.tangaroa
  }
});

module.exports = Info;
