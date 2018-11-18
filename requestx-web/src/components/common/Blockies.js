import React, { Component } from 'react';

/*eslint no-bitwise: [0, { allow: [">>"] }] */
/*eslint no-bitwise: [0, { allow: ["<<"] }] */
/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

export default class Identicon extends Component {
  constructor(props) {
    super(props);
    this.state = { className: undefined };
    this.generateIdenticon = this.generateIdenticon.bind(this);
  }

  componentDidMount() {
    this.generateIdenticon({ ...this.props });
  }

  componentWillUpdate(nextProps) {
    if (!this.isEquivalent(this.props, nextProps)) this.generateIdenticon({ ...nextProps });
  }

  isEquivalent(prevProps, nextProps) {
    const aProps = Object.getOwnPropertyNames(prevProps);
    const bProps = Object.getOwnPropertyNames(nextProps);

    if (aProps.length !== bProps.length) {
      return false;
    }

    for (let i = 0; i < aProps.length; i += 1) {
      const propName = aProps[i];

      if (prevProps[propName] !== nextProps[propName]) {
        return false;
      }
    }

    return true;
  }

  generateIdenticon(options) {
    const clsName =
      options.className !== undefined ? `identicon ${options.className}` : 'identicon';
    this.setState({ className: clsName });
    // NOTE --  Majority of this code is referenced from: https://github.com/alexvandesande/blockies
    //          Mostly to ensure congruence to Ethereum Mist's Identicons

    // The random number is a js implementation of the Xorshift PRNG
    const randseed = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

    function seedrand(seed) {
      for (let i = 0; i < randseed.length; i += 1) {
        randseed[i] = 0;
      }
      for (let i = 0; i < seed.length; i += 1) {
        randseed[i % 4] = (randseed[i % 4] << 5) - randseed[i % 4] + seed.charCodeAt(i);
      }
    }

    function rand() {
      // based on Java's String.hashCode(), expanded to 4 32bit values
      const t = randseed[0] ^ (randseed[0] << 11);

      randseed[0] = randseed[1];
      randseed[1] = randseed[2];
      randseed[2] = randseed[3];
      randseed[3] = randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8);

      return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
    }

    function createColor() {
      // saturation is the whole color spectrum
      const h = Math.floor(rand() * 360);
      // saturation goes from 40 to 100, it avoids greyish colors
      const s = `${rand() * 60 + 40}%`;
      // lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
      const l = `${(rand() + rand() + rand() + rand()) * 25}%`;

      const color = `hsl(${h},${s},${l})`;
      return color;
    }

    function createImageData(size) {
      const width = size; // Only support square icons for now
      const height = size;

      const dataWidth = Math.ceil(width / 2);
      const mirrorWidth = width - dataWidth;

      const data = [];
      for (let y = 0; y < height; y += 1) {
        let row = [];
        for (let x = 0; x < dataWidth; x += 1) {
          // this makes foreground and background color to have a 43% (1/2.3) probability
          // spot color has 13% chance
          row[x] = Math.floor(rand() * 2.3);
        }
        const r = row.slice(0, mirrorWidth);
        r.reverse();
        row = row.concat(r);

        for (let i = 0; i < row.length; i += 1) {
          data.push(row[i]);
        }
      }

      return data;
    }

    function setCanvas(identicon, imageData, color, scale, bgcolor, spotcolor) {
      const width = Math.sqrt(imageData.length);
      const size = width * scale;

      identicon.width = size;
      identicon.style.width = `${size}px`;

      identicon.height = size;
      identicon.style.height = `${size}px`;

      const cc = identicon.getContext('2d');
      cc.fillStyle = bgcolor;
      cc.fillRect(0, 0, identicon.width, identicon.height);
      cc.fillStyle = color;

      for (let i = 0; i < imageData.length; i += 1) {
        // if data is 2, choose spot color, if 1 choose foreground
        cc.fillStyle = imageData[i] === 1 ? color : spotcolor;

        // if data is 0, leave the background
        if (imageData[i]) {
          const row = Math.floor(i / width);
          const col = i % width;

          cc.fillRect(col * scale, row * scale, scale, scale);
        }
      }
    }

    const opts = options || {};
    const size = 10;
    const scale = opts.scale || 4;
    const { seed } = opts;

    seedrand(seed);

    const color = opts.color || createColor();
    const bgcolor = opts.bgColor || createColor();
    const spotcolor = opts.spotColor || createColor();
    const imageData = createImageData(size);
    const canvas = setCanvas(this.identicon, imageData, color, scale, bgcolor, spotcolor);

    return canvas;
  }

  render() {
    const {
      state: { className }
    } = this;
    return (
      <canvas
        ref={identicon => {
          this.identicon = identicon;
        }}
        className={className !== undefined ? className : 'identicon'}
      />
    );
  }
}
