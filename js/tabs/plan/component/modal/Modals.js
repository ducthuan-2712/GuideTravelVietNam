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
  Modal,
  Image,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity
} from "react-native";
import { Text, Heading2 } from "../../../../common/GText";
import StyleSheet from "../../../../common/GStyleSheet";

import { LIST_TYPES_GOOGLE } from "../../../../env.js";

type Props = {

};

class Modals extends React.Component {
  props: Props;

  render() {
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={this.props.modalVisible}
        onRequestClose={_ => this.props.onRequestClose()}
      >
        <View style={styles.modal}>
          <View style={styles.innerModal}>
            {this.renderView()}
          </View>
        </View>
      </Modal>
    )
  }

  renderView() {
    let list = [
      {
        icon: require("../../../../common/img/type/icon-water.png"),
        name: 'Amusement Park',
        slug: 'amusement_park'
      },
      {
        icon: require("../../../../common/img/type/icon-church.png"),
        name: 'Church',
        slug: 'church'
      },
      {
        icon: require("../../../../common/img/type/icon-temple.png"),
        name: 'Temple',
        slug: 'temple'
      },
      {
        icon: require("../../../../common/img/type/icon-museum.png"),
        name: 'Museum',
        slug: 'museum'
      },
      {
        icon: require("../../../../common/img/type/icon-park.png"),
        name: 'Park',
        slug: 'park'
      },
      {
        icon: require("../../../../common/img/type/icon-campground.png"),
        name: 'Campground',
        slug: 'campground'
      }
    ]

    const content = LIST_TYPES_GOOGLE.map((session, index) => {
      let customBorder = index == LIST_TYPES_GOOGLE.length-1 ? '' : '';
      let selectedIndex = list.findIndex(
        s => s.slug === session
      );

      return (
        <TouchableOpacity
          key={`return-key-${index}`}
          activeOpacity={0.75} 
          onPress={_ => this.props.onPress(list[selectedIndex].slug)}
          style={[styles.box, customBorder]}
        >
          <Image source={list[selectedIndex].icon} />
          <Heading2 style={styles.text}>{list[selectedIndex].name}</Heading2>
        </TouchableOpacity>
      )
    })

    return content
  }
}

var styles = StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  innerModal: {
    borderRadius: 9,
    backgroundColor: '#fff', 
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  text: {
    marginLeft: 15,
  }
});

module.exports = Modals;
