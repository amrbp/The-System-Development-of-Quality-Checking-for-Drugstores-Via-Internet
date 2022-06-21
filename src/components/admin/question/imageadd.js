import React, { useState, useEffect } from "react";
import {firestore} from "../../../database/firebase";
import firebase from "firebase";
import {
  useParams,
  useHistory,
  Link,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import { Button, TextField, Container } from "@material-ui/core";
import Categorylist from "./categorylist";

function Imageadd() {
  const [inputname, setInputname] = useState("");
  let { userId } = useParams();
  let history = useHistory();
  const { path } = useRouteMatch();
  const [numberUser, setNumberUser] = useState([]);

  useEffect(() => {
    firestore
          .collection("questions")
          .doc(userId)
          .collection("images")
          .orderBy("datetime", "asc")
          .onSnapshot((snapshot) => {
            setNumberUser(
              snapshot.docs.map((doc) => {
                return {
                  id: doc.id,
                  image_name: doc.data().image_name,
                };
              })
            );
          });
  }, []);

  const num= numberUser.length;

  const addQuestion = () => {
    firestore.collection("questions").doc(userId).collection("images").doc(`${num+1}`).set({
      imageId: `${num+1}`,
      image_name: inputname,
      datetime: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInputname("");
    history.goBack();
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
              marginTop:-4,
            }}
          >
            <h5>เพิ่มหัวข้อรูปภาพ</h5>
          </div>
          <br/>
          <br/>
          <Container maxWidth="sm">
            <form noValidate>
              <TextField
                variant="outlined"
                margin="dense"
                size="small"
                fullWidth
                id="name"
                label="หัวข้อคำถาม"
                name="name"
                autoFocus
                value={inputname}
                onChange={(event) => setInputname(event.target.value)}
              />

              <Link >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth5
                  onClick={addQuestion}
                  disabled={(!inputname)}
                >
                  บันทึก
                </Button>
              </Link>
            </form>
          </Container>
        </Route>
        <Route path={`${path}`}>
          <Categorylist />
        </Route>
      </Switch>
    </div>
  );
}
export default Imageadd;
