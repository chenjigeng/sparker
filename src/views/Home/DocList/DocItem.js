import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export class DocItem extends React.Component {

  static propTypes = {
    doc: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  handleGoTo = () => {
    const { history, doc } = this.props;
    history.push(`/doc/${doc.docId}`);
  }

  render () {
    const { doc } = this.props;
    const updateTime = moment(doc.updateTime).format('YYYY-MM-DD HH:mm');

    return (
      <div className="doc-item" onClick={this.handleGoTo}>
        <div className="doc-card">
          <div className="doc-logo" />
          <div className="doc-content">
            <div>
              <span className="doc-title">{doc.name}</span>
            </div>
            <div>
              <span className="doc-time">{updateTime}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}