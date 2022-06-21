import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  useParams,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
  Link,
} from "react-router-dom";
import { ListItem, ListItemText, TextField } from "@material-ui/core";
import { IconButton, Button } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import { auth, firestore } from "../../database/firebase";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "date-fns";
import firebase from "firebase";
import HistorySubquestion from "./historySubquestion";
import { AuthContext } from "../../App";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    maxwidth: 1,
    height: 58,
  },
  menuButton: {
    marginRight: theme.spacing(0),
  },
  homeButton: {
    marginLeft: theme.spacing(0),
  },

  title: {
    flexGrow: 1,
    position: "relative",
    textAlign: "center",
    color: "#ffffff",
  },
  lablebar: {
    flexGrow: 1,
    height: 58,
    maxWidth: 700,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 800,
  },
  papers: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 770,
    // paddingTop: 30,
    // paddingBottom: 30,
    // paddingLeft: 20,
  },
  image: {
    width: "auto",
    textAlign: "center",
    verticalAlign: "middle",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    paddingBottom: 20,
  },
  upper: {
    width: "auto",
    textAlign: "center",
    verticalAlign: "middle",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    position: "relative",
    padding: theme.spacing(2),
  },
  radio: {},
  score: {
    textAlign: "center",
  },
}));

export default function FullWidthTabs() {
  let {
    questionId,
    pharmacyId,
    categoryId,
    finishId,
    subquestionId,
  } = useParams();
  const { path } = useRouteMatch();
  const [scores, setScores] = useState([]);
  const [historys, setHistory] = useState([]);

  useEffect(() => {
    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("finish")
      .where("finishId", "==", finishId)
      .onSnapshot((snapshot) => {
        setHistory(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              categoryId: doc.data().categoryId,
              people_name: doc.data().people_name,
              finishId: doc.data().finishId,
              pass: doc.data().pass,
              datetime: doc.data().datetime,
            };
          })
        );
      });

    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(questionId)
      .collection("answers")
      .doc(categoryId)
      .collection("category_answers")
      .onSnapshot((snapshot) => {
        setScores(
          snapshot.docs.map((doc) => {
            return {
              answerId: doc.data().answerId,
              categoryId: doc.data().categoryId,
              name: doc.data().id,
              score: doc.data().score,
              standard_score: doc.data().standard_score,
              subquestionId: doc.data().subquestionId,
              canCut: doc.data().canCut,
            };
          })
        );
      });
  }, [questionId, pharmacyId, categoryId, finishId, subquestionId]);

  const subquestions = [];
  const sumSubquestion = [];
  const resultSub = [];
  var sum = 0;

  {
    scores.map((ans) => {
      ans.categoryId === subquestionId && subquestions.push(ans);
    });
  }
  {
    scores.map((ans) => {
      ans.categoryId === subquestionId &&
        ans.canCut === false &&
        sumSubquestion.push(Number(ans.score) * Number(ans.standard_score));
    });
  }

  for (var i = 0; i < sumSubquestion.length; i++) {
    sum += sumSubquestion[i];
  }
  resultSub.push(sum);
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
              height: 81,
              color: "#ffffff",
            }}
          >
            {historys.map((history) => (
              <div key={history.id}>
                <h5 style={{ textAlign: "center" }}>ผลการตรวจร้านขายยา</h5>
                <span>
                  {new Date(history.datetime.seconds * 1000).toLocaleDateString(
                    "th-TH",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    }
                  )}
                </span>
              </div>
            ))}
          </div>

          <br></br>
          <br></br>
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>รหัส</th>
                  <th>รายละเอียด</th>
                  <th>คะแนนที่ได้ X ค่าน้ำหนัก</th>
                </tr>
              </thead>
              <tbody>
                {subquestions.map((sub, index) => (
                  <tr key={index}>
                    <td>
                      {subquestionId}00{index + 1}
                    </td>
                    <td>{sub.name}</td>
                    <td>
                      {sub.canCut === false &&
                        Number(sub.score) * Number(sub.standard_score)}
                      {sub.canCut === true && <h6>ตัดคะแนน</h6>}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2">คะแนนรวม</td>
                  <td>{resultSub.map((a) => a)}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Route>
        <Route path={`${path}/historySubquestions/:subquestionId`}>
          <HistorySubquestion />
        </Route>
      </Switch>
    </div>
  );
}
