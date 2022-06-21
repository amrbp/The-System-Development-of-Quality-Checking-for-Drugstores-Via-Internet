import React, { useState, useEffect } from "react";
import {
  Link,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import Selectquestion from "./selectquestion";
import Addquestion from "./addquestion";
import { firestore } from "../../../database/firebase";
import { makeStyles } from "@material-ui/core/styles";
import { DeleteOutlineRounded, Edit } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import {
  Button,
  TextField,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Dialog,
  DialogContent,
  DialogActions,
  Paper,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

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
    height: 63,
    flexGrow: 1,
  },
  tabsbar: {
    border: 2,
  },
  materialicons: {
    position: "fixed",
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
  paper: {
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
}));

const Questionlist = () => {
  const { url, path } = useRouteMatch();
  const [questions, setQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [iddelete, setIddelete] = useState("");
  const [updateid, setUpdateid] = useState("");
  const [updatename, setUpdatename] = useState("");
  const [toUpdateId, setToUpdateId] = useState("");
  const [search, setSearch] = useState("");
  const classes = useStyles();
  let history = useHistory();

  useEffect(() => {
    firestore
      .collection("questions")
      .orderBy("datetime", "desc")
      .onSnapshot((snapshot) => {
        setQuestions(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              name: doc.data().question_name,
            };
          })
        );
      });
  }, []);

  const handleClickOpenDelete = (question) => {
    setOpenDelete(true);
    setIddelete(question.id);
  };
  const handleClosedelete = () => {
    setOpenDelete(false);
  };
  const deleteTodo = () => {
    firestore
      .collection("questions")
      .doc(iddelete)
      .delete()
      .then((res) => {
        console.log("Deleted!", res);
      });
    setOpenDelete(false);
  };

  const openUpdateDialog = (question) => {
    setOpen(true);
    setToUpdateId(question.id);
    setUpdateid(question.id);
    setUpdatename(question.name);
  };

  const editTodo = () => {
    firestore.collection("questions").doc(toUpdateId).update({
      question_name: updatename,
    });
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const filter = questions.filter((question) => {
    return question.name.toLowerCase().indexOf(search) !== -1;
  });

  var dataInpage = 0;
  var dataInpage = questions.length;

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
            <h5>แบบฟอร์มทั้งหมด</h5>
          </div>
          <Container>
            <List dense={true}>
              <center>
                <Avatar
                  style={{
                    width: 300,
                    color: "#000000",
                    backgroundColor: "#e0e0e0",
                    borderRadius: 15,
                  }}
                  variant="square"
                >
                  <input
                    style={{
                      width: 250,
                      height: 30,
                      borderRadius: 15,
                      border: 2,
                    }}
                    type="text"
                    placeholder="ค้นหา"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <SearchIcon />
                </Avatar>
              </center>
              <br />
              <br />
              {dataInpage > 0 ? (
                <Container>
                  {filter.map((question) => (
                    <div key={question.id}>
                      <Paper variant="outlined" className={classes.paper}>
                        <ListItem>
                          <Link to={`${url}/${question.id}`}>
                            <ListItemAvatar>
                              <Avatar>
                                <AssignmentIcon />
                              </Avatar>
                            </ListItemAvatar>
                          </Link>
                          <Link to={`${url}/${question.id}`}>
                            <ListItemText
                              primary={question.name}
                              secondary={question.datetime}
                            />
                          </Link>

                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="Edit"
                              onClick={() => openUpdateDialog(question)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleClickOpenDelete(question)}
                            >
                              <DeleteOutlineRounded />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </Paper>
                    </div>
                  ))}
                </Container>
              ) : (
                <Container maxWidth="sm">
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    className={classes.textcenter}
                  >
                    ไม่มีข้อมูล
                  </Typography>
                </Container>
              )}
            </List>
            <Dialog open={open} onClose={handleClose}>
              <DialogContent>
                <h2>แก้ไข</h2>
                <TextField
                  variant="outlined"
                  margin="normal"
                  size="small"
                  fullWidth
                  id="ID"
                  label="รหัสแบบประเมิน"
                  name="ID"
                  autoFocus
                  value={updateid}
                  onChange={(event) => setUpdateid(event.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  size="small"
                  fullWidth
                  id="name"
                  label="ชื่อแบบประเมิน"
                  name="name"
                  autoFocus
                  value={updatename}
                  onChange={(event) => setUpdatename(event.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  ยกเลิก
                </Button>
                <Button onClick={editTodo} color="primary">
                  บันทึก
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={openDelete}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"ยืนยันการลบ"}</DialogTitle>
              <DialogContent></DialogContent>
              <DialogActions>
                <Button onClick={deleteTodo} color="primary">
                  ยืนยัน
                </Button>
                <Button onClick={handleClosedelete} color="primary" autoFocus>
                  ยกเลิก
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
          <Link to={`${url}/addquestion`}>
            <Tooltip title="Add" aria-label="Add">
              <Fab color="primary" className={classes.materialicons}>
                <AddIcon />
              </Fab>
            </Tooltip>
          </Link>
        </Route>
        <Route path={`${path}/addquestion`}>
          <Addquestion />
        </Route>
        <Route path={`${path}/:userId`}>
          <Selectquestion />
        </Route>
      </Switch>
    </div>
  );
};

export default Questionlist;
