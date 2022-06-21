import React, { useState, useEffect } from "react";
import { useParams, Route, Switch, useRouteMatch } from "react-router-dom";
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
  Typography,
} from "@material-ui/core";
import { DeleteOutlineRounded, Edit } from "@material-ui/icons";
import { firestore } from "../../../database/firebase";
import firebase from "firebase";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  materialicons: {
    position: "absolute",
    bottom: theme.spacing(5),
    right: theme.spacing(5),
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
}));

const Addpeoples = () => {
  const { path } = useRouteMatch();
  const [inputname, setInputname] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState([]);
  let { userId } = useParams();
  const classes = useStyles();
  const [currentPost, setCurrentPost] = useState({});
  const [open, setOpen] = useState(false);
  const [updatename, setUpdatename] = useState("");
  const [toUpdateId, setToUpdateId] = useState("");
  const [iddelete, setIddelete] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await firestore
          .collection("questions")
          .doc(userId)
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
          .collection("status")
          .orderBy("datetime", "asc")
          .onSnapshot((snapshot) => {
            setStatus(
              snapshot.docs.map((doc) => {
                return {
                  id: doc.id,
                  status_name: doc.data().status_name,
                };
              })
            );
          });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [userId]);

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
      .collection("status")
      .doc(iddelete)
      .delete()
      .then((res) => {
        console.log("Deleted!", res);
      });
    setOpenDelete(false);
  };

  const openUpdateDialog = (sta) => {
    setOpen(true);
    setToUpdateId(sta.id);
    setUpdatename(sta.status_name);
  };

  const editTodo = () => {
    firestore
      .collection("questions")
      .doc(userId)
      .collection("status")
      .doc(toUpdateId)
      .update({
        status_name: updatename,
      });
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addpeoples = () => {
    firestore
      .collection("questions")
      .doc(userId)
      .collection("status")
      .add({})
      .then(function (doc) {
        firestore
          .collection("questions")
          .doc(userId)
          .collection("status")
          .doc(doc.id)
          .set({
            statusId: doc.id,
            status_name: inputname,
            datetime: firebase.firestore.FieldValue.serverTimestamp(),
          });
      });
    setInputname("");
  };

  var dataInpage = 0;
  var dataInpage = status.length;

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
              marginTop: -4,
            }}
          >
            <h5>ผู้ตรวจ</h5>
          </div>
          <br></br>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            ชื่อแบบประเมิน : {currentPost.question_name}{" "}
          </div>
          <br></br>
          <Container>
            <List dense={true}>
              <Container maxWidth="sm">
                <form noValidate>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    id="status"
                    label="สถานะผู้ตรวจ"
                    name="status"
                    size="small"
                    fullWidth
                    autoFocus
                    value={inputname}
                    onChange={(event) => setInputname(event.target.value)}
                  />

                  <center>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth5
                      onClick={addpeoples}
                      disabled={!inputname}
                    >
                      บันทึก
                    </Button>
                  </center>
                </form>
              </Container>

              <br></br>

              <Divider />
              <br></br>
              {dataInpage > 0 ? (
                <Container>
                  {status.map((sta) => (
                    <div>
                      <Paper variant="outlined" className={classes.paperlist}>
                        <div key={sta.id}>
                          <ListItem>
                            <ListItemText primary={sta.status_name} />

                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="Edit"
                                onClick={() => openUpdateDialog(sta)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleClickOpenDelete(sta)}
                              >
                                <DeleteOutlineRounded />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        </div>
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
                  margin="dense"
                  size="small"
                  fullWidth
                  id="status"
                  label="สถานะ"
                  name="status"
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
        </Route>
      </Switch>
    </div>
  );
};

export default Addpeoples;
