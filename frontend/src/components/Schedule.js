import React from 'react';
import PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);

export default class Schedule extends React.Component {
  makeDateWithHour(hour) {
    const date = new Date();
    date.setHours(hour, 0, 0);
    return date;
  }

  makeEventStyle(event, start, end, isSelected) {
    const style = {
        backgroundColor: event.color || `#${event.hexColor}`,
        border: 0,
        boxShadow: isSelected? '0 0 5px 3px rgba(0,0,0,0.4)' : '',
    };
    return { style };
  }

  handleEventSelection(event) {
    this.props.dateChangeListener(event.start);
  }

  render() {
    const { data, date, dateChangeListener } = this.props;
    return (
      <div className="Schedule">
        <BigCalendar
          events={data}
          startAccessor='start'
          endAccessor='end'
          date={date}
          min={this.makeDateWithHour(8)}
          max={this.makeDateWithHour(22)}
          onNavigate={dateChangeListener}
          views={['week', 'day']}
          defaultView={BigCalendar.Views.WEEK}
          eventPropGetter={this.makeEventStyle}
          onSelectEvent={(event) => this.handleEventSelection(event)}
        />
      </div>
    );
  }
}

Schedule.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    course: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    schedule: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
  })).isRequired,
  date: PropTypes.instanceOf(Date),
  dateChangeListener: PropTypes.func.isRequired,
};

Schedule.defaultProps = {
  date: new Date(),
};
