import React from 'react';
import { cos } from '../helpers';

export class Image extends React.Component {

  componentDidMount () {
    const { node, editor } = this.props;
    const file = node.data.get('file');
    const srcUrl = node.data.get('url');  
    if (srcUrl) {
      this.setState({
        url: srcUrl,
        loaded: true,
      });
      return;
    }  
    cos.sliceUploadFile({
      Bucket: 'sparker-1252588471',
      Region: 'ap-guangzhou',
      Key: file.name + Date.now(),
      Body: file,
    }, (err, data) => {
      if (!data) {
        return;
      }
      editor.change(c => c.setNodeByKey(node.key, { data: { url: `//${data.Location}`, file: null }}));
    });
  }

  render () {
    const { node, editor } = this.props;
    const srcUrl = node.data.get('url');
    return srcUrl ? <img src={srcUrl} alt='preview'/> : <span>Loading</span>;
  }
}

export async function insertImage(transform, file) {
  const imageUrl = await new Promise((resolve, reject) => {
    cos.sliceUploadFile({
      Bucket: 'sparker-1252588471',
      Region: 'ap-guangzhou',
      Key: file.name,
      Body: file,
    }, (err, data) => {
      if (!data) {
        return;
      }
      const imageUrl = `//${data.Location}`;
      resolve(imageUrl);
    });
  });
};
