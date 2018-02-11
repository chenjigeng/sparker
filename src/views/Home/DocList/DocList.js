import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DocItem } from './DocItem';
import { CreateDocButton } from './CreateDocButton';
import './DocList.less';

export class DocList extends React.Component {

  static propTypes = {
    docs: PropTypes.array.isRequired,
    commonInfo: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  render () {

    const { docs, commonInfo: { isLogin }, history } = this.props;


    return (
      <div 
        className="doc-list"
      >
        { docs.map((doc) => <DocItem key={doc.docId} doc={doc} history={history}/>) }
        { isLogin && <CreateDocButton history={history} /> }        
      </div>
    );
  }
}
