import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { firestore } from "../../../database/firebase";
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  useRouteMatch,
  useHistory,
  useParams,
} from "react-router-dom";
import { Container, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { AuthContext } from "../../../App";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import HistoryCategory from "../../permium/historyPharmacy";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: 58,
    maxWidth: 500,
  },
  menuButton: {
    marginRight: theme.spacing(0),
  },
  title: {
    flexGrow: 1,
    position: "relative",
    textAlign: "center",
    color: "#1DB1DF",
  },
  Toolbar: {
    height: 85,
    flexGrow: 1,
  },
  tabsbar: {
    border: 2,
  },
  paper: {
    padding: theme.spacing(1),
    margin: "auto",
  },
}));

export default function Historylist(props) {
  const classes = useStyles();
  const { url, path } = useRouteMatch();
  const [historys, setHistorys] = useState([]);
  let { pharmacyId } = useParams();

  useEffect(() => {
    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("finish")
      .orderBy("datetime", "desc")
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
  }, []);

  return (
    <div>
      <BrowserRouter>
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
              }}
            >
              <Typography variant="h6" gutterBottom>
                ประวัติ
              </Typography>
            </div>
            <br></br>
            <br></br>
            <Container>
              {historys.map((history, i) => (
                <div key={i}>
                  <Paper variant="outlined" className={classes.paper}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                          <Grid item xs>
                            <Typography gutterBottom variant="subtitle1">
                              &nbsp; &nbsp; &nbsp;
                              {new Date(
                                history.datetime.seconds * 1000
                              ).toLocaleDateString("th-TH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                              &nbsp;
                              {history.name}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              &nbsp; &nbsp; &nbsp; โดย {history.people_name}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid item xs={2} container>
                          <Link
                            to={`${url}/${history.questionId}/${history.categoryId}/${history.finishId}`}
                          >
                            <Button>ผลตรวจ</Button>
                          </Link>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </div>
              ))}
            </Container>
          </Route>
          <Route path={`${path}/:questionId/:categoryId/:finishId`}>
            <HistoryCategory />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
