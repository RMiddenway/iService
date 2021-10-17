import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import React, { useState } from 'react';

const MapContainer = (props) => {
  const containerStyle = {
    width: "50%",
    height: "50%",
  };
  console.log(props.tasks);
  return (
    <Map
      google={props.google}
      zoom={13}
      initialCenter={props.currentLocation}
      center={props.currentLocation}
      containerStyle={containerStyle}
    >
      {props.tasks.map((task) => (
        <Marker
          name={task.taskTitle}
          // todo - replace with task coordinates
          position={{ lat: task.lat, lng: task.lng }}
          onClick={(e) => props.onMarkerClick(task._id)}
          onMouseover={(e) => props.onMarkerMouseover(task._id)}
          onMouseout={(e) => props.onMarkerMouseout()}
        />
      ))}
    </Map>
  );
};
export default GoogleApiWrapper({
  apiKey: "AIzaSyDUCMDUivWwkXhxIaV7Uvwu3kOYU-LPx4k",
})(MapContainer);
