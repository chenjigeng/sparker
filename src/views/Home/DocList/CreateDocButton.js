import React from 'react';
import { Button } from '../../../SparkComponent';

export class CreateDocButton extends React.Component {

  render () {
    return (
      <div className="create-doc-button">
        <Button type="primary">新建文档</Button>        
      </div>
    );
  }
}