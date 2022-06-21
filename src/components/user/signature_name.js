import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  useParams,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import {
  ListItem,
  ListItemText,
  TextField,
  Container,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import Signature from "./signature";
import Button from "@material-ui/core/Button";
import { firestore } from "../../database/firebase";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import BorderColorSharpIcon from "@material-ui/icons/BorderColorSharp";
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
  absolute: {
    float: "right",
  },
}));

export default function Signature_name() {
  const classes = useStyles();
  const [status, setStatus] = useState([]);
  let { questionId, pharmacyId, categoryId, signature, user } = useParams();
  const [currentPost, setCurrentPost] = useState({});
  const { url, path } = useRouteMatch();
  const [inputname, setInputname] = useState("");
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
      .where("statusId", "==", signature)
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

    fetchData();
  }, [questionId, signature, pharmacyId]);

  const goto = () => {
    history.push(`${url}/signature`);
  };

  const save = () => {
    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(questionId)
      .collection("answers")
      .doc(categoryId)
      .collection("signature")
      .doc(signature)
      .update({
        people_name: inputname,
        status: st[0],
      });
    history.goBack();
  };

  const st = [];
  {
    status.map((sta) => st.push(sta.status_name));
  }

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

          <div className={classes.root}>
            <Container maxWidth="sm">
              {status.map((sta) => (
                <div key={sta.id}>
                  <ListItem>
                    <ListItemText primary={`สถานะ: ${sta.status_name}`} />
                  </ListItem>
                </div>
              ))}
              <form noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  id="status"
                  label="ลงชื่อ"
                  name="status"
                  size="small"
                  fullWidth
                  autoFocus
                  value={inputname}
                  onChange={(event) => setInputname(event.target.value)}
                />

                <Tooltip title="Add" aria-label="add" onClick={goto}>
                  <Fab color="action" className={classes.absolute}>
                    <BorderColorSharpIcon />
                  </Fab>
                </Tooltip>
              </form>
              <br></br>
              <br></br>
              <br></br>
              <center>
                <Button variant="contained" color="primary" onClick={save}>
                  บันทึก
                </Button>
              </center>
            </Container>
          </div>
        </Route>
        <Route path={`${path}/signature`}>
          <Signature />
        </Route>
      </Switch>
    </div>
  );
}
