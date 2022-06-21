import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  useParams,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import { IconButton } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import { firestore } from "../../database/firebase";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "date-fns";
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

export default function Sumhistory() {
  const classes = useStyles();
  let { questionId, pharmacyId, categoryId, subquestionId, user } = useParams();
  const [currentPost, setCurrentPost] = useState([]);
  const { path } = useRouteMatch();
  let history = useHistory();
  const [scores, setScores] = useState([]);
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

    fetchData();
  }, [questionId, categoryId, pharmacyId]);

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
              height: 81,
              color: "#ffffff",
            }}
          >
            <h5 style={{ textAlign: "center" }}>สรุปคะแนน</h5>
          </div>
          <br></br>
          <div>
            <h6 style={{ textAlign: "center" }}>คำถามทั่วไป</h6>
          </div>
          <br></br>
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>รหัส</th>
                  <th>รายละเอียด</th>
                  <th>ค่าคะแนนที่ได้ x ค่าน้ำหนัก</th>
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
