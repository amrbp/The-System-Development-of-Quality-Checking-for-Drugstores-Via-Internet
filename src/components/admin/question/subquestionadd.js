import React, { useState, useEffect } from "react";
import { firestore } from "../../../database/firebase";
import firebase from "firebase";
import {
  useParams,
  useHistory,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import { Button, TextField, Container } from "@material-ui/core";
import Subquestion from "./subquestionlist";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

function Subquestionadd() {
  const [numberUser, setNumberUser] = useState([]);
  const [inputname, setInputname] = useState("");
  const [inputscore, setInputscore] = useState("");
  const [questions, setQuestions] = useState();
  let { userId, categoryId } = useParams();
  let history = useHistory();
  const { path } = useRouteMatch();
  const [canCut, setCancut] = useState(false);
  const [close, setClose] = useState(false);
  const [Cd, setCd] = useState(false);

  const handleChange = (event) => {
    setCancut(event.target.checked);
  };

  const handleChangeCD = (event) => {
    setCd(event.target.checked);
  };
  
  const handleChangeClose = (event) => {
    setClose(event.target.checked);
  };

  useEffect(() => {
    firestore
      .collection("questions")
      .doc(userId)
      .collection("categorys")
      .where("categoryId", "==", categoryId)
      .onSnapshot((snapshot) => {
        setQuestions(
          snapshot.docs.map((doc) => {
            return {
              category_name: doc.data().category_name,
            };
          })
        );
      });

    firestore
      .collection("questions")
      .doc(userId)
      .collection("categorys")
      .doc(categoryId)
      .collection("subquestions")
      .orderBy("datetime", "asc")
      .onSnapshot((snapshot) => {
        setNumberUser(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              name: doc.data().subquestion_name,
              score: doc.data().subquestion_score,
            };
          })
        );
      });
  }, [userId, categoryId]);

  const num = numberUser.length;

  const addQuestion = () => {
    firestore
      .collection("questions")
      .doc(userId)
      .collection("categorys")
      .doc(categoryId)
      .collection("subquestions")
      .doc(`${categoryId}00${num + 1}`)
      .set({
        subquestionId: `${categoryId}00${num + 1}`,
        subquestion_name: inputname,
        subquestion_score: inputscore,
        category_name: questions[0].category_name,
        categoryId: categoryId,
        questionId: userId,
        answer_: false,
        canCut: canCut,
        CD : Cd,
        close: close,
        datetime: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setInputname("");
    setInputscore("");
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
              marginTop: -4,
            }}
          >
            <h5>เพิ่มคำถาม</h5>
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
                label="คำถาม"
                name="name"
                autoFocus
                value={inputname}
                onChange={(event) => setInputname(event.target.value)}
              />
              <TextField
                variant="outlined"
                margin="dense"
                size="small"
                fullWidth
                id="name"
                label="คะแนน"
                name="name"
                autoFocus
                value={inputscore}
                onChange={(event) => setInputscore(event.target.value)}
              />

              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={canCut}
                      onChange={handleChange}
                      name="checkedA"
                      color="primary"
                    />
                  }
                  label="สามารถตัดได้"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Cd}
                      onChange={handleChangeCD}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label="เป็นข้อ Critical Defect"
                />
              </FormGroup>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={close}
                      onChange={handleChangeClose}
                      name="checkedC"
                      color="primary"
                    />
                  }
                  label="ปิดช่องการให้คะแนน พอใช้"
                />
              </FormGroup>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth5
                onClick={addQuestion}
                disabled={(!inputname, !inputscore)}
              >
                บันทึก
              </Button>
            </form>
          </Container>
        </Route>
        <Route path={`${path}`}>
          <Subquestion />
        </Route>
      </Switch>
    </div>
  );
}
export default Subquestionadd;
