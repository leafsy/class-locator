import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, FormGroup, InputGroup, FormControl, Button, Col,
} from 'react-bootstrap';

export default class Header extends React.Component {
  render() {
    const { link, linkChangeListener, submissionListener } = this.props;
    return (
      <div className="Header container-fluid">
        <Form horizontal>
          <FormGroup controlId="formLink">
            <Col xs={8} sm={9} md={10}>
              <InputGroup>
                <InputGroup.Addon className="hidden-xs">
                  {"https://classes.cornell.edu/shared/schedule/"}
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  value={link}
                  placeholder="Paste share link from scheduler here"
                  onChange={linkChangeListener}
                />
              <span className="glyphicon glyphicon-question-sign form-control-feedback"/>
              </InputGroup>
            </Col>
            <Col xs={4} sm={3} md={2}>
              <Button
                bsStyle="primary"
                onClick={submissionListener}
              >LOAD SCHEDULE</Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

Header.propTypes = {
  link: PropTypes.string.isRequired,
  linkChangeListener: PropTypes.func.isRequired,
  submissionListener: PropTypes.func.isRequired,
};
