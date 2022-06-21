import React, { useState, useEffect, useContext } from "react";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import {
  useParams,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
  Link,
} from "react-router-dom";
import { ListItem, ListItemText } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import Signature_name from "./signature_name";
import Button from "@material-ui/core/Button";
import { firestore } from "../../database/firebase";
import Summary from "./summary";
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
}));

export default function Signature_answers() {
  const classes = useStyles();
  const [cinemas, setCinemas] = useState([]);
  const [status, setStatus] = useState([]);
  let { questionId, pharmacyId, categoryId, user } = useParams();
  const [currentPost, setCurrentPost] = useState({});
  const { url, path } = useRouteMatch();
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
      .collection("status")
      .orderBy("datetime", "asc")
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

        setStatus(fetchedCinemas);
      });

    firestore
      .collectionGroup("signature")
      .where("answerId", "==", categoryId)
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
        setCinemas(fetchedMovies);
      });

    fetchData();
  }, [questionId]);

  const goHome = () => {
    history.push(`/user/${user}/home`);
  };

  const gotoSum = () => {
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
        signatures: cinemas,
      });
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
            <h4>ลงชื่อ</h4>
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
            <h5>ส่วนที่ 3</h5>
          </div>
          <Container maxWidth="md">
            <div className={classes.root}>
              {status.map((sta) => (
                <div key={sta.id}>
                  <ListItem>
                    <ListItemText primary={sta.status_name} />
                    <Link to={`${url}/signatureName/${sta.id}`}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={false}
                      >
                        ลงชื่อ
                      </Button>
                    </Link>
                  </ListItem>
                </div>
              ))}
              <div>
                <Link to={`${url}/score/${categoryId}`}>
                  <div style={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={gotoSum}
                    >
                      บันทึก
                    </Button>
                  </div>
                </Link>
              </div>
            </div>
          </Container>
        </Route>
        <Route path={`${path}/signatureName/:signature`}>
          <Signature_name />
        </Route>
        <Route path={`${path}/score/:scoreId`}>
          <Summary />
        </Route>
      </Switch>
    </div>
  );
}
