import React from 'react';
import axios from 'axios';
import moment from 'moment';
import SplitPane from 'react-split-pane';

import Header from './Header';
import Schedule from './Schedule';
import MapHolder from './MapHolder';
import ErrorAlert from './ErrorAlert';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: '',
      data: [],
      date: null,
      error: false,
    }
  }

  updateData(sessions) {
    const data = sessions.map((session) => {
      const startDate = moment(session.startDate, 'MM/DD/YYYY');
      const endDate = moment(session.endDate, 'MM/DD/YYYY');
      const dateIterator = startDate.clone();
      const events = [];
      while (dateIterator <= endDate) {
        if (this.scheduleIncludesDate(dateIterator, session.schedule)) {
          events.push({
            ...session,
            title: session.course,
            start: this.makeDateWithTime(dateIterator, session.startTime),
            end: this.makeDateWithTime(dateIterator, session.endTime),
          });
        }
        dateIterator.add(1, 'day');
      }
      return events;
    }).reduce((acc, events) => acc.concat(events), []);
    const date = new Date(Math.min.apply(null, data.map((event) => event.start)));
    this.setState({ data, date });
  }

  scheduleIncludesDate(date, schedule) {
    return schedule.charAt(date.weekday()) === 'Y';
  }

  makeDateWithTime(date, timeStr) {
    return moment(date.format('MM/DD/YYYY ') + timeStr, 'MM/DD/YYYY h:mmA').toDate();
  }

  handleLinkChange(input) {
    const pos = input.lastIndexOf('/');
    const link = pos < 0 ? input : input.substring(pos + 1);
    this.setState({ link: link });
  }

  handleExample() {
    this.setState({ link: '5f07f5c8e40b6a5d2788eb7fadf56ded' });
  }

  handleSubmission() {
    axios.get(`/api/classlocator?link=${this.state.link}`)
    .then(resp => {
      this.updateData(resp.data);
    }).catch(err => {
      this.setState({ error: true });
    });
  }

  handleErrorDismiss() {
    this.setState({ error: false });
  }

  handleDateChange(date) {
    this.setState({ date });
  }

  render() {
    const { link, data, date, error } = this.state;
    return (
      <div className="App">
        <Header
          link={link}
          linkChangeListener={(e) => this.handleLinkChange(e.target.value)}
          exampleListener={() => this.handleExample()}
          submissionListener={() => this.handleSubmission()}
        />
      {
        error &&
        <ErrorAlert dismissListener={() => this.handleErrorDismiss()} />
      }
        <SplitPane split="vertical" minSize={500} maxSize={-300}>
          <Schedule
            data={data}
            date={date}
            dateChangeListener={(date) => this.handleDateChange(date)}
          />
          <MapHolder
            data={data}
            date={date}
          />
        </SplitPane>
      </div>
    );
  }
}
