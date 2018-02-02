import React from 'react';
import { cos } from '../helpers';

export class Image extends React.Component {

  state = {
    loaded: false,
    url: '',
  };

  componentDidMount () {
    const { node, editor } = this.props;
    const srcUrl = node.data.get('url');  
    if (srcUrl) {
      this.setState({
        url: srcUrl,
        loaded: true,
      });
      return;
    }
  }

  render () {
    const { loaded, url } = this.state;
    return loaded ? <img src={url} alt='preview'/> : <span>Loading</span>;
  }
}

export function insertImage(transform, file) {
  return new Promise((resolve, reject) => {
    cos.sliceUploadFile({
      Bucket: 'sparker-1252588471',
      Region: 'ap-guangzhou',
      Key: file.name + Date.now(),
      Body: file,
    }, (err, data) => {
      if (!data) {
        return;
      }
      const imageUrl = `//${data.Location}`;
      resolve(transform.insertBlock({
        type: 'image',
        isVoid: true,
        data: { url: imageUrl }
      }));
    });
  });
};
