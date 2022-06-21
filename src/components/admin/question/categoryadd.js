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

function Categoryadd() {
  const [inputname, setInputname] = useState("");
  const [numberUser, setNumberUser] = useState([]);
  let { userId } = useParams();
  let history = useHistory();
  const { path } = useRouteMatch();

  useEffect(() => {
    firestore
    .collection("questions")
    .doc(userId)
    .collection("categorys")
    .orderBy("datetime", "asc")
    .onSnapshot((snapshot) => {
      setNumberUser(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            category_name: doc.data().category_name,
          };
        })
      );
    });
  }, []);

  const num= numberUser.length;

  const addQuestion = () => {
    firestore.collection("questions").doc(userId).collection("categorys").doc(`${userId}00${num+1}`).set({
      categoryId: `${userId}00${num+1}`,
      category_name: inputname,
      questionId: userId,
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
            <h5>เพิ่มหมวดคำถาม</h5>
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
                label="ชื่อหมวด"
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
export default Categoryadd;
