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

import React from "react";
import {
  Dimensions,
  View,
  Image,
  ToolbarAndroid,
  Platform,
  TouchableOpacity,
  Alert
} from "react-native";
import { Text, HeaderTitle } from "./GText";
import GColors from "./GColors";
import GFonts from "./GFonts";
import StyleSheet from "./GStyleSheet";

/* Config
============================================================================= */

let STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 20 : 25;
if (Platform.OS === "android" && Platform.Version && Platform.Version < 21) {
  STATUS_BAR_HEIGHT = 0;
}
const HEADER_HEIGHT =
  Platform.OS === "ios" ? 45 + STATUS_BAR_HEIGHT : 60 + STATUS_BAR_HEIGHT;
const SCREEN_WIDTH = Dimensions.get("window").width;
const IOS_ITEM_TEXT_SIZE = SCREEN_WIDTH < 375 ? 10 : 13;

const FAVORITE_ICON_WIDTH = 37,
  FAVORITE_ICON_HEIGHT = 31;

export type Layout =
    'default'      // Use platform defaults (icon on Android, text on iOS)
  | 'icon'         // Always use icon
  | 'title';       // Always use title

export type Item = {
  title?: string,
  icon?: number,
  layout?: Layout,
  onPress?: () => void
};

export type Props = {
  title?: string,
  leftItem?: Item,
  rightItem?: Item,
  extraItems?: Array<Item>,
  style?: any,
  children?: any
};

class GHeaderAndroid extends React.Component {
  static height: number;
  props: Props;

  static defaultProps = {
    backgroundColor: GColors.blue,
    titleColor: GColors.yellow,
    itemsColor: GColors.white
  };

  constructor() {
    super();

    this.limitActionSelection = false;
  }

  render(): ReactElement {
    const {
      navItem,
      leftItem,
      centerItem,
      rightItem,
      extraItems,
      backgroundColor,
      titleColor
    } = this.props;

    let actions = [];
    if (leftItem) {
      const { title, icon, layout } = leftItem;
      actions.push({
        icon: layout !== "title" ? icon : undefined,
        title: title,
        show: "always"
      });
    }
    if (centerItem) {
      const { title, icon, layout } = centerItem;
      actions.push({
        icon: layout !== "title" ? icon : undefined,
        title: title,
        show: "always"
      });
    }
    if (rightItem) {
      const {title, icon, layout} = rightItem;
      actions.push({
        icon: layout !== 'title' ? icon : undefined,
        title: title,
        show: 'always',
      });
    }
    if (extraItems) {
      actions = actions.concat(extraItems.map((item) => ({
        title: item.title,
        show: 'never',
      })));
    }

    let content;
    if (React.Children.count(this.props.children) > 0) {
      content = (
        <View collapsable={false} style={{ flex: 1 }}>
          {this.props.children}
        </View>
      );
    } else {
      content = (
        <View collapsable={false} style={{ flex: 1, justifyContent: "center" }}>
          <HeaderTitle numberOfLines={1} style={{ color: titleColor }}>
            {this.props.title}
          </HeaderTitle>
        </View>
      );
    }

    return (
      <View style={[styles.header, { backgroundColor }, this.props.style]}>
        <ToolbarAndroid
          navIcon={navItem && navItem.icon}
          onIconClicked={navItem && navItem.onPress}
          title={this.props.title}
          titleColor={titleColor}
          subtitleColor={titleColor}
          actions={actions}
          onActionSelected={this.handleActionSelected.bind(this)}
          style={styles.toolbar}
        >
          {content}
        </ToolbarAndroid>
        <Text style={{ height: 0, opacity: 0 }}>{actions.length || 0}</Text>
      </View>
    );
  }

  handleActionSelected(position: number) {
    if (this.limitActionSelection) {
      return;
    }
    let items = this.props.extraItems || [];
    if (this.props.rightItem) {
      items = [this.props.rightItem, ...items];
    }
    if (this.props.leftItem) {
      items = [this.props.leftItem, ...items];
    }
    const item = items[position];
    item && item.onPress && item.onPress();
    this.limitActionSelection = true;
    setTimeout(() => {
      this.limitActionSelection = false;
    }, 1000);
  }
}

/* =============================================================================
<GHeader /> (When Platform.os is iOS)
--------------------------------------------------------------------------------
View header

============================================================================= */

class GHeaderIOS extends React.Component {
  static height: number;
  props: Props;

  static defaultProps = {
    backgroundColor: GColors.blue,
    titleColor: GColors.yellow,
    itemsColor: GColors.white
  };

  render(): ReactElement {
    const {
      navItem,
      leftItem,
      title,
      rightItem,
      backgroundColor,
      titleColor,
      itemsColor
    } = this.props;

    let left;
    if (navItem) {
      if (navItem.back) {
        navItem.icon = require("./img/back.png");
      }
      left = (
        <ItemWrapperIOS
          color={itemsColor}
          item={{ ...navItem, layout: "icon" }}
        />
      );
    } else {
      left = <ItemWrapperIOS color={itemsColor} item={leftItem} />;
    }

    const content =
      React.Children.count(this.props.children) === 0 ? (
        <HeaderTitle numberOfLines={1} style={{ color: titleColor }}>
          {title}
        </HeaderTitle>
      ) : (
        this.props.children
      );

    const right = <ItemWrapperIOS color={itemsColor} item={rightItem} />;

    return (
      <View style={[styles.header, { backgroundColor }, this.props.style]}>
        <View style={styles.leftItem}>{left}</View>
        <View
          accessible={true}
          accessibilityLabel={title}
          accessibilityTraits="header"
          style={styles.centerItem}
        >
          {content}
        </View>
        <View style={styles.rightItem}>{right}</View>
      </View>
    );
  }
}

