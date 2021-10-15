import { useState } from 'react';

import MapContainer from './MapContainer';

const TaskMap = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  navigator?.geolocation.getCurrentPosition(
    ({ coords: { latitude: lat, longitude: lng } }) => {
      const pos = { lat, lng };
      setCurrentLocation(pos);
    }
  );
  return (
    <>
      <div>
        <MapContainer currentLocation={currentLocation} zoom={4}></MapContainer>
        ;
      </div>
    </>
  );
};

export default TaskMap;
