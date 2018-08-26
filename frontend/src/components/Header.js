import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, FormGroup, InputGroup, FormControl, Button, Col, OverlayTrigger, Popover,
} from 'react-bootstrap';

export default class Header extends React.Component {
  renderPopover(exampleListener) {
    return (
      <Popover id="popover-feedback">
        <p>
          Inside Cornell roster scheduler, click on the Share Schedule button
          under share <span className="glyphicon glyphicon-share" /> and copy
          the generated link to clipboard,
        </p>
        <p>
          or check out an example
          <span className="example-btn" onClick={exampleListener}> here</span>.
        </p>
      </Popover>
    );
  }
  render() {
    const {
      link, linkChangeListener, submissionListener, exampleListener,
    } = this.props;
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
                  placeholder="Paste share link from scheduler"
                  onChange={linkChangeListener}
                />
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  overlay={this.renderPopover(exampleListener)}
                >
                  <span className="glyphicon glyphicon-question-sign form-control-feedback"/>
                </OverlayTrigger>
              </InputGroup>
            </Col>
            <Col xs={4} sm={3} md={2}>
              <Button
                bsStyle="danger"
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
  exampleListener: PropTypes.func.isRequired,
  submissionListener: PropTypes.func.isRequired,
};
