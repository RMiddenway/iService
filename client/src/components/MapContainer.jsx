import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import React, { useState } from 'react';

const MapContainer = (props) => {
  // const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

  return (
    <Map
      google={props.google}
      zoom={13}
      initialCenter={props.currentLocation}
      center={props.currentLocation}
    >
      {/* <Marker onClick={this.onMarkerClick} name={"Current location"} /> */}

      {/* <InfoWindow onClose={this.onInfoWindowClose}> */}
      {/* <div><h1>{this.state.selectedPlace.name}</h1></div> */}
      {/* </InfoWindow> */}
    </Map>
  );
};
export default GoogleApiWrapper({
  apiKey: "AIzaSyDUCMDUivWwkXhxIaV7Uvwu3kOYU-LPx4k",
})(MapContainer);
