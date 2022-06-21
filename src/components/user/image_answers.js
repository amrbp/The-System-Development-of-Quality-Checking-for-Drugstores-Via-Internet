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
import "react-html5-camera-photo/build/css/index.css";
import { IconButton } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import * as firebase from "firebase/app";
import SignatureAnswers from "./signature_answers";
import Button from "@material-ui/core/Button";
import { firestore } from "../../database/firebase";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import Capture from "./capture";
import Divider from "@material-ui/core/Divider";
import { AuthContext } from "../../App";
import Container from "@material-ui/core/Container";

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
  input: {
    display: "none",
  },
}));

export default function FullWidthTabs() {
  const classes = useStyles();
  const [images, setImages] = useState([]);
  let { questionId, pharmacyId, categoryId, user } = useParams();
  const [currentPost, setCurrentPost] = useState({});
  const [questions, setQuestions] = useState([]);
  const { url, path } = useRouteMatch();
  const [fileUrl, setFileUrl] = useState([]);
  let history = useHistory();
  const { logout } = useContext(AuthContext);

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
      .doc(categoryId)
      .collection("images")
      .get()
      .then((response) => {
        const fetchedMovies = [];
        response.forEach((document) => {
          const fetchedMovie = {
            id: document.id,
            answerId: document.data().answerId,
            categoryId: document.data().categoryId,
            imageUrl: document.data().imageUrl,
            nameImage: document.data().nameImage,
          };
          fetchedMovies.push(fetchedMovie);
        });
        setFileUrl(fetchedMovies);
      });

    fetchData();
  }, [questionId]);

  const captures = (image) => {
    history.push(`${url}/capture/${image.id}`);
  };

  const goHome = () => {
    history.push(`/user/${user}/home`);
  };

  const gotoSig = () => {
    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(questionId)
      .collection("answers")
      .doc(categoryId)
      .collection("category_answers")
      .doc("category")
      .update({
        images: fileUrl,
      });
    history.push(`${url}/signature`);
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
              height: 81,
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
            <h4>ส่วนที่ 2</h4>
          </div>
          <br></br>
          <div className={classes.root}>
            {images.map((image) => (
              <div key={image.id}>
                <Paper className={classes.paper}>
                  <div key={image.id}>
                    <Grid container spacing={2}>
                      {image.image_name}
                    </Grid>
                    <br></br>
                    <Divider />
                    <br></br>
                    <Container>
                      {fileUrl.map(
                        (url) =>
                          url.categoryId === image.imageId && (
                            <img
                              style={{ width: "100%", height: "auto" }}
                              key={categoryId}
                              src={url.imageUrl}
                              width="640"
                              height="480"
                            />
                          )
                      )}
                    </Container>
                    <label>
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        onClick={() => captures(image)}
                      >
                        <PhotoCamera />
                      </IconButton>
                      <button onClick={() => window.location.reload(false)}>
                        Upload
                      </button>
                    </label>
                  </div>
                </Paper>
                <br></br>
                <br></br>
              </div>
            ))}

            <div style={{ textAlign: "center" }}>
              <Button variant="contained" color="primary" onClick={gotoSig}>
                บันทึก
              </Button>
            </div>
            <br></br>
            <br></br>
            <br></br>
          </div>
        </Route>
        <Route path={`${path}/capture/:imageId`}>
          <Capture />
        </Route>
        <Route path={`${path}/signature`}>
          <SignatureAnswers />
        </Route>
      </Switch>
    </div>
  );
}
