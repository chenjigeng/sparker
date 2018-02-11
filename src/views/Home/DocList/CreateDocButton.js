import React from 'react';
import { Button } from '../../../SparkComponent';
import * as apis from '../../../Apis';
import PropTypes from 'prop-types';

export class CreateDocButton extends React.Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  handleCreateDoc = () => {
    const { history } = this.props; 
    apis
      .createDoc()
      .then(res => res.json())
      .then(res => {
        console.log(res);
        history.push(`/doc/${res.docId}`, { docId: res.docId });
      });
  }

  render () {
    console.log(this.props);
    return (
      <div className="create-doc-button">
        <Button type="primary" onClick={this.handleCreateDoc}>新建文档</Button>        
      </div>
    );
  }
}