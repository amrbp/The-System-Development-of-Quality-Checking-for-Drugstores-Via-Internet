import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { firestore } from "../../database/firebase";
import { useParams } from "react-router-dom";
import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";
import Fab from "@material-ui/core/Fab";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import { makeStyles } from "@material-ui/core/styles";
import IconMen from "./pharmacist_man.png";
const libraries = ["places"];
const mapContainerStyle = {
  height: "70vh",
  width: "86vw",
};
const options = {
  styles: mapStyles,
  zoomControl: true,
};

const useStyles = makeStyles((theme) => ({
  materialicons: {
    position: "absolute",
    zIndex: 101,
    marginTop: -80,
  },
}));

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBfRfBoWpVsXE_nj_inmIGru3sGkaWeQqY",
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [locations, setLocations] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const classes = useStyles();
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);
  let { pharmacyId } = useParams();
  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(12);
  }, []);
  useEffect(() => {
    firestore
      .collection("pharmacys")
      .where("id", "==", pharmacyId)
      .onSnapshot((snapshot) => {
        setMarkers(
          snapshot.docs.map((doc) => {
            return {
              position: doc.data().position[0],
              address: doc.data().address,
              name: doc.data().name,
            };
          })
        );
      });
    navigator.geolocation.getCurrentPosition(function (position) {
      setLocations(position);
    });
  }, [pharmacyId]);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  console.log(locations.coords);
  return (
    <div>
      {markers.map((marker) => (
        <GoogleMap
          id="map"
          mapContainerStyle={mapContainerStyle}
          zoom={16}
          center={{ lat: marker.position.lat, lng: marker.position.lng }}
          options={options}
          onLoad={onMapLoad}
        >
          {markers.map((marker) => (
            <Marker
              key={`${marker.position.lat}-${marker.position.lng}`}
              position={{
                lat: marker.position.lat,
                lng: marker.position.lng,
              }}
            >
              <InfoWindow
                position={{
                  lat: marker.position.lat,
                  lng: marker.position.lng,
                }}
                onCloseClick={() => {
                  setSelected(null);
                }}
              >
                <div>
                  <h5>{marker.name}</h5>
                  <h6>{marker.address}</h6>
                  <a
                    href={`https://www.google.com/maps/@${marker.position.lat},${marker.position.lng},20z?hl=en-US`}
                  >
                    Google Map
                  </a>
                </div>
              </InfoWindow>
            </Marker>
          ))}

          <Marker
            key={`${locations.coords.latitude}-${locations.coords.longitude}`}
            position={{
              lat: locations.coords.latitude,
              lng: locations.coords.longitude,
            }}
            icon={IconMen}
          ></Marker>
        </GoogleMap>
      ))}
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
    </div>
  );
}
