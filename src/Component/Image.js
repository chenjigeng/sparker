import React from 'react';

export class Image extends React.Component {

  state = {
    loaded: false,
    url: '',
  };

  componentDidMount () {
    const node = this.props.node;
    const file = node.data.get('file');
    this.load(file);
  }

  load = (file) => {
    if (file.type === 'Buffer') {
      this.setState({
        url: file.data,
        loaded: true,
      });
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.setState({
        url: e.target.result,
        loaded: true,
      })
    };
    fileReader.readAsDataURL(file);
  }

  render () {
    const { loaded, url } = this.state;
    return loaded ? <img src={url} alt='preview'/> : <span>Loading</span>
  }
}