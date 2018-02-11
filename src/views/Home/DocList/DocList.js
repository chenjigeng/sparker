import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DocItem } from './DocItem';
import './DocList.less';

export class DocList extends React.Component {

  static propTypes = {
    docs: PropTypes.array.isRequired,
  };

  render () {
    
    const { docs } = this.props;

    return (
      <div 
        className="doc-list"
      >
        {
          docs.map((doc) => <DocItem key={doc.docId} doc={doc} />)
        }
      </div>
    );
  }
}
