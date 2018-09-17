import React, { Component, Fragment } from 'react';
import { Api } from '../api/api';

export default class Camera extends Component {
  api = new Api();
  videoElement = React.createRef();
  canvasElement = React.createRef();

  async componentDidMount() {
    console.log(this.videoElement);

    await this.open({ video: { facingMode: 'user' } });
  }

  open = async constraints => {
    let mediaStream = await this.api.getUserMediaInfo(constraints);
    console.log(mediaStream);
    this.videoElement.current.srcObject = mediaStream;

    this.videoElement.current.onloadedmetadata = e => {
      this.videoElement.current.play();
    };
  };

  _drawImage = () => {
    let imageWidth = this.videoElement.current.videoWidth;
    let imageHeight = this.videoElement.current.videoHeight;

    let context = this.canvasElement.current.getContext('2d');
    this.canvasElement.current.width = imageWidth;
    this.canvasElement.current.height = imageHeight;

    context.drawImage(this.videoElement.current, 0, 0, imageWidth, imageHeight);

    return { imageHeight, imageWidth };
  };

  takeBlobPhoto = () => {
    let { imageHeight, imageWidth } = this._drawImage();

    return new Promise((resolve, reject) => {
      this.canvasElement.current.toBlob(blob => {
        resolve({ blob, imageHeight, imageWidth });
      });
    });
  };

  takeBase64Photo = ({ type, quality } = { type: 'png', quality: 1 }) => {
    let { imageHeight, imageWidth } = this._drawImage();
    let base64 = this.canvasElement.current.toDataURL(`image/${type}`, quality);
    console.log('base64', base64);
    return { base64, imageHeight, imageWidth };
  };

  render() {
    return (
      <Fragment>
        <div>
          <video playsInline={true} ref={this.videoElement} />
        </div>
        <div>
          <canvas ref={this.canvasElement} />
        </div>
        <button onClick={this.takeBlobPhoto}>Take Blob Photo</button>
        <button onClick={this.takeBase64Photo}>Take Base64 Photo</button>
      </Fragment>
    );
  }
}
