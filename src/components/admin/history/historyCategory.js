import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  useParams,
  Route,
  Switch,
  useRouteMatch,
  Link,
} from "react-router-dom";
import { firestore } from "../../../database/firebase";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "date-fns";
import HistorySubquestion from "../../permium/historySubquestion";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Pdfs } from "../../permium/download";
import { deepOrange, green } from "@material-ui/core/colors";
import Container from "@material-ui/core/Container";
import { Font } from "@react-pdf/renderer";
import Pdfimage from "./img/pdf.png";
import font from "../../../font/THSarabun.ttf";
Font.register({ family: "THSarabun", src: font });

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  square: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  rounded: {
    color: "#fff",
    backgroundColor: green[500],
  },
}));

export default function FullWidthTabs() {
  const classes = useStyles();
  let { questionId, pharmacyId, categoryId, finishId } = useParams();
  const { url, path } = useRouteMatch();
  const [scores, setScores] = useState([]);
  const [historys, setHistory] = useState([]);

  const allId = [];
  allId.push(questionId, pharmacyId, categoryId);

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
  }, [questionId, pharmacyId, categoryId, finishId]);

  const all = [];
  const result = [];
  const titles = [];
  const array1 = [];
  const array2 = [];
  const array3 = [];
  const array4 = [];
  const array5 = [];
  const title1 = [];
  const title2 = [];
  const title3 = [];
  const title4 = [];
  const title5 = [];
  const key1 = [];
  const key2 = [];
  const key3 = [];
  const key4 = [];
  const key5 = [];
  var total1 = 0;
  var total2 = 0;
  var total3 = 0;
  var total4 = 0;
  var total5 = 0;
  const avg = [];
  const avgsum = [];
  {
    scores.map((score, index) => {
      score.question_answers.map((answer, b) => {
        answer.categoryId === "01001" && array1.push(Number(answer.score));
        answer.categoryId === "01002" && array2.push(Number(answer.score));
        answer.categoryId === "01003" && array3.push(Number(answer.score));
        answer.categoryId === "01004" && array4.push(Number(answer.score));
        answer.categoryId === "01005" && array5.push(Number(answer.score));
      });
    });
  }
  {
    scores.map((score, index) => {
      score.question_answers.map((answer, b) => {
        answer.categoryId === "03001" && array1.push(Number(answer.score));
        answer.categoryId === "03002" && array2.push(Number(answer.score));
        answer.categoryId === "03003" && array3.push(Number(answer.score));
        answer.categoryId === "03004" && array4.push(Number(answer.score));
        answer.categoryId === "03005" && array5.push(Number(answer.score));
      });
    });
  }
  {
    scores.map((score, index) => {
      score.question_answers.map((answer, b) => {
        answer.categoryId === "02001" && array1.push(Number(answer.score));
        answer.categoryId === "02002" && array2.push(Number(answer.score));
        answer.categoryId === "02003" && array3.push(Number(answer.score));
        answer.categoryId === "02004" && array4.push(Number(answer.score));
        answer.categoryId === "02005" && array5.push(Number(answer.score));
      });
    });
  }

  {
    scores.map((category, index) => {
      category.category_answers.map((answer, b) => {
        answer.categoryId === "01001" && title1.push(answer.category_name);
        answer.categoryId === "01002" && title2.push(answer.category_name);
        answer.categoryId === "01003" && title3.push(answer.category_name);
        answer.categoryId === "01004" && title4.push(answer.category_name);
        answer.categoryId === "01005" && title5.push(answer.category_name);
      });
    });
  }

  {
    scores.map((category, index) => {
      category.category_answers.map((answer, b) => {
        answer.categoryId === "02001" && title1.push(answer.category_name);
        answer.categoryId === "02002" && title2.push(answer.category_name);
        answer.categoryId === "02003" && title3.push(answer.category_name);
        answer.categoryId === "02004" && title4.push(answer.category_name);
        answer.categoryId === "02005" && title5.push(answer.category_name);
      });
    });
  }

  {
    scores.map((category, index) => {
      category.category_answers.map((answer, b) => {
        answer.categoryId === "03001" && title1.push(answer.category_name);
        answer.categoryId === "03002" && title2.push(answer.category_name);
        answer.categoryId === "03003" && title3.push(answer.category_name);
        answer.categoryId === "03004" && title4.push(answer.category_name);
        answer.categoryId === "03005" && title5.push(answer.category_name);
      });
    });
  }

  {
    scores.map((category, index) => {
      category.category_answers.map((answer, b) => {
        answer.categoryId === "01001" && key1.push(answer.categoryId);
        answer.categoryId === "01002" && key2.push(answer.categoryId);
        answer.categoryId === "01003" && key3.push(answer.categoryId);
        answer.categoryId === "01004" && key4.push(answer.categoryId);
        answer.categoryId === "01005" && key5.push(answer.categoryId);
      });
    });
  }

  {
    scores.map((category, index) => {
      category.category_answers.map((answer, b) => {
        answer.categoryId === "02001" && key1.push(answer.categoryId);
        answer.categoryId === "02002" && key2.push(answer.categoryId);
        answer.categoryId === "02003" && key3.push(answer.categoryId);
        answer.categoryId === "02004" && key4.push(answer.categoryId);
        answer.categoryId === "02005" && key5.push(answer.categoryId);
      });
    });
  }
  {
    scores.map((category, index) => {
      category.category_answers.map((answer, b) => {
        answer.categoryId === "03001" && key1.push(answer.categoryId);
        answer.categoryId === "03002" && key2.push(answer.categoryId);
        answer.categoryId === "03003" && key3.push(answer.categoryId);
        answer.categoryId === "03004" && key4.push(answer.categoryId);
        answer.categoryId === "03005" && key5.push(answer.categoryId);
      });
    });
  }

  for (var i = 0; i < array1.length; i++) {
    total1 += array1[i];
  }
  for (var i = 0; i < array2.length; i++) {
    total2 += array2[i];
  }
  for (var i = 0; i < array3.length; i++) {
    total3 += array3[i];
  }
  for (var i = 0; i < array4.length; i++) {
    total4 += array4[i];
  }
  for (var i = 0; i < array5.length; i++) {
    total5 += array5[i];
  }

  result.push(
    {
      category_answer: (total1 / 100) * 100,
      category_name: title1.toString(),
      categoryId: key1.toString(),
    },
    {
      category_answer: (total2 / 100) * 100,
      category_name: title2.toString(),
      categoryId: key2.toString(),
    },
    {
      category_answer: (total3 / 100) * 100,
      category_name: title3.toString(),
      categoryId: key3.toString(),
    },
    {
      category_answer: (total4 / 100) * 100,
      category_name: title4.toString(),
      categoryId: key4.toString(),
    },
    {
      category_answer: (total5 / 100) * 100,
      category_name: title5.toString(),
      categoryId: key5.toString(),
    }
  );

  avg.push(Number(total1 + total2 + total3 + total4 + total5));
  avgsum.push(total1, total2, total3, total4, total5);

  return (
    <div>
      <div>
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
                      {new Date(
                        history.datetime.seconds * 1000
                      ).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                      })}
                    </span>
                  </div>
                ))}
              </div>

              <br></br>
              <br></br>
              <div>
                <Container maxWidth="lg">
                  <div style={{ float: "right" }}>
                    <PDFDownloadLink
                      document={<Pdfs data={allId} />}
                      fileName="PDF.pdf"
                    >
                      <img src={Pdfimage} width="40" />
                    </PDFDownloadLink>
                  </div>
                </Container>
                <br />
                <br />
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>หมวดที่</th>
                      <th>รายละเอียด</th>
                      <th>ร้อยละ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.map((resu, index) => (
                      <tr key={index}>
                        <td>หมวดที่ {index + 1}</td>
                        <Link
                          to={`${url}/historySubquestions/${resu.categoryId}`}
                        >
                          <td>{resu.category_name}</td>
                        </Link>
                        <td>{resu.category_answer.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="2">ร้อยละเฉลี่ย</td>
                      <td>{avg.map((a) => a)}</td>
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
      </div>
    </div>
  );
}
