import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
//######################################### icon ######################################
import AssignmentIcon from "@material-ui/icons/Assignment";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import StoreIcon from "@material-ui/icons/Store";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import RestoreIcon from "@material-ui/icons/Restore";
import CheckIcon from "@material-ui/icons/Check";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import AddIcon from "@material-ui/icons/Add";
import History from "./history.png";
import Assessment from "./Assessment.png";
import Location from "./location.png";
import {
  useParams,
  Link,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import firebase from "firebase";
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import HomeIcon from "@material-ui/icons/Home";
import Fab from "@material-ui/core/Fab";
import SearchIcon from "@material-ui/icons/Search";
import { firestore } from "../../database/firebase";
import Formquestions from "./formquestions";
import Grid from "@material-ui/core/Grid";
import { DeleteOutlineRounded } from "@material-ui/icons";
import { auth } from "../../database/firebase";
import Googlemap from "./googlemap";
import Paper from "@material-ui/core/Paper";
import HistoryCategory from "./historyCategory";
import { Container } from "@material-ui/core";
import { AuthContext } from "../../App";
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
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
  paperlist: {
    padding: theme.spacing(1),
    margin: "auto",
  },
  textcenter: {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 340,
  },
  IconLable: {
    width: 30,
  },
}));
export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  let { pharmacyId, user } = useParams();
  const [currentPost, setCurrentPost] = useState({});
  const [questions, setQuestions] = useState([]);
  const [iddelete, setIddelete] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [formAlives, setFormAlives] = useState([]);
  const [answers, setAnswers] = useState([]);
  const { url, path } = useRouteMatch();
  const [open, setOpen] = useState(false);
  let history = useHistory();
  const [historys, setHistorys] = useState([]);
  const [selectedIndexid, setSelectedIndexid] = useState(1);
  const { logout } = useContext(AuthContext);
  const [pharmacystrue, setPharmacystrue] = useState([]);
  const handleListItemClick = (event, index) => {
    setSelectedIndexid(index);
  };
  // const user = useContext(UserContext);
  // const {photoURL, displayName, email} = user;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

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
          .orderBy("datetime", "asc")
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

        firestore
          .collection("pharmacys")
          .doc(pharmacyId)
          .collection("form_show")
          .onSnapshot((snapshot) => {
            setFormAlives(
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
          .doc(questionGroupId[0])
          .collection("answers")
          .onSnapshot((snapshot) => {
            setAnswers(
              snapshot.docs.map((doc) => {
                return {
                  id: doc.id,
                  answerId: doc.data().answerId,
                };
              })
            );
          });
      } catch (err) {
        console.error(err);
      }
    };

    firestore
      .collection("pharmacys")
      .where("id", "==", pharmacyId)
      .onSnapshot((snapshot) => {
        setPharmacystrue(
          snapshot.docs.map((doc) => {
            return {
              isCom: doc.data().isCom,
            };
          })
        );
      });

    fetchData();
  }, [pharmacyId]);

  const openUpdateDialog = () => {
    setOpen(true);
  };

  const addform = () => {
    const name = [];
    {
      questions.map(
        (q) => q.id === selectedIndexid && name.push(q.question_name)
      );
    }


    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(selectedIndexid)
      .set({
        questionid: selectedIndexid,
        question_name: name[0],
        datetime: firebase.firestore.FieldValue.serverTimestamp(),
      });

      firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("form_show")
      .doc(selectedIndexid)
      .set({
        questionid: selectedIndexid,
        question_name: name[0],
        datetime: firebase.firestore.FieldValue.serverTimestamp(),
      });


    setSelectedIndexid("");
    setOpen(false);
  };

  const doing = (id) => {
    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(id)
      .collection("answers")
      .add({})
      .then(function (doc) {
        firestore
          .collection("pharmacys")
          .doc(pharmacyId)
          .collection("historys")
          .doc(id)
          .collection("answers")
          .doc(doc.id)
          .set({
            answersId: doc.id,
            datetime: firebase.firestore.FieldValue.serverTimestamp(),
          });
        history.push(`${url}/questiongroups/${id}/question/${doc.id}`);
      });

    setSelectedIndexid("");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenDelete = (question) => {
    setOpenDelete(true);
    setIddelete(question.id);
  };
  const handleClosedelete = () => {
    setOpenDelete(false);
  };

  const deleteTodo = () => {
    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("form_show")
      .doc(iddelete)
      .delete()
      .then((res) => {
        console.log("Deleted!", res);
      });
    setOpenDelete(false);
  };
  const questionGroupId = [];
  {
    formAlives.map((formalive) => questionGroupId.push(formalive.id));
  }

  const goHome = () => {
    history.push(`/user/${user}/home`);
  };

  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <div className={classes.root}>
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
            <AppBar
              variant="outlined"
              position="static"
              color="default"
              className={classes.title}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
               <Tab
                 label={
                   <h7>
                      <img
                      src={History}
                      className={classes.IconLable}
                      alt="Pharmacy"
                    />
                     <br></br>
                     ประวัติ
                    </h7>
                  }
                  className={classes.lablebar}
                  {...a11yProps(0)} 
                />
                <Tab
                  label={
                    <h7>
                    <img
                      src={Assessment}
                      className={classes.IconLable}
                      alt="Pharmacy"
                    />
                    <br></br>
                    เพิ่มการตรวจ
                  </h7>
                  }
                  className={classes.lablebar}
                  {...a11yProps(1)}
                />
                <Tab
                  label={
                   <h7>
                    <img
                      src={Location}
                      className={classes.IconLable}
                      alt="Pharmacy"
                    />
                    <br></br>
                    ตำแหน่ง
                    </h7>
                  }
                  className={classes.lablebar}
                  {...a11yProps(2)}
                />
                
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <div
                  style={{
                    flexGrow: 1,
                    backgroundColor: "#1DB1DF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 60,
                    color: "#ffffff",
                    marginTop: -24,
                  }}
                >
                  <h5>ประวัติ</h5>
                </div>
                <br></br>
                <Container>
                  {historys.map((history, i) => (
                    <div key={i}>
                      <Paper variant="outlined" className={classes.paperlist}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm container>
                            <Grid
                              item
                              xs
                              container
                              direction="column"
                              spacing={2}
                            >
                              <Grid item xs>
                                <Typography gutterBottom variant="subtitle1">
                                  &nbsp; &nbsp; &nbsp;
                                  {new Date(
                                    history.datetime * 1000
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
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <div
                  style={{
                    flexGrow: 1,
                    backgroundColor: "#1DB1DF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 60,
                    color: "#ffffff",
                    marginTop: -24,
                  }}
                >
                  <h5>เพิ่มการตรวจ</h5>
                </div>

                {pharmacystrue.map((pharmacy) =>
                  pharmacy.isCom === "true" ? (
                    <Container maxWidth="sm">
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        className={classes.textcenter}
                      >
                        ร้านขายยานี้ผ่านการประเมินในปีนี้แล้ว
                      </Typography>
                    </Container>
                  ) : (
                    <div>
                      <List dense={true}>
                        {formAlives.map((formalive) => (
                          <div>
                            <Paper variant="outlined" style={{ marginTop: 25 }}>
                              <div key={formalive.id}>
                                <ListItem>
                                  <ListItemText
                                    primary={formalive.question_name}
                                    secondary={formalive.datetime}
                                    onClick={() => doing(formalive.id)}
                                  />

                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() =>
                                      handleClickOpenDelete(formalive)
                                    }
                                  >
                                    <DeleteOutlineRounded />
                                  </IconButton>
                                </ListItem>
                              </div>
                            </Paper>
                            <br></br>
                          </div>
                        ))}
                      </List>
                      <center>
                        <Fab
                          color="primary"
                          className={classes.materialicons}
                        >
                          <IconButton
                            aria-label="add"
                            onClick={() => openUpdateDialog()}
                          >
                            <AddIcon />
                          </IconButton>
                        </Fab>
                      </center>
                    </div>
                  )
                )}

                <Dialog open={open} onClose={handleClose}>
                  <DialogContent>
                    <h2>เลือกแบบประเมิน</h2>
                    <List dense={true}>
                      {questions.map((question) => (
                        <div key={question.id}>
                          <Divider />
                          <List
                            component="nav"
                            aria-label="secondary mailbox folder"
                          >
                            <ListItem
                              button
                              selected={selectedIndexid === `${question.id}`}
                              onClick={(event) => {
                                handleListItemClick(event, `${question.id}`);
                              }}
                            >
                              <ListItemText
                                primary={question.question_name}
                                secondary={question.datetime}
                              />
                            </ListItem>
                          </List>
                        </div>
                      ))}
                    </List>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      ยกเลิก
                    </Button>
                    <Button onClick={addform} color="primary">
                      ตกลง
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                  open={openDelete}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"ยืนยันการลบ"}
                  </DialogTitle>
                  <DialogContent></DialogContent>
                  <DialogActions>
                    <Button onClick={deleteTodo} color="primary">
                      ยืนยัน
                    </Button>
                    <Button
                      onClick={handleClosedelete}
                      color="primary"
                      autoFocus
                    >
                      ยกเลิก
                    </Button>
                  </DialogActions>
                </Dialog>
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                <div
                  style={{
                    flexGrow: 1,
                    backgroundColor: "#1DB1DF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 60,
                    color: "#ffffff",
                    marginTop: -24,
                  }}
                >
                  <h5>ตำแหน่งของร้านขายยา</h5>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Googlemap />
                </div>
              </TabPanel>
            </SwipeableViews>
          </div>
        </Route>
        <Route path={`${path}/questiongroups/:questionId/question/:categoryId`}>
          <Formquestions />
        </Route>
        <Route path={`${path}/:questionId/history/:categoryId/:finishId`}>
          <HistoryCategory />
        </Route>
      </Switch>
    </div>
  );
}
