import React, { useState, useEffect } from "react";
import {firestore} from "../../../database/firebase";
import firebase from "firebase";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";
import { AddCircleOutlineRounded } from "@material-ui/icons";
import { Button, TextField, Container } from "@material-ui/core";
import Location from "./location";


function App() {
  const [inputID, setInputID] = useState("");
  const [inputname, setInputname] = useState("");
  const [inputowner, setInputowner] = useState("");
  const [inputoperator, setInputoperator] = useState("");
  const [inputaddress, setInputaddress] = useState("");
  const [inputtel, setInputtel] = useState("");
  const [inputfax, setInputfax] = useState("");
  const [inputphone, setInputphone] = useState("");
  const { url,path } = useRouteMatch();
  let history = useHistory();

  useEffect(() => {}, []);
  const addPeople = () => {
    firestore.collection("pharmacys").doc(inputID).set({
      id: inputID,
      name: inputname,
      nameoperator: inputoperator,
      nameowner: inputowner,
      address: inputaddress,
      tel: inputtel,
      fax: inputfax,
      phone: inputphone,
      isCom: "false",
      datetime: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInputID("");
    setInputowner("");
    setInputname("");
    setInputoperator("");
    setInputtel("");
    setInputaddress("");
    setInputfax("");
    setInputphone("");
    history.push(`${url}/Location/${inputID}`);
  };

  const goBack = () =>{
    history.push("/admin/pharmacy")
  }
  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <div
            style={{
              flexGrow: 1,
              backgroundColor: "#1DB1DF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 60,
              color: "#ffffff",
              marginTop:-4,
            }}
          >
            <h5>จัดการร้านขายยา</h5>
          </div>
          <br />

          <Container>
            <form noValidate align="center">
              <TextField
                variant="outlined"
                margin="normal"
                id="ID"
                label="เลขที่ใบอนุญาตร้านขายยา"
                name="ID"
                size="small"
                autoFocus
                value={inputID}
                onChange={(event) => setInputID(event.target.value)}
              />
              <br />

              <TextField
                variant="outlined"
                margin="dense"
                size="small"
                id="name"
                label="สถานประกอบการชื่อ"
                name="name"
                autoFocus
                value={inputname}
                onChange={(event) => setInputname(event.target.value)}
              />
              <br />

              <TextField
                variant="outlined"
                margin="dense"
                size="small"
                id="name"
                label="ชื่อผู้รับอนุญาต"
                name="name"
                autoFocus
                value={inputoperator}
                onChange={(event) => setInputoperator(event.target.value)}
              />
              <br />

              <TextField
                variant="outlined"
                margin="dense"
                size="small"
                id="owner"
                label="ผู้ดำเนินกิจการ"
                name="owner"
                autoFocus
                value={inputowner}
                onChange={(event) => setInputowner(event.target.value)}
              />
              <br />

              <TextField
                variant="outlined"
                margin="dense"
                size="small"
                id="address"
                label="ที่อยู่"
                name="address"
                autoFocus
                value={inputaddress}
                onChange={(event) => setInputaddress(event.target.value)}
              />
              <br />

              <TextField
                variant="outlined"
                margin="dense"
                size="small"
                id="tel"
                label="เบอร์โทร"
                name="tel"
                autoFocus
                value={inputtel}
                onChange={(event) => setInputtel(event.target.value)}
              />
              <br />
              <TextField
                variant="outlined"
                margin="dense"
                size="small"
                id="fex"
                label="โทรสาร"
                name="fex"
                autoFocus
                value={inputfax}
                onChange={(event) => setInputfax(event.target.value)}
              />
              <br />
              <TextField
                variant="outlined"
                margin="dense"
                size="small"
                id="phone"
                label="มือถือ"
                name="phone"
                autoFocus
                value={inputphone}
                onChange={(event) => setInputphone(event.target.value)}
              />
              <br />
              <br />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                onClick={goBack}
                >
                  ยกเลิก
                </Button>
                &nbsp;

              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth5
                onClick={addPeople}
                disabled={
                  (!inputID, !inputaddress, !inputname, !inputfax, !inputtel, !inputoperator, !inputowner, !inputphone)
                }
                startIcon={<AddCircleOutlineRounded />}
              >
                บันทึก
              </Button>
            </form>
          </Container>
          <br></br>
        </Route>
        <Route path={`${path}/Location/:positionId`}>
          <Location/>
        </Route>
      </Switch>
    </div>
  );
}
export default App;
