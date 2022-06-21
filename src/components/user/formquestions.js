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
import Box from "@material-ui/core/Box";
import { Container, IconButton } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import Summary from "./summary";
import ImageAnswers from "./image_answers";
import Button from "@material-ui/core/Button";
import { firestore } from "../../database/firebase";
import { AuthContext } from "../../App";
import firebase from "firebase";
import { red } from "@material-ui/core/colors";

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
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "#00FF00",
  },
  papers2: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 770,
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "#FFFF00",
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
  const classes = useStyles();
  const [cinemas, setCinemas] = useState([]);
  const [images, setImages] = useState([]);
  const [movies, setMovies] = useState([]);
  let { questionId, pharmacyId, categoryId, user } = useParams();
  const [currentPost, setCurrentPost] = useState({});
  const [questions, setQuestions] = useState([]);
  const { url, path } = useRouteMatch();
  const [inputscore, setInputscore] = useState([]);
  const [score, setScore] = useState([]);
  const { logout } = useContext(AuthContext);
  const { disableButton, setDisablebutton } = useState(false);
  let history = useHistory();
  // const handleChange = (event) => {
  //   setInputscore(event.target.value);
  // };
  // const onChangeValue = (event) => {
  //   setInputscore([
  //     ...inputscore,
  //     {
  //       id: event.target.name,
  //       score: event.target.value,
  //       subquestionId: event.target.id,
  //       categoryId: event.target.title,
  //       standard_score: event.target.placeholder,
  //       category_name: event.target.pattern,
  //       close: event.target.prefix,
  //     },
  //   ]);
  // };

  const subquestionFunc = (event) => {
    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(questionId)
      .collection("answers")
      .doc(categoryId)
      .collection("category_answers")
      .doc(event.target.id)
      .set({
        answerId: categoryId,
        datetime: firebase.firestore.FieldValue.serverTimestamp(),
        id: event.target.name,
        score: event.target.value,
        subquestionId: event.target.id,
        categoryId: event.target.title,
        standard_score: event.target.placeholder,
        category_name: event.target.pattern,
        canCut: false,
      });
  };
  const subquestionFunCut = (event) => {
    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(questionId)
      .collection("answers")
      .doc(categoryId)
      .collection("category_answers")
      .doc(event.target.id)
      .set({
        answerId: categoryId,
        datetime: firebase.firestore.FieldValue.serverTimestamp(),
        id: event.target.name,
        score: event.target.value,
        subquestionId: event.target.id,
        categoryId: event.target.title,
        standard_score: event.target.placeholder,
        category_name: event.target.pattern,
        canCut: true,
      });
  };
  // const subquestionFunCut = (m) => {
  //   firestore
  //     .collection("pharmacys")
  //     .doc(pharmacyId)
  //     .collection("historys")
  //     .doc(questionId)
  //     .collection("answers")
  //     .doc(categoryId)
  //     .collection("category_answers")
  //     .doc(m.subquestionId)
  //     .set({
  //       answerId: categoryId,
  //       datetime: firebase.firestore.FieldValue.serverTimestamp(),
  //       subquestionId: m.subquestionId,
  //       id: m.subquestion_name,
  //       categoryId: m.categoryId,
  //       category_name: m.category_name,
  //       canCut: true,
  //       score: "ตัดคะแนน",
  //     });
  // };

  // .set({
  //   question_answers: inputscore,
  //   datetime: firebase.firestore.FieldValue.serverTimestamp(),
  // })
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
      } catch (err) {
        console.error(err);
      }
    };

    firestore
      .collection("questions")
      .doc(questionId)
      .collection("images")
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

        setImages(fetchedCinemas);
      });

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
      .onSnapshot((snapshot) => {
        setCinemas(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              name: doc.data().question_name,
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

    fetchData();
  }, [questionId]);

  const addans = () => {
    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(questionId)
      .collection("answers")
      .doc(categoryId)
      .collection("category_answers")
      .doc("category")
      .set({
        answerId: categoryId,
        question_answers: inputscore,
        datetime: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };

  const goHome = () => {
    history.push(`/user/${user}/home`);
  };

  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.homeButton}
                color="inherit"
                onClick={goHome}
              >
                <HomeIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {currentPost.name}
              </Typography>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                onClick={() => {
                  logout();
                  history.push("/");
                  window.location.reload(false);
                }}
              >
                <ExitToAppIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <div
            style={{
              flexGrow: 1,
              backgroundColor: "#1DB1DF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 75,
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            {questions.map((question) => (
              <Typography variant="subtitle1" key={question.id} gutterBottom>
                {question.question_name}
              </Typography>
            ))}
          </div>
          <br></br>
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h4>ส่วนที่ 1</h4>
          </div>

          <div className={classes.root}>
            {movies.map((movie) => (
              <div key={movie.id}>
                {movie.id === "01001001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "02001001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "03001001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "01002001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "02002001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "03002001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "01003001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "02003001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "03003001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}

                {movie.id === "01004001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}

                {movie.id === "02004001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}

                {movie.id === "03004001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "01005001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "02005001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "03005001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "01006001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "02006001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "03006001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "01007001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "02007001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "03007001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "01008001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "02008001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "03008001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "01009001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "02009001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                {movie.id === "03009001" && (
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container spacing={2}>
                        {movie.category_name}
                      </Grid>
                      <br></br>
                      <br></br>
                    </div>
                  </Paper>
                )}
                <br></br>
                {movie.canCut === false ? (
                  <Paper className={classes.papers2}>
                    <div>
                      <Grid container spacing={2}>
                        <Grid item>
                          <div className={classes.image}>
                            {movie.subquestion_name}
                          </div>
                        </Grid>
                      </Grid>
                      <Divider />
                      <div className={classes.upper}>
                        <Grid container spacing={2}>
                          <Grid item xs={5} key={movie.id}>
                            {movie.close === true ? (
                              <div className={classes.radio}>
                                <div key={movie.id}>
                                  <input
                                    type="radio"
                                    value={0}
                                    name={movie.subquestion_name}
                                    id={movie.subquestionId}
                                    title={movie.categoryId}
                                    prefix="false"
                                    placeholder={movie.subquestion_score}
                                    pattern={movie.category_name}
                                    onClick={subquestionFunc}
                                  />{" "}
                                  ปรับปรุง(๐)<br></br>
                                  <input
                                    type="radio"
                                    value={1}
                                    name={movie.subquestion_name}
                                    id={movie.subquestionId}
                                    title={movie.categoryId}
                                    prefix="true"
                                    placeholder={movie.subquestion_score}
                                    pattern={movie.category_name}
                                    onClick={subquestionFunc}
                                    disabled
                                  />{" "}
                                  พอใช้(๑)<br></br>
                                  <input
                                    type="radio"
                                    value={2}
                                    name={movie.subquestion_name}
                                    title={movie.categoryId}
                                    id={movie.subquestionId}
                                    prefix="false"
                                    placeholder={movie.subquestion_score}
                                    pattern={movie.category_name}
                                    onClick={subquestionFunc}
                                  />{" "}
                                  ดี(๒)
                                </div>
                              </div>
                            ) : (
                              <div className={classes.radio}>
                                <div key={movie.id}>
                                  <input
                                    type="radio"
                                    value={0}
                                    name={movie.subquestion_name}
                                    id={movie.subquestionId}
                                    title={movie.categoryId}
                                    prefix="false"
                                    placeholder={movie.subquestion_score}
                                    pattern={movie.category_name}
                                    onClick={subquestionFunc}
                                  />{" "}
                                  ปรับปรุง(๐)<br></br>
                                  &nbsp; &nbsp; &nbsp; &nbsp; 
                                  <input
                                    type="radio"
                                    value={1}
                                    name={movie.subquestion_name}
                                    id={movie.subquestionId}
                                    title={movie.categoryId}
                                    prefix="false"
                                    placeholder={movie.subquestion_score}
                                    pattern={movie.category_name}
                                    onClick={subquestionFunc}
                                  />{" "}
                                  พอใช้(๑)<br></br>
                                  <input
                                    type="radio"
                                    value={2}
                                    name={movie.subquestion_name}
                                    title={movie.categoryId}
                                    id={movie.subquestionId}
                                    prefix="false"
                                    placeholder={movie.subquestion_score}
                                    pattern={movie.category_name}
                                    onClick={subquestionFunc}
                                  />{" "}
                                  ดี(๒)
                                </div>
                              </div>
                            )}
                          </Grid>
                          <Grid item xs={2}>
                            <div>
                              <Box borderRight={1} />
                            </div>
                          </Grid>
                          <Grid item xs={5}>
                            <div className={classes.score}>
                              <Grid item>
                                ค่าน้ำหนักคะแนน
                                <br></br>
                                {movie.subquestion_score === "1" && <p>๑</p>}
                                {movie.subquestion_score === "2" && <p>๒</p>}
                                <br></br>
                                {movie.CD === true ? (
                                  <div>Critcal Defect</div>
                                ) : null}
                              </Grid>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </Paper>
                ) : (
                  <Paper className={classes.papers}>
                    <div>
                      <Grid container spacing={2}>
                        <Grid item>
                          <div className={classes.image}>
                            {movie.subquestion_name}
                          </div>
                        </Grid>
                      </Grid>
                      <Divider />
                      <div className={classes.upper}>
                        <Grid container spacing={2}>
                          <Grid item xs={5} key={movie.id}>
                            {movie.close === true ? (
                              <div className={classes.radio}>
                                <div key={movie.id}>
                                  <input
                                    type="radio"
                                    value={0}
                                    name={movie.subquestion_name}
                                    id={movie.subquestionId}
                                    title={movie.categoryId}
                                    placeholder={movie.subquestion_score}
                                    pattern={movie.category_name}
                                    onClick={subquestionFunc}
                                  />{" "}
                                  ปรับปรุง(๐)<br></br>
                                  <input
                                    type="radio"
                                    value={1}
                                    name={movie.subquestion_name}
                                    id={movie.subquestionId}
                                    title={movie.categoryId}
                                    placeholder={movie.subquestion_score}
                                    prefix={"false"}
                                    pattern={movie.category_name}
                                    onClick={subquestionFunc}
                                    disabled
                                  />{" "}
                                  พอใช้(๑)<br></br>
                                  <input
                                    type="radio"
                                    value={2}
                                    name={movie.subquestion_name}
                                    title={movie.categoryId}
                                    id={movie.subquestionId}
                                    prefix={"false"}
                                    placeholder={movie.subquestion_score}
                                    pattern={movie.category_name}
                                    onClick={subquestionFunc}
                                  />{" "}
                                  ดี(๒)<br></br>
                                  <input
                                    type="radio"
                                    value={"ตัดฐานคะแนน"}
                                    name={movie.subquestion_name}
                                    prefix={"false"}
                                    title={movie.categoryId}
                                    id={movie.subquestionId}
                                    placeholder={movie.subquestion_score}
                                    pattern={movie.category_name}
                                    onClick={subquestionFunCut}
                                  />{" "}
                                  ตัดฐานคะแนน
                                </div>
                              </div>
                            ) : (
                              <div className={classes.radio}>
                                <div key={movie.id}>
                                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
                                  <input
                                    type="radio"
                                    value={0}
                                    name={movie.subquestion_name}
                                    id={movie.subquestionId}
                                    title={movie.categoryId}
                                    prefix={"false"}
                                    placeholder={movie.subquestion_score}
                                    pattern={movie.category_name}
                                    onClick={subquestionFunc}
                                  />{" "}
                                  ปรับปรุง(๐)<br></br>
                                  &nbsp; &nbsp; &nbsp; &nbsp; 
                                  <input
                                    type="radio"
                                    value={1}
                                    name={movie.subquestion_name}
                                    id={movie.subquestionId}
                                    title={movie.categoryId}
                                    placeholder={movie.subquestion_score}
                                    prefix={"false"}
                                    pattern={movie.category_name}
                                    onClick={subquestionFunc}
                                  />{" "}
                                  พอใช้(๑)<br></br>
                                  <input
                                    type="radio"
                                    value={2}
                                    name={movie.subquestion_name}
                                    prefix={"false"}
                                    title={movie.categoryId}
                                    id={movie.subquestionId}
                                    placeholder={movie.subquestion_score}
                                    pattern={movie.category_name}
                                    onClick={subquestionFunc}
                                  />{" "}
                                  ดี(๒)<br></br>
                                  <input
                                    type="radio"
                                    value={"ตัดฐานคะแนน"}
                                    name={movie.subquestion_name}
                                    prefix={"false"}
                                    title={movie.categoryId}
                                    id={movie.subquestionId}
                                    placeholder={movie.subquestion_score}
                                    pattern={movie.category_name}
                                    onClick={subquestionFunCut}
                                  />{" "}
                                  ตัดฐานคะแนน
                                </div>
                              </div>
                            )}
                          </Grid>
                          <Grid item xs={2}>
                            <div>
                              <Box borderRight={1} />
                            </div>
                          </Grid>
                          <Grid item xs={5}>
                            <div className={classes.score}>
                              <Grid item>
                                ค่าน้ำหนักคะแนน
                                <br></br>
                                {movie.subquestion_score === "1" && <p>๑</p>}
                                {movie.subquestion_score === "2" && <p>๒</p>}
                                <br></br>
                                {movie.CD === true ? (
                                  <div>Critcal Defect</div>
                                ) : null}
                                {/* <input
                                  type = "radio"
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => subquestionFunCut(movie)}
                                />{" "}
                                   ตัดฐานคะแนนได้ */}
                                
                              </Grid>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </Paper>
                )}

                <br></br>
              </div>
            ))}
            <br></br>
            <br></br>
            <Container>
              {/* <div>
                <Table striped bordered hover responsive="sm">
                  <colgroup span="1" width="1000"></colgroup>
                  <colgroup span="3" width="20"></colgroup>
                  <thead>
                    <tr style={{padding: 15}}>
                      <th>
                        {questions.map((question) => (
                          <div>{question.question_name}</div>
                        ))}
                      </th>
                      <th><div>ปรับปรุง(๐)</div></th>
                      <th>พอใช้(๑)</th>
                      <th>ดี(๒)</th>
                    </tr>
                  </thead>
                  {movies.map((movie, index) => (
                    <tbody>
                      <tr key={index}>
                        <td colSpan="4" style={{ display: "contents" }}>
                          {movie.id === "01001001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "02001001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "03001001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "01002001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "02002001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "03002001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "01003001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "02003001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "03003001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "01004001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "02004001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "03004001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "01005001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "02005001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "03005001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "01006001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "02006001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "03006001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "01007001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "02007001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "03007001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "01008001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "02008001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "03008001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "01009001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "02009001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                          {movie.id === "03009001" && (
                            <div>{movie.category_name[0].category_name}</div>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td key={index}>{movie.subquestion_name}</td>
                        <td style={{textAlign:"center"}}>
                          {movie.subquestion_score === "2" && (
                            <div>
                              <input
                                type="radio"
                                value={0}
                                name={movie.subquestion_name}
                                id={movie.categoryId}
                                category_answers={
                                  movie.category_name[0].category_name
                                }
                                onClick={() => console.log(`${movie.id}`)}
                              />
                            </div>
                          )}
                          {movie.subquestion_score === "1" && (
                            <div>
                              <input
                                type="radio"
                                value={0}
                                name={movie.subquestion_name}
                                id={movie.categoryId}
                                category_answers={
                                  movie.category_name[0].category_name
                                }
                                onClick={() => console.log(`${movie.id}`)}
                              />
                            </div>
                          )}
                        </td>
                        <td style={{textAlign:"center"}}>
                          {movie.subquestion_score === "2" && (
                            <div>
                              <input
                                type="radio"
                                value={1}
                                name={movie.subquestion_name}
                                id={movie.categoryId}
                                category_answers={
                                  movie.category_name[0].category_name
                                }
                                onClick={() => console.log(`${movie.id}`)}
                              />
                            </div>
                          )}
                          {movie.subquestion_score === "1" && (
                            <div>
                              <input
                                type="radio"
                                value={1}
                                name={movie.subquestion_name}
                                id={movie.categoryId}
                                category_answers={
                                  movie.category_name[0].category_name
                                }
                                onClick={() => console.log(`${movie.id}`)}
                              />
                            </div>
                          )}
                        </td>
                        <td style={{textAlign:"center"}}>
                          {movie.subquestion_score === "2" && (
                            <div>
                              <input
                                type="radio"
                                value={2}
                                name={movie.subquestion_name}
                                category_answers={
                                  movie.category_name[0].category_name
                                }
                                id={movie.categoryId}
                                onClick={() => console.log(`${movie.id}`)}
                              />
                            </div>
                          )}
                          {movie.subquestion_score === "1" && (
                            <div>
                              <input
                                disabled={true}
                                type="radio"
                                value={2}
                                name={movie.subquestion_name}
                                category_answers={
                                  movie.category_name[0].category_name
                                }
                                id={movie.categoryId}
                                onClick={() => console.log(`${movie.id}`)}
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </Table>
              </div> */}
              <div>
                <Link to={`${url}/image_answers`}>
                  <div style={{ textAlign: "center" }}>
                    <Button variant="contained" color="primary">
                      บันทึก
                    </Button>
                  </div>
                  <br></br>
                  <br></br>
                  <br></br>
                </Link>
              </div>
            </Container>
          </div>
        </Route>
        <Route path={`${path}/score/:scoreId`}>
          <Summary />
        </Route>
        <Route path={`${path}/image_answers`}>
          <ImageAnswers />
        </Route>
      </Switch>
    </div>
  );
}
