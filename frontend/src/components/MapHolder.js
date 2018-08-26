import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import moment from 'moment';
import { divIcon } from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

export default class MapHolder extends React.Component {
  renderDivIcon(index, event) {
    const date = this.props.date;
    const past = date > event.end;
    const current = (date >= event.start) && (date <= event.end);
    const jsx = (
      <div
        className="map-marker"
        style={{ opacity: past ? 0.3 : 1.0 }}
      >
        <span
          className="glyphicon glyphicon-map-marker"
          style={{ textShadow: current? '0 0 10px' : '' }}
        ></span>
        <div
          className="overlay"
          style={{ backgroundColor: event.color }}
        >{index}</div>
      </div>
    );
    return divIcon({
      html: ReactDOMServer.renderToStaticMarkup(jsx),
      popupAnchor: [0, -30],
    });
  }

  renderMarkers() {
    const { data, date } = this.props;
    return data
      .filter((event) => {
        return moment(date).isSame(moment(event.start), 'day');
      })
      .sort((e1, e2) => e1.start - e2.start)
      .map((event, i) => {
        return (
          <Marker
            position={event.latlng}
            key={`event${i}`}
            icon={this.renderDivIcon(i+1, event)}
          >
            <Popup>
              <h4>{event.course}</h4>
              <p>{event.section}</p>
              <p>{event.startTime} - {event.endTime}</p>
              <p>{event.room}</p>
            </Popup>
          </Marker>
        );
      });
  }

  render() {
    const markers = this.renderMarkers();
    return (
      <div className="MapHolder">
        <Map center={[42.447,-76.483]} zoom={15}>
          <TileLayer
            url='http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
        { markers }
        </Map>
      </div>
    );
  }
}

MapHolder.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    course: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    schedule: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    room: PropTypes.string.isRequired,
    latlng: PropTypes.arrayOf(PropTypes.number).isRequired,
  })).isRequired,
  date: PropTypes.instanceOf(Date),
};

MapHolder.defaultProps = {
  date: new Date(),
};
