import React, { useState, useEffect } from "react";
import { useParams, Route, Switch, useRouteMatch } from "react-router-dom";
import { firestore } from "../../../database/firebase";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "date-fns";
import HistorySubquestion from "./historySubquestion";

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
              question_answers: doc.data().question_answers,
              category_name: doc.data().category_name,
              category_answers: doc.data().category_answers,
              totals_answers: doc.data().totals_answers,
              allanswers: doc.data().allanswers,
            };
          })
        );
      });
  }, [questionId]);

  const subquestions = [];
  const sumSubquestion = [];
  const resultSub = [];
  var sum = 0;
  {
    scores.map((score) =>
      score.question_answers.map((ans) => {
        ans.categoryId === subquestionId && subquestions.push(ans);
      })
    );
  }

  {
    scores.map((score) =>
      score.question_answers.map((ans) => {
        ans.categoryId === subquestionId &&
          sumSubquestion.push(Number(ans.score));
      })
    );
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
                  <th>คะแนน</th>
                </tr>
              </thead>
              <tbody>
                {subquestions.map((sub, index) => (
                  <tr key={index}>
                    <td>
                      {subquestionId}00{index + 1}
                    </td>
                    <td>{sub.id}</td>
                    <td>{sub.score}</td>
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
