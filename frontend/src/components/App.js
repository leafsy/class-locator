import React from 'react';
import axios from 'axios';
import moment from 'moment';
import SplitPane from 'react-split-pane';

import Header from './Header';
import Schedule from './Schedule';
import MapHolder from './MapHolder';
import ErrorAlert from './ErrorAlert';

const data = [
   {
      "schedule":"NYNYNYN",
      "startDate":"08/23/2018",
      "course":"CS 4320",
      "endTime":"3:20PM",
      "section":"LEC 001",
      "startTime":"2:30PM",
      "endDate":"12/04/2018",
      "latlng":[
         42.445429,
         -76.484397
      ],
      "room":"Olin Hall 155",
      "color":"#677077"
   },
   {
      "schedule":"NNYNYNN",
      "startDate":"08/23/2018",
      "course":"CS 4740",
      "endTime":"2:40PM",
      "section":"LEC 001",
      "startTime":"1:25PM",
      "endDate":"12/04/2018",
      "latlng":[
         42.445429,
         -76.484397
      ],
      "room":"Olin Hall 155",
      "color":"green"
   },
   {
      "schedule":"NYNYNYN",
      "startDate":"08/23/2018",
      "course":"CS 4750",
      "endTime":"4:25PM",
      "section":"LEC 001",
      "startTime":"3:35PM",
      "endDate":"12/04/2018",
      "latlng":[
         42.443989,
         -76.484547
      ],
      "room":"Hollister Hall B14",
      "color":"#e91e63"
   },
   {
      "schedule":"NNYNYNN",
      "startDate":"08/23/2018",
      "course":"CS 4780",
      "endTime":"12:55PM",
      "section":"LEC 001",
      "startTime":"11:40AM",
      "endDate":"12/04/2018",
      "latlng":[
         42.44577564390459,
         -76.48215481743551
      ],
      "room":"Statler Hall 185-Aud",
      "color":"darkorange"
   },
   {
      "schedule":"NYNYNNN",
      "startDate":"08/23/2018",
      "course":"ECON 3130",
      "endTime":"9:55AM",
      "section":"LEC 001",
      "startTime":"8:40AM",
      "endDate":"12/04/2018",
      "latlng":[
         42.447205,
         -76.482197
      ],
      "room":"Uris Hall G01",
      "color":"brown"
   },
   {
      "schedule":"NNNNNYN",
      "startDate":"08/23/2018",
      "course":"ECON 3130",
      "endTime":"2:15PM",
      "section":"DIS 203",
      "startTime":"1:25PM",
      "endDate":"12/04/2018",
      "latlng":[
         42.448983,
         -76.481771
      ],
      "room":"Rockefeller Hall 115",
      "color":"brown"
   }
];

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

  componentDidMount() {
    this.updateData(data);
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