/* =============================================================================
<ItemWrapperIOS />
--------------------------------------------------------------------------------
Item wrapper

============================================================================= */

class ItemWrapperIOS extends React.Component {
  props: {
    item: Item;
    color: string;
  };

  render(): ReactElement {
    const { item, color } = this.props;
    if (!item) {
      return null;
    }

    let content;
    const { title, icon, layout, onPress } = item;

    if (layout !== "icon" && title) {
      content = (
        <Text style={[styles.itemText, { color }]}>{title.toUpperCase()}</Text>
      );
    } else if (icon) {
      content = <Image source={icon} style={{ tintColor: color }} />;
    }

    return (
      <TouchableOpacity
        accessibilityLabel={title}
        accessibilityTraits="button"
        onPress={onPress}
        style={styles.itemWrapper}
      >
        {content}
      </TouchableOpacity>
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  toolbar: {
    android: {
      // backgroundColor: GColors.background,
      height: HEADER_HEIGHT - STATUS_BAR_HEIGHT
    }
  },
  header: {
    android: {
      paddingTop: STATUS_BAR_HEIGHT,
      paddingHorizontal: 10,
    },
    ios: {
      backgroundColor: "transparent",
      paddingTop: STATUS_BAR_HEIGHT,
      height: HEADER_HEIGHT,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }
  },
  titleTextDivider: {
    android: {
      position: "absolute",
      height: 1,
      bottom: 0,
      backgroundColor: GColors.accent
    }
  },
  leftItem: {
    flex: 1,
    alignItems: "flex-start"
  },
  centerItem: {
    flex: 2,
    alignItems: "center"
  },
  rightItem: {
    flex: 1,
    alignItems: "flex-end"
  },
  itemWrapper: {
    padding: 11
  },
  itemText: {
    fontFamily: GFonts.helvetica,
    fontSize: IOS_ITEM_TEXT_SIZE,
    color: GColors.highContrast
  },
  favoriteIcon: {
    android: {
      position: "absolute",
      width: FAVORITE_ICON_WIDTH,
      height: FAVORITE_ICON_HEIGHT,
      top: HEADER_HEIGHT / 2 - FAVORITE_ICON_HEIGHT / 2 + STATUS_BAR_HEIGHT / 2,
      right: 0
    }
  }
});

/* Playground Cards
============================================================================= */

const Header = Platform.OS === "ios" ? GHeaderIOS : GHeaderAndroid;
Header.height = HEADER_HEIGHT;
// $FlowFixMe
Header.__cards__ = define => {
  const navItem = {
    back: true,
    onPress: () => Alert.alert("Menu button pressed!")
  };
  const favoritesItem = {
    title: "Favorites",
    icon: require("./img/star.png"),
    onPress: () => Alert.alert("Favorites button pressed!")
  };
  const topicsItem = {
    title: "Topics",
    icon: require("./img/filter.png"),
    onPress: () => Alert.alert("Topics button pressed!")
  };

  define("Simple", () => <Header title="Hello, world" type="underline" />);
  define("Simple w/ Nav", () => (
    <Header title="Hello, world" navItem={navItem} />
  ));
  define("With items", () => (
    <Header
      title="Default"
      navItem={navItem}
      leftItem={favoritesItem}
      rightItem={topicsItem}
    />
  ));
  define("Forcing icons", () => (
    <Header
      title="Forcing icons"
      leftItem={{ ...favoritesItem, layout: "icon" }}
      rightItem={{ ...topicsItem, layout: "icon" }}
    />
  ));
  define("Forcing title", () => (
    <Header
      title="Forcing title"
      leftItem={{ ...favoritesItem, layout: "title" }}
      rightItem={{ ...topicsItem, layout: "title" }}
    />
  ));
  define("With content", () => {
    const alignmentStyles =
      Platform.OS === "android" ? null : { textAlign: "center" };
    return (
      <Header navItem={navItem}>
        <Text
          style={[{ color: GColors.bianca, fontSize: 13 }, alignmentStyles]}
        >
          Wed 9/23
          {"\n"}
          12:00
        </Text>
      </Header>
    );
  });
  define("With Background", () => (
    <Header
      title="With Background"
      leftItem={favoritesItem}
      rightItem={topicsItem}
      style={{ backgroundColor: GColors.pink }}
    />
  ));
  define("With light background", () => (
    <Header
      title="Light Background"
      leftItem={favoritesItem}
      rightItem={topicsItem}
      backgroundColor={GColors.yellow}
      titleColor={GColors.purple}
      itemsColor={GColors.black}
    />
  ));
};

/* Export
============================================================================= */
module.exports = Header;
