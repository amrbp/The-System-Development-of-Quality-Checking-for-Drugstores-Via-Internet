import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import { makeStyles } from "@material-ui/core/styles";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { Button } from "@material-ui/core";
import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";
import { useRouteMatch, useHistory, useParams } from "react-router-dom";
import { firestore } from "../../../database/firebase";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const libraries = ["places"];
const mapContainerStyle = {
  height: "70vh",
  width: "95vw",
};
const options = {
  styles: mapStyles,
  zoomControl: true,
};
const center = {
  lat: 43.6532,
  lng: -79.3832,
};

const useStyles = makeStyles((theme) => ({
  materialicons: {
    position: "absolute",
    zIndex: 101,
    marginTop: -80,
    marginLeft: "5%",
  },
}));

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBfRfBoWpVsXE_nj_inmIGru3sGkaWeQqY",
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const { url, path } = useRouteMatch();
  let { positionId } = useParams();
  let history = useHistory();
  const onMapClick = React.useCallback((e) => {
    setMarkers([
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      },
    ]);
  }, []);
  console.log(markers);
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  const addposition = () => {
    firestore.collection("pharmacys").doc(positionId).update({
      position: markers,
    });
    history.push("/admin/pharmacy");
  };
  return (
    <div>
      <div
        style={{
          flexGrow: 1,
          backgroundColor: "#1DB1DF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 60,
          color: "#ffffff",
          marginTop: -4,
        }}
      >
        <h5>ตำแหน่ง</h5>
      </div>

      <br />
      <Search panTo={panTo} />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GoogleMap
          id="map"
          mapContainerStyle={mapContainerStyle}
          zoom={16}
          center={center}
          options={options}
          onClick={onMapClick}
          onLoad={onMapLoad}
        >
          {markers.map((marker) => (
            <Marker
              key={`${marker.lat}-${marker.lng}`}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => {
                setSelected(marker);
              }}
              onCloseClick={() => {
                setSelected(null);
              }}
            />
          ))}

          {selected ? (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => {
                setSelected(null);
              }}
            >
              <div>
                <h2>ตรงนี้</h2>
              </div>
            </InfoWindow>
          ) : null}
        </GoogleMap>
        <br></br>
      </div>
      <Locate panTo={panTo} />
      <div style={{ zIndex: 100, marginTop: -60 }}>
        <center>
          <Button variant="contained" color="primary" onClick={addposition}>
            ยืนยัน
          </Button>
        </center>
      </div>
      <br></br>
      <br></br>
    </div>
  );
}

function Locate({ panTo }) {
  const classes = useStyles();
  return (
    <Fab
      title="ตำแหน่งปัจจุบัน"
      aria-label="ตำแหน่งปัจจุบัน"
      color="primary"
      className={classes.materialicons}
      size="medium"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <GpsFixedIcon />
    </Fab>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 100 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <div className="search">
      <center>
        <Avatar
          style={{
            width: "80%",
            color: "#000000",
            backgroundColor: "#e0e0e0",
            borderRadius: 15,
            marginLeft: "10%",
            position: "absolute",
            marginTop: 70,
            zIndex: 100,
          }}
          variant="square"
        >
          <Combobox style={{ width: "95%" }} onSelect={handleSelect}>
            <ComboboxInput
              style={{
                width: "95%",
                borderRadius: 15,
                border: 5,
              }}
              value={value}
              onChange={handleInput}
              disabled={!ready}
              placeholder=" ค้นหาตำแหน่ง"
            />
            <ComboboxPopover>
              <ComboboxList>
                {status === "OK" &&
                  data.map(({ id, description }) => (
                    <ComboboxOption key={id} value={description} />
                  ))}
              </ComboboxList>
            </ComboboxPopover>
          </Combobox>
        </Avatar>
      </center>
      <br></br>
    </div>
  );
}
