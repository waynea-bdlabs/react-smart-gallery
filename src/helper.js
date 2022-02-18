import React from 'react';
import Layouts from './layouts.js';
import Typography from '@material-ui/core/Typography';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import {CAPTION_KEY, KEY_TO_COMPARE} from "./constants";
import companyIcon from './crowdpush_icon.png';

function Caption({text}) {
  return (
      <section style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        padding: '8px 12px',
        color: 'rgba(255,255,255,0.85)',
        backgroundColor: 'rgba(0, 0, 0, .4)',
        display: 'flex',
        alignItems: 'center',
      }}>
        <img src={companyIcon}
             style={{maxWidth: '21px'}} />
        <Typography variant="body2"
                    color="inherit"
                    noWrap={true}
                    style={{
                      margin: '0 0 0 8px',
                    }}>{text}</Typography>
      </section>
  );
}

const Helper = {

  getOneImageLayout(images, style, onImageSelect) {
    const item = images[0];
    return (
      <div style={Object.assign(style.flexContainer, style.root, {position: 'relative', height: 'auto'})}>
        {
          item[CAPTION_KEY] &&
          <Caption text={item[CAPTION_KEY]} />
        }
        {
          item.video &&
          (
              <div style={{position: 'absolute'}}>
                <PlayCircleFilledIcon style={style.playIcon} />
              </div>
          )
        }
        <img onClick={(e) => onImageSelect && onImageSelect(e, item[KEY_TO_COMPARE], 0)} src={images[0].src}
             style={Object.assign({}, style.img,  {width: '100%'})} />
      </div>
    )
  },

  getTwoImageLayout(images, style, onImageSelect) {
    let score1 = Layouts['_l2_1'].getScore(images);
    let score2 = Layouts['_l2_2'].getScore(images);

    let img1Style = { ...style.img, paddingTop: '50%', backgroundImage: `url(${images[0].src})` };
    let img2Style = { ...style.img, paddingTop: '50%', backgroundImage: `url(${images[1].src})` };

    if (score1 < score2) {
      let params = Layouts['_l2_1'].getParams();
      img1Style.width = params[0].width + '%';
      img2Style.width = params[1].width + '%';
    } else {
      let params = Layouts['_l2_2'].getParams();
      img1Style.width = params[0].width + '%';
      img2Style.width = params[1].width + '%';
    }

    const firstItem = images[0];
    const secondItem = images[1];

    return (
      <div style={{ ...style.root, ...style.flexContainer, height: 'auto', overflow: 'hidden' }}>
        <div onClick={(e) => onImageSelect && onImageSelect(e, firstItem[KEY_TO_COMPARE], 0)}
             key={1}
             style={{...img1Style, ...style.flexContainer, position: 'relative'}}>
          {
            firstItem[CAPTION_KEY] &&
            <Caption text={firstItem[CAPTION_KEY]} />
          }
          {
            firstItem.video &&
            (
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  top: 0,
                  height: '100%',
                  ...style.flexContainer,
                }}>
                  <PlayCircleFilledIcon style={style.playIcon} />
                </div>
            )
          }
        </div>
        <div onClick={(e) => onImageSelect && onImageSelect(e, secondItem[KEY_TO_COMPARE], 1)}
             key={2}
             style={{...img2Style, ...style.flexContainer, position: 'relative'}}>
          {
            secondItem[CAPTION_KEY] &&
            <Caption text={secondItem[CAPTION_KEY]} />
          }
          {
            secondItem.video &&
            (
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  top: 0,
                  height: '100%',
                  ...style.flexContainer,
                }}>
                  <PlayCircleFilledIcon style={style.playIcon} />
                </div>
            )
          }
        </div>
      </div>
    )
  },

  getThreeImageLayout(images, style, onImageSelect) {
    let best = {
      score: 999999,
      layout: 1,
      pos: [0, 1, 2],
    };
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        let x = j % 3;
        let y = (j + 1) % 3;
        let z = (j + 2) % 3;

        let score = Layouts[`_l3_${i + 1}`].getScore([images[x], images[y], images[z]]);
        if (score < best.score) best = { score: score, layout: i + 1, pos: [x, y, z]};
      }
    }
    let params = Layouts[`_l3_${best.layout}`].getParams();

    let preparedImages = [0,1,2].map((index) => {
      let item = images[best.pos[index]];
      let width = `${params[index].width}%`;
      let height = `${params[index].height}%`;
      let backgroundImage = `url(${item.src})`;
      let styl = Object.assign({}, style.img, {width, height, backgroundImage})
      return (
          <div onClick={(e) => onImageSelect && onImageSelect(e, item[KEY_TO_COMPARE], best.pos[index])} key={index}
               style={{
                 ...styl,
                 position: 'relative',
               }}>
            {
              item[CAPTION_KEY] &&
              <Caption text={item[CAPTION_KEY]} />
            }
            {
              item.video &&
              (
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                    height: '100%',
                    ...style.flexContainer,
                  }}>
                    <PlayCircleFilledIcon style={style.playIcon} />
                  </div>
              )
            }
          </div>
      );
    })
    return <div style={{...style.root}}>{preparedImages}</div>
  },

  getFourImageLayout(images, style, remainingImages, onImageSelect) {
    let best = { layout: 1, pos: [0,1,2,3]}
    best.score = Layouts['_l4_1'].getScore(images);

    for (let i = 2; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let w = j % 4;
        let x = (j + 1) % 4;
        let y = (j + 2) % 4;
        let z = (j + 3) % 4;

        let score = Layouts[`_l4_${i}`].getScore([images[w], images[x], images[y], images[z]]);
        if (score < best.score) best = { score: score, layout: i, pos: [w, x, y, z]};
      }
    }

    let params = Layouts[`_l4_${best.layout}`].getParams();
    let preparedImages = [0,1,2,3].map((index) => {
      let width = `${params[index].width}%`;
      let height = `${params[index].height}%`;
      let item = images[best.pos[index]];
      let backgroundImage = `url(${item.src})`;
      let styl = Object.assign({}, style.img, {width, height, backgroundImage})
      let showMore = index == 3 && remainingImages && remainingImages.length

      return (
            <div key={index}
                 onClick={(e) => onImageSelect && onImageSelect(e, item[KEY_TO_COMPARE], best.pos[index])}
                 style={{
                   position: 'relative',
                   ...styl,
                 }}>
              {
                (item[CAPTION_KEY] && !showMore) &&
                <Caption text={item[CAPTION_KEY]} />
              }
              {!showMore && item.video ? <PlayCircleFilledIcon style={style.playIcon} /> : null}
              {showMore ? <div style={style.more}>+ {remainingImages.length}</div> : null}
            </div>
      );
    })

    return <div style={style.root}>{preparedImages}</div>
  },

  getFiveImageLayout(images) {
    return <p>5 images not suported yet</p>
  },
};




export default Helper
