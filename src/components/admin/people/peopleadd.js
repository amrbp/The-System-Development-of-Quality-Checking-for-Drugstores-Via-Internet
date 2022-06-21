import React, { useState } from "react";
import { firestore } from "../../../database/firebase";
import firebase from "firebase";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";
import { AddCircleOutlineRounded } from "@material-ui/icons";
import { Button, TextField, Container } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 210,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function App() {
  const [inputID, setInputID] = useState("");
  const [inputpassword, setInputpassword] = useState("");
  const [inputname, setInputname] = useState("");
  const [inputgender, setInputgender] = useState("female");
  const [inputage, setInputage] = useState("");
  const [inputtel, setInputtel] = useState("");
  const { path } = useRouteMatch();
  let history = useHistory();
  const [role, setRole] = useState("");
  const classes = useStyles();

  const handleChangeBox = (event) => {
    setRole(event.target.value);
  };

  const handleChange = (event) => {
    setInputgender(event.target.value);
  };

 
  const addPeople = () => {
    firestore.collection("peoples").doc(inputID).set({
      id: inputID,
      password: inputpassword,
      name: inputname,
      garder: inputgender,
      age: inputage,
      tel: inputtel,
      role: role,
      datetime: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInputID("");
    setInputpassword("");
    setInputname("");
    setInputage("");
    setInputtel("");
    setRole("");
    history.push("/admin/people");
  };
  const goBack = () => {
    history.push("/admin/people");
  };

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
              marginTop: -4,
            }}
          >
            <h5>จัดการผู้ใช้งาน</h5>
          </div>
          <br />

          <Container>
            <form noValidate align="center">
              <TextField
                variant="outlined"
                margin="normal"
                id="ID"
                label="รหัสประจำตัวผู้ประเมิน"
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
                id="password"
                label="รหัสผ่าน"
                name="password"
                autoFocus
                value={inputpassword}
                onChange={(event) => setInputpassword(event.target.value)}
              />
              <br />
              <TextField
                variant="outlined"
                margin="dense"
                size="small"
                id="name"
                label="ชื่อ"
                name="name"
                autoFocus
                value={inputname}
                onChange={(event) => setInputname(event.target.value)}
              />
              <br />
              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend"></FormLabel>
                <RadioGroup
                  row
                  aria-label="gender"
                  name="gender1"
                  value={inputgender}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="หญิง"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="ชาย"
                  />
                </RadioGroup>
              </FormControl>
              <br />
              <TextField
                variant="outlined"
                margin="dense"
                size="small"
                id="age"
                label="อายุ"
                name="age"
                autoFocus
                value={inputage}
                onChange={(event) => setInputage(event.target.value)}
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
              <FormControl
                variant="outlined"
                size="small"
                className={classes.formControl}
              >
                <InputLabel htmlFor="role">ตำแหน่ง</InputLabel>
                <Select
                  native
                  value={role.role}
                  onChange={handleChangeBox}
                  label="ตำแหน่ง"
                  inputProps={{
                    name: "role",
                    id: "role",
                  }}
                >
                  <option aria-label="None" value="" />
                  <option value={"member"}>เภสัชกรผู้ลงตรวจพื้นที่</option>
                  <option value={"permium"}>
                    เจ้าหน้าที่สำนักงานสาธารณสุขจังหวัด
                  </option>
                </Select>
              </FormControl>
              <br />
              <br></br>
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
                  (!inputID, !inputpassword, !inputname, !inputage, !inputtel)
                }
                startIcon={<AddCircleOutlineRounded />}
              >
                บันทึก
              </Button>
            </form>
          </Container>
          <br></br>
        </Route>
      </Switch>
    </div>
  );
}
export default App;
