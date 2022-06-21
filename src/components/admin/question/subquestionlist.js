import React, { useState, useEffect } from "react";
import {
  useParams,
  Link,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";
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
  makeStyles,
  Paper,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { DeleteOutlineRounded, Edit } from "@material-ui/icons";
import { firestore } from "../../../database/firebase";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import Subquestionadd from "./subquestionadd";

import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  materialicons: {
    position: "fixed",
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
  table: {
    minWidth: 650,
  },
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  textcenter: {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 340,
  },
}));

const Subquestionlist = () => {
  const { url, path } = useRouteMatch();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  let { userId } = useParams();
  let { categoryId } = useParams();
  const classes = useStyles();
  const [currentPost, setCurrentPost] = useState({});
  const [open, setOpen] = useState(false);
  const [updateid, setUpdateid] = useState("");
  const [updatename, setUpdatename] = useState("");
  const [toUpdateId, setToUpdateId] = useState("");
  const [updatescore, setUpdatescore] = useState("");
  const [iddelete, setIddelete] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await firestore
          .collection("questions")
          .doc(userId)
          .collection("categorys")
          .doc(categoryId)
          .get();
        let data = { title: "not found" };
        if (response.exists) {
          data = response.data();
        }
        setCurrentPost(data);
        setLoading(false);
        firestore
          .collection("questions")
          .doc(userId)
          .collection("categorys")
          .doc(categoryId)
          .collection("subquestions")
          .orderBy("datetime", "asc")
          .onSnapshot((snapshot) => {
            setQuestions(
              snapshot.docs.map((doc) => {
                return {
                  id: doc.id,
                  name: doc.data().subquestion_name,
                  score: doc.data().subquestion_score,
                  answer_:doc.data().answer_

                };
              })
            );
          });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [categoryId, userId]);

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
      .doc(userId)
      .collection("categorys")
      .doc(categoryId)
      .collection("subquestions")
      .doc(iddelete)
      .delete()
      .then((res) => {
        console.log("Deleted!", res);
      });
    setOpenDelete(false);
  };

  const openUpdateDialog = (category) => {
    setOpen(true);
    setToUpdateId(category.id);
    setUpdateid(category.id);
    setUpdatename(category.name);
    setUpdatescore(category.score);
  };

  const editTodo = () => {
    firestore
      .collection("questions")
      .doc(userId)
      .collection("categorys")
      .doc(categoryId)
      .collection("subquestions")
      .doc(toUpdateId)
      .update({
        subquestion_name: updatename,
        subquestion_score: updatescore,
      });
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  var dataInpage = 0;
  var dataInpage = questions.length;

  {questions.map((q)=> console.log(q))}

  firestore
  .collection("questions")
  .doc(userId)
  .collection("categorys")
  .doc(categoryId)
  .update({
    subquestion: questions,
  });
  
  return (
    <div>
      <Switch>
        <Route exact path={path}>
          {!loading && currentPost.title}

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
            <h5>คำถามทั้งหมด</h5>
          </div>
          <br></br>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            ชื่อหมวด : {currentPost.category_name}{" "}
          </div>
          <br></br>
          {dataInpage > 0 ? (
            <Container>
              <List dense={true}>
                {questions.map((question) => (
                  <div key={question.id}>
                    <Paper variant="outlined" className={classes.paperlist}>
                      <div key={question.id}>
                        <ListItem>
                          <ListItemText
                            primary={question.id}
                            secondary={question.datetime}
                          />
                          <Grid container spacing={3} justify="center">
                            <Grid item xs={7}>
                              <ListItemText primary={question.name} />
                            </Grid>
                          </Grid>
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
                      </div>
                    </Paper>
                  </div>
                ))}
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
                  <TextField
                    variant="outlined"
                    margin="dense"
                    size="small"
                    fullWidth
                    id="score"
                    label="คะแนน"
                    name="score"
                    autoFocus
                    value={updatescore}
                    onChange={(event) => setUpdatescore(event.target.value)}
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
                <DialogTitle id="alert-dialog-title">
                  {"ยืนยันการลบ"}
                </DialogTitle>
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

          <Link to={`${url}/subquestionadd`}>
            <Tooltip title="Add" aria-label="Add">
              <Fab color="primary" className={classes.materialicons}>
                <AddIcon />
              </Fab>
            </Tooltip>
          </Link>
        </Route>
        <Route path={`${path}/subquestionadd`}>
          <Subquestionadd />
        </Route>
      </Switch>
    </div>
  );
};

export default Subquestionlist;