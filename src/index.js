import React from 'react';
import PropTypes from 'prop-types';
import Helper from './helper.js';
import {findIndex, find} from 'lodash';
import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  IMAGE_SOURCE_KEY,
  KEY_TO_COMPARE,
  MAX_IMAGES,
} from "./constants";

class ImageStory extends React.Component {

  constructor(props) {
    super(props)
    this.shouldPrepareItems = this.shouldPrepareItems.bind(this);
    this.prepareItems = this.prepareItems.bind(this);
    this.itemsPrepared = this.itemsPrepared.bind(this);
    this.getArrangedItems = this.getArrangedItems.bind(this);
    this.getStyles = this.getStyles.bind(this);
  }


  componentWillMount() {
    let { onLoad, items } = this.props;

    this.prepareItems(items, _ => {
      if (!this._isMounted)
        return
      this.forceUpdate();
      onLoad && onLoad();
    });
  }


  componentDidMount() {
    this._isMounted = true;
  }


  componentWillReceiveProps(nextProps) {
    let { items = []} = this.props;
    let nextItems = nextProps.items;
    if (this.shouldPrepareItems(items, nextItems)) {
      this.prepareItems(nextItems, _ => {
        this._isMounted && this.forceUpdate()
      });
    }
  }


  componentWillUnmount() {
    this._isMounted = false;
  }


  shouldPrepareItems(currentItems = [], nextItems = []) {
    if (currentItems.length !== nextItems.length) return true;
    let result = false,
        index = -1;
    nextItems.forEach(item => {
      index = findIndex(currentItems, (_item) => {
        return _item[KEY_TO_COMPARE] == item[KEY_TO_COMPARE];
      });
      if (index < 0) result = true;
    });
    return result;
  }


  prepareItems(items, cb) {
    if (!items || !items.length) return;
    let oldItems = this.items || [];

    this.items = items.map((item, index) => {
      let oldItem = find(oldItems, (_item) => {
        return _item[KEY_TO_COMPARE] == item[KEY_TO_COMPARE];
      });

      return {
        ...item,
        src: item[IMAGE_SOURCE_KEY],
        loading: !oldItem && index < MAX_IMAGES,
        width: oldItem ? oldItem.width : null,
        height: oldItem ? oldItem.height : null,
      };
    });


    this.items.forEach((item, index) => {
      if (!item.loading) return;
      let i = new Image();
      i.onload = () => {
        this.items[index].width = i.width;
        this.items[index].height = i.height;
        this.items[index].loading = false;
        this.itemsPrepared() && cb();
      }
      i.onerror = () => {
        this.items.splice(index, 1);
        this.itemsPrepared() && cb();
      }
      i.src = item.src;
    })
  }


  itemsPrepared() {
    if (!this.items || !this.items.length) return;
    return !this.items.some((item) => item.loading)
  }


  getArrangedItems() {
    if (!this.itemsPrepared()) return null;
    let result = null;
    let style = this.getStyles();
    let items = this.items && this.items.filter(item => !item.loading);
    if (!items || !items.length) return null;
    let { onImageSelect } = this.props;
    style.img.cursor = onImageSelect ? 'pointer' : null;

    switch (items.length) {
      case 1: result = Helper.getOneImageLayout(items.slice(0, 1), style, onImageSelect);   break;
      case 2: result = Helper.getTwoImageLayout(items.slice(0, 2), style, onImageSelect);   break;
      case 3: result = Helper.getThreeImageLayout(items.slice(0, 3), style, onImageSelect); break;
      case 4: result = Helper.getFourImageLayout(items.slice(0, 4), style, null, onImageSelect);  break;
      default: result = Helper.getFourImageLayout(items.slice(0, 4), style, items.slice(4), onImageSelect);  break;
    }
    return result
  }

  getStyles() {
    let { width, height, rootStyle = {}} = this.props;

    let styles = {
      root: {
        backgroundColor: '#f5f5f5',
        ...rootStyle,
        width: width || DEFAULT_WIDTH,
        height: height || DEFAULT_HEIGHT,
      },
      flexContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      img: {
        boxSizing: 'border-box',
        border: 'solid 2px #fff',
        float: 'left',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',

        // maxHeight: '380px',
        maxWidth: '640px',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      more: {
        position: 'absolute',
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        color: '#fff',
        fontSize: '38px',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .4)',
      },
      playIcon: {
        fontSize: 64,
        color: 'rgba(255,255,255,0.75)',
        zIndex: 1,
      },
    };

    return styles;
  }


  render() {
    return this.getArrangedItems()
  }
}


ImageStory.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rootStyle: PropTypes.object,
  onImageSelect: PropTypes.func,
  onLoad: PropTypes.func,
}


export default ImageStory;
