import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import React, { useState } from 'react';

const MapContainer = (props) => {
  // const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const arr = [3, 4];
  // arr.map()
  const containerStyle = {
    // position: "relative",
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
      {/* <Marker onClick={this.onMarkerClick} name={"Current location"} /> */}

      {/* <InfoWindow onClose={this.onInfoWindowClose}> */}
      {/* <div><h1>{this.state.selectedPlace.name}</h1></div> */}
      {/* </InfoWindow> */}
      {props.tasks.map((task) => (
        <Marker
          name={task.taskTitle}
          // todo - replace with task coordinates
          position={{ lat: task.lat, lng: task.lng }}
          // icon={{
          //   url: "/path/to/custom_icon.png",
          //   anchor: new props.google.maps.Point(32, 32),
          //   scaledSize: new props.google.maps.Size(64, 64),
          // }}
        />
      ))}
    </Map>
  );
};
export default GoogleApiWrapper({
  apiKey: "AIzaSyDUCMDUivWwkXhxIaV7Uvwu3kOYU-LPx4k",
})(MapContainer);
