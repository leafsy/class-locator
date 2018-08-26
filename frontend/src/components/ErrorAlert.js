import React from 'react';
import PropTypes from 'prop-types';
import {Alert} from 'react-bootstrap';

export default class ErrorAlert extends React.Component {
  render() {
    return (
      <Alert
        className="ErrorAlert"
        bsStyle="danger"
        onDismiss={this.props.dismissListener}
      >
        No schedule found with share link provided.
      </Alert>
    );
  }
}

ErrorAlert.propTypes = {
  dismissListener: PropTypes.func.isRequired,
};
