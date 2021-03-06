import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { firestore } from "../../database/firebase";
import {
  useParams,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { ListItem, ListItemText, TextField } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { Preview, print } from "react-html2pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  BlobProvider,
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import "./styles.css";




const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
  },
  image: {
    width: "50%",
    padding: 10,
  },
  centerImage: {
    alignItems: "center",
    flexGrow: 1,
  },
  text: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 50,
    paddingVertical: 30,
    color: "#212121",
    
  },
});

function Pdf() {
  const [movies, setMovies] = useState([]);
  let { questionId, pharmacyId, categoryId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [scores, setScores] = useState([]);
  const [historys, setHistorys] = useState([]);
  const [currentPost, setCurrentPost] = useState({});
  const [categorys, setCategorys] = useState([]);
  const [signature, setSignature] = useState([]);
  const [images, setImages] = useState([]);

  const allId = [];
  allId.push(
    { question: questionId },
    { pharmacy: pharmacyId },
    { category: categoryId }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await firestore
          .collection("pharmacys")
          .doc(pharmacyId)
          .get();
        let data = { title: "not found" };
        if (response.exists) {
          data = response.data();
        }
        setCurrentPost(data);

        firestore
          .collection("questions")
          .where("questionId", "==", questionId)
          .onSnapshot((snapshot) => {
            setQuestions(
              snapshot.docs.map((doc) => {
                return {
                  id: doc.id,
                  question_name: doc.data().question_name,
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
                  comment: doc.data().comment,
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
          .collection("signature")
          .onSnapshot((snapshot) => {
            setSignature(
              snapshot.docs.map((doc) => {
                return {
                  answerId: doc.data().answerId,
                  people_name: doc.data().people_name,
                  signatureUrl: doc.data().signatureUrl,
                  signatureId: doc.id,
                  status: doc.data().status,
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
          .collection("images")
          .onSnapshot((snapshot) => {
            setImages(
              snapshot.docs.map((doc) => {
                return {
                  id: doc.id,
                  nameImage: doc.data().nameImage,
                  answerId: doc.data().answerId,
                  imageUrl: doc.data().imageUrl,
                };
              })
            );
          });

        firestore
          .collectionGroup("subquestions")
          .where("questionId", "==", questionId)
          .get()
          .then((response) => {
            const fetchedMovies = [];
            response.forEach((document) => {
              const fetchedMovie = {
                id: document.id,
                ...document.data(),
              };
              fetchedMovies.push(fetchedMovie);
            });
            setMovies(fetchedMovies);
          });
      } catch (err) {
        console.error(err);
      }
    };
    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("finish")
      .where("categoryId", "==", categoryId)
      .onSnapshot((snapshot) => {
        setHistorys(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              categoryId: doc.data().categoryId,
              people_name: doc.data().people_name,
              finishId: doc.data().finishId,
              pass: doc.data().pass,
              datetime: doc.data().datetime,
              questionId: doc.data().questionId,
              name: doc.data().name,
            };
          })
        );
      });

    firestore
      .collection("questions")
      .doc(questionId)
      .collection("categorys")
      .get()
      .then((response) => {
        const fetchedCinemas = [];
        response.docs.forEach((document) => {
          const fetchedCinema = {
            id: document.id,
            ...document.data(),
          };
          fetchedCinemas.push(fetchedCinema);
        });
        setCategorys(fetchedCinemas);
      });

    fetchData();
  }, [questionId]);

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
    categorys.map((category) => {
      category.categoryId === "01001" && key1.push(category.categoryId);
      category.categoryId === "01002" && key2.push(category.categoryId);
      category.categoryId === "01003" && key3.push(category.categoryId);
      category.categoryId === "01004" && key4.push(category.categoryId);
      category.categoryId === "01005" && key5.push(category.categoryId);
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
    },
    {
      category_answer: (total2 / 100) * 100,
      category_name: title2.toString(),
    },
    {
      category_answer: (total3 / 100) * 100,
      category_name: title3.toString(),
    },
    {
      category_answer: (total4 / 100) * 100,
      category_name: title4.toString(),
    },
    {
      category_answer: (total5 / 100) * 100,
      category_name: title5.toString(),
    }
  );

  avg.push(Number(total1 + total2 + total3 + total4 + total5));
  avgsum.push(total1, total2, total3, total4, total5);

  {
    historys.map((history) => (
      <Typography gutterBottom variant="subtitle1">
        {new Date(history.datetime.seconds * 1000).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        &nbsp;
        {history.name}
      </Typography>
    ));
  }

  return (
    <div>
      <Container maxWidth="lg">
        <Preview id={"jsx-template"}>
          <div
            style={{
              height: 265,
              backgroundColor: "#6c6d70",
              textAlign: "center",
              color: "#ffffff",
            }}
          >
            <br />
            <div
              style={{
                height: 2,
                backgroundColor: "#ffffff",
                width: "80%",
                margin: "0 auto",
              }}
            ></div>
            <Typography variant="h5" gutterBottom>
              <br />
              ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
              <br />
              ???????????????????????????????????????????????????????????????????????????
              <Typography variant="subtitle1" gutterBottom>
                ??????????????????????????????????????????????????????????????????????????? ?????????????????? ???????????????????????????????????????????????????????????????????????????
                ?????????????????????
                <br />
                ????????????????????????????????????????????????????????????????????????????????????????????? ???????????????????????????????????????????????????????????????????????????
                <br />
                ?????????????????????????????????????????????????????? ???.???.????????????
              </Typography>
            </Typography>
            <br />
            <div
              style={{
                height: 2,
                backgroundColor: "#ffffff",
                width: "80%",
                margin: "0 auto",
              }}
            ></div>
          </div>
          <br />

          <div
            style={{
              display: "flex",
              marginLeft: 50,
            }}
          >
            <div
              style={{
                textAlign: "justify",
                textJustify: "inter-word",
                whiteSpace: "nowrap",
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                ??????????????????????????????????????????????????? &nbsp;....
                {historys.map((history) =>
                  new Date(history.datetime.seconds * 1000).toLocaleDateString(
                    "th-TH",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )
                )}
                .....................................................................................
                &nbsp;&nbsp;&nbsp;&nbsp; ???????????? &nbsp;...
                {historys.map((history) =>
                  new Date(history.datetime.seconds * 1000).toLocaleTimeString(
                    "th-TH"
                  )
                )}
                ...........................................................................
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                ?????????????????????????????? ??? &nbsp; ......
                {signature.map(
                  (sig) => sig.status === "?????????????????????????????? ???" && sig.people_name
                )}
                .........................................................................................................................................................................................
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                ?????????????????????????????? ??? &nbsp; ......
                {signature.map(
                  (sig) => sig.status === "?????????????????????????????? ???" && sig.people_name
                )}
                .........................................................................................................................................................................................
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                ?????????????????????????????????????????? &nbsp;.....{currentPost.id}
                .......................................................
                &nbsp;&nbsp; ?????????????????????????????????????????????????????????????????? &nbsp;...
                {currentPost.nameowner}
                ..........................................................................................
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                ??????????????? &nbsp;.....{currentPost.nameoperator}
                ...................................................................................................................................................&nbsp;&nbsp;
                ????????????????????????????????????????????????????????? (??????????????????????????????????????????????????????)
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                ??????????????????????????????????????????????????? &nbsp;......{currentPost.name}
                ...................................................................................................................................................................
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                ????????????????????? &nbsp;.....{currentPost.address}
                ...................................................................................................................................................
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                ???????????????????????? &nbsp;......{currentPost.tel}
                ............................................&nbsp;??????????????????
                &nbsp;......
                {currentPost.fax}
                ...........................................&nbsp; ??????????????????
                &nbsp;......
                {currentPost.phone}.............................................
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                ??????????????????????????????????????????????????????????????????.........?????? ??????????????????
              </Typography>
              <div style={{ marginLeft: 30 }}>
                <Typography variant="subtitle1" gutterBottom>
                  ???.......................................................................???...............??????????????????????????????????????????.......................???.
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  ???.......................................................................???...............??????????????????????????????????????????.......................???.
                </Typography>
              </div>
            </div>
          </div>

          <br />

          <Table striped bordered hover>
            <colgroup span="1" width="600"></colgroup>
            <thead>
              <tr>
                <th>
                  {questions.map((question) => (
                    <div>{question.question_name}</div>
                  ))}
                </th>
                <th>????????????????????????(???)</th>
                <th>???????????????(???)</th>
                <th>??????(???)</th>
                <th>?????????????????????????????????????????????</th>
                <th>????????????????????????????????? X ??????????????????????????????</th>
              </tr>
            </thead>
            {scores.map((score, index) =>
              score.question_answers.map((question) => (
                <tbody>
                  <tr key={index}>
                    <td colSpan="6" style={{ display: "contents" }}>
                      {question.subquestionId === "01001001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "02001001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "03001001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "01002001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "02002001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "03002001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "01003001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "02003001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "03003001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "01004001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "02004001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "03004001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "01005001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "02005001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "03005001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "01006001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "02006001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "03006001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "01007001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "02007001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "03007001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "01008001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "02008001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "03008001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "01009001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "02009001" && (
                        <div>{question.category_name}</div>
                      )}
                      {question.subquestionId === "03009001" && (
                        <div>{question.category_name}</div>
                      )}
                    </td>
                  </tr>

                  <tr key={index}>
                    <td>{question.id}</td>
                    <td style={{ textAlign: "center" }}>
                      {question.score === "0" ? (
                        <input
                          type="radio"
                          value={0}
                          name={score.id}
                          id={score.categoryId}
                          checked
                        />
                      ) : (
                        <input
                          type="radio"
                          value={0}
                          name={score.id}
                          id={score.categoryId}
                        />
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {question.score === "1" ? (
                        <div>
                          <input
                            type="radio"
                            value={1}
                            name={score.id}
                            id={score.categoryId}
                            checked
                          />
                        </div>
                      ) : (
                        <input
                          type="radio"
                          value={1}
                          name={score.id}
                          id={score.categoryId}
                        />
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {question.score === "2" ? (
                        <input
                          type="radio"
                          value={2}
                          name={score.id}
                          id={score.categoryId}
                          checked
                        />
                      ) : (
                        <input
                          disabled={true}
                          type="radio"
                          value={2}
                          name={score.id}
                          id={score.categoryId}
                        />
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {question.standard_score}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {Number(question.score) * Number(question.standard_score)}
                    </td>
                  </tr>
                </tbody>
              ))
            )}
          </Table>

          <br></br>
          <br></br>
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>?????????????????????</th>
                  <th>??????????????????????????????</th>
                  <th>??????????????????</th>
                </tr>
              </thead>
              <tbody>
                {result.map((resu, index) => (
                  <tr key={index}>
                    <td>????????????????????? {index + 1}</td>

                    <td>{resu.category_name}</td>

                    <td>{resu.category_answer.toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2">????????????????????????????????????</td>
                  <td>{avg.map((a) => a)}</td>
                </tr>
              </tbody>
            </Table>

            <br></br>
            <div>
              {avg.map((a, i) => (
                <div key={i}>
                  {a > 28.5 && (
                    <ListItem>
                      <ListItemText primary="????????????????????????????????????????????????" />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={true}
                            color="primary"
                            name="pass"
                          />
                        }
                        label="????????????"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={false}
                            name="pass"
                            color="primary"
                          />
                        }
                        label="?????????????????????"
                      />
                    </ListItem>
                  )}
                  {a < 28.5 && (
                    <ListItem>
                      <ListItemText primary="????????????????????????????????????????????????" />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={false}
                            name="pass"
                            color="primary"
                          />
                        }
                        label="????????????"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={true}
                            name="pass"
                            color="primary"
                          />
                        }
                        label="?????????????????????"
                      />
                    </ListItem>
                  )}
                </div>
              ))}
            </div>
            <div>
              <Typography variant="subtitle1" gutterBottom>
                ?????????????????????????????????????????? / ????????????????????????????????? &nbsp;{" "}
                {scores.map((score) => score.comment)}
              </Typography>
            </div>
            <br />
            <div style={{ textIndent: 50 }}>
              <Typography variant="subtitle1" gutterBottom>
                ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                / ????????????????????????????????????????????? / ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                ????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????? / ??????????????????????????????????????????
                ???????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????
              </Typography>
            </div>
            <br />
            <br />
            <br />
            <div>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <div style={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      ?????????????????? &nbsp;
                      {signature.map(
                        (sig) =>
                          sig.status === "???????????????????????????????????? / ?????????????????????????????????????????????" && (
                            <img
                              src={sig.signatureUrl}
                              width="55"
                              height="55"
                            />
                          )
                      )}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {signature.map(
                        (sig) =>
                          sig.status === "???????????????????????????????????? / ?????????????????????????????????????????????" &&
                          sig.status
                      )}
                      <br />(
                      {signature.map(
                        (sig) =>
                          sig.status === "???????????????????????????????????? / ?????????????????????????????????????????????" &&
                          sig.people_name
                      )}
                      )
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      ?????????????????? &nbsp;
                      {signature.map(
                        (sig) =>
                          sig.status === "??????????????????????????????????????????????????????????????????" && (
                            <img
                              src={sig.signatureUrl}
                              width="55"
                              height="55"
                            />
                          )
                      )}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {signature.map(
                        (sig) =>
                          sig.status === "??????????????????????????????????????????????????????????????????" && sig.status
                      )}
                      <br />(
                      {signature.map(
                        (sig) =>
                          sig.status === "??????????????????????????????????????????????????????????????????" &&
                          sig.people_name
                      )}
                      )
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      ?????????????????? &nbsp;
                      {signature.map(
                        (sig) =>
                          sig.status === "?????????????????????????????? ???" && (
                            <img
                              src={sig.signatureUrl}
                              width="55"
                              height="55"
                            />
                          )
                      )}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {signature.map(
                        (sig) => sig.status === "?????????????????????????????? ???" && sig.status
                      )}
                      <br />(
                      {signature.map(
                        (sig) =>
                          sig.status === "?????????????????????????????? ???" && sig.people_name
                      )}
                      )
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      ?????????????????? &nbsp;
                      {signature.map(
                        (sig) =>
                          sig.status === "?????????????????????????????? ???" && (
                            <img
                              src={sig.signatureUrl}
                              width="55"
                              height="55"
                            />
                          )
                      )}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {signature.map(
                        (sig) => sig.status === "?????????????????????????????? ???" && sig.status
                      )}
                      <br />(
                      {signature.map(
                        (sig) =>
                          sig.status === "?????????????????????????????? ???" && sig.people_name
                      )}
                      )
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      ?????????????????? &nbsp;
                      {signature.map(
                        (sig) =>
                          sig.status === "???????????? ???" && (
                            <img
                              src={sig.signatureUrl}
                              width="55"
                              height="55"
                            />
                          )
                      )}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {signature.map(
                        (sig) => sig.status === "???????????? ???" && sig.status
                      )}
                      <br />(
                      {signature.map(
                        (sig) => sig.status === "???????????? ???" && sig.people_name
                      )}
                      )
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      ?????????????????? &nbsp;
                      {signature.map(
                        (sig) =>
                          sig.status === "???????????? ???" && (
                            <img
                              src={sig.signatureUrl}
                              width="55"
                              height="55"
                            />
                          )
                      )}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {signature.map(
                        (sig) => sig.status === "???????????? ???" && sig.status
                      )}
                      <br />(
                      {signature.map(
                        (sig) => sig.status === "???????????? ???" && sig.people_name
                      )}
                      )
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </div>
            <br />
            <br />
            <br />
            <Typography variant="h6" gutterBottom>
              ????????????????????? 2 ??????????????????????????????????????????????????????????????????????????????????????? ??? ????????????????????????
            </Typography>
            <br />
            <div style={{ marginLeft: 50 }}>
              {images.map((img, index) => (
                <div key={index + 1}>
                  <Box border={1}>
                    <center>
                      <img src={img.imageUrl} />
                    </center>
                  </Box>
                  <br />
                  <Typography variant="subtitle1" gutterBottom>
                    {index + 1}.{img.nameImage}
                  </Typography>
                  <br />
                  <br />
                </div>
              ))}
            </div>
            <br />
            <br />
            <br />
          </div>
        </Preview>
        <button onClick={() => print("a", "jsx-template")}> print</button>
      </Container>
    </div>
  );
}

export default Pdf;
