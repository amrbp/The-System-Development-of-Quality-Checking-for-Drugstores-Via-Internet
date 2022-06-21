import React, { useState, useEffect } from "react";
import { firestore } from "../../../database/firebase";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import { Button, TextField, Container } from "@material-ui/core";

function Addquestion() {
  const [inputname, setInputname] = useState("");
  const [numberUser, setNumberUser] = useState([]);
  let history = useHistory();

  useEffect(() => {
    firestore
      .collection("questions")
      .orderBy("datetime", "desc")
      .onSnapshot((snapshot) => {
        setNumberUser(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              name: doc.data().question_name,
            };
          })
        );
      });
  }, []);

  const num = numberUser.length;

  const addQuestion = () => {
    firestore
      .collection("questions")
      .doc(`0${num + 1}`)
      .set({
        questionId: `0${num + 1}`,
        question_name: inputname,
        datetime: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setInputname("");
    history.goBack();
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
        <h3>เพิ่มแบบฟอร์ม</h3>
      </div>
      <br />
      <br />
      <Container maxWidth="sm">
        <form noValidate>
          <TextField
            variant="outlined"
            margin="dense"
            size="small"
            fullWidth
            id="name"
            label="ชื่อแบบประเมิน"
            name="name"
            autoFocus
            value={inputname}
            onChange={(event) => setInputname(event.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={addQuestion}
            disabled={!inputname}
          >
            บันทึก
          </Button>
        </form>
      </Container>
    </div>
  );
}
export default Addquestion;
