import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setLastLocation } from '../location/locationSlice';
import MapContainer from './MapContainer';

const TaskMap = (props) => {
  const lastLocation = useSelector((state) => state.location.lastLocation);
  const dispatch = useDispatch();
  // const [currentLocation, setCurrentLocation] = useState({ lastLocation });
  navigator?.geolocation.getCurrentPosition(
    ({ coords: { latitude: lat, longitude: lng } }) => {
      const pos = { lat, lng };
      dispatch(setLastLocation(pos));
      // setCurrentLocation(pos);
    }
  );
  console.log(lastLocation);
  return (
    <>
      <div>
        <MapContainer
          currentLocation={lastLocation}
          zoom={4}
          tasks={props.tasks}
          onMarkerClick={props.onMarkerClick}
          onMarkerMouseover={props.onMarkerMouseover}
        ></MapContainer>
        ;
      </div>
    </>
  );
};

export default TaskMap;
