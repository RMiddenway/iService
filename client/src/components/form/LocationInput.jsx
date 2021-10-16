import React from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

class LocationInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: "", isLoaded: false };
  }
  searchOptions = {
    types: ["(regions)"],
  };
  loadGoogleMaps = (callback) => {
    const existingScript = document.getElementById("googlePlacesScript");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDUCMDUivWwkXhxIaV7Uvwu3kOYU-LPx4k&libraries=places";
      script.id = "googlePlacesScript";
      document.body.appendChild(script);
      //action to do after a script is loaded in our case setState
      script.onload = () => {
        if (callback) callback();
      };
    }
    if (existingScript && callback) callback();
  };

  handleChange = (address) => {
    this.setState({ address });
  };

  handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => {
        console.log(results);
        this.setState({ address: results[0].formatted_address });
        this.props.onChange({
          // address: results[0].formatted_address,
          suburb: results[0].address_components[0].long_name,
          ...getLatLng(results[0]),
        });
        // })
        return getLatLng(results[0]);
      })
      .then((latLng) => {
        console.log("Success", latLng);
        this.props.onChange(latLng);
      })
      .catch((error) => console.error("Error", error));
  };
  componentDidMount() {
    this.loadGoogleMaps(() => {
      this.setState({ ...this.state, isLoaded: true });
      console.log("LOADED");
    });
  }

  render() {
    return this.state.isLoaded ? (
      <div className="px-3 mb-3 d-flex justify-content-left">
        <div className="col-2">Task Location:</div>
        <div className="col-6 p-2">
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
            searchOptions={this.searchOptions}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: "Type your area or suburb",
                    className: "location-search-input w-100",
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
                    const className = suggestion.active
                      ? "suggestion-item--active"
                      : "suggestion-item";
                    // inline style for demonstration purpose
                    const style = suggestion.active
                      ? { backgroundColor: "#fafafa", cursor: "pointer" }
                      : { backgroundColor: "#ffffff", cursor: "pointer" };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
      </div>
    ) : (
      <h5>loading</h5>
    );
  }
}
export default LocationInput;
