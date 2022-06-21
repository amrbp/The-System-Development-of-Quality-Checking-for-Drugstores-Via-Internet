import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { firestore } from "../../database/firebase";
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  useRouteMatch,
  useHistory,
  useParams,
} from "react-router-dom";
import { Edit } from "@material-ui/icons";
import { Container, IconButton, Button } from "@material-ui/core";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { AuthContext } from "../../App";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import HistoryPharmacy from "./historyPharmacy";
import Report from "./report";
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
  labelbar: {
    flexGrow: 1,
    backgroundColor: "#1DB1DF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 81,
    color: "#ffffff",
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
  const [pharmacys, setPharmacys] = useState([]);
  let history = useHistory();
  const { logout } = useContext(AuthContext);
  const [historys, setHistorys] = useState([]);
  let { pharmacyId } = useParams();
  const [currentPost, setCurrentPost] = useState({});

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
          .collection("pharmacys")
          .orderBy("datetime", "desc")
          .onSnapshot((snapshot) => {
            setPharmacys(
              snapshot.docs.map((doc) => {
                return {
                  id: doc.id,
                  name: doc.data().name,
                  nameowner: doc.data().nameowner,
                  nameoperator: doc.data().nameoperator,
                  address: doc.data().address,
                  tel: doc.data().tel,
                  fax: doc.data().fax,
                  phone: doc.data().fax,
                  datatime: doc.data().datatime,
                  isCom: doc.data().isCom,
                };
              })
            );
          });

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
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

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
            }}
          >
            <h5>ประวัติ</h5>
          </div>
          <br></br>
          <br></br>
          <Container>
            {historys.map((history, i) => (
              <div key={i}>
                <Paper variant="outlined" className={classes.paper}>
                  <Grid container spacing={2}>
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
                          to={`${url}/${history.questionId}/history/${history.categoryId}/${history.finishId}`}
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
        <Route path={`${path}/:questionId/history/:categoryId/:finishId`}>
          <HistoryPharmacy />
        </Route>
        <Route path={`${path}/report`}>
          <Report />
        </Route>
      </Switch>
    </div>
  );
}
