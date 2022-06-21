import React, { useState, useEffect } from "react";
import { firestore } from "../../../database/firebase";
import { Link, Switch, Route, useRouteMatch } from "react-router-dom";
import { DeleteOutlineRounded, Edit, People } from "@material-ui/icons";
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
import SearchIcon from "@material-ui/icons/Search";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@material-ui/icons/Person";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import Peopleadds from "./peopleadd";

const useStyles = makeStyles((theme) => ({
  materialicons: {
    position: "fixed",
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

function App() {
  const [peoples, setPeoples] = useState([]);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState("");
  const [updatepassword, setUpdatepassword] = useState("");
  const [updatename, setUpdatename] = useState("");
  const [updategarder, setUpdategarder] = useState("");
  const [updateage, setUpdateage] = useState("");
  const [updatetel, setUpdatetel] = useState("");
  const [toUpdateId, setToUpdateId] = useState("");
  const { url, path } = useRouteMatch();
  const [search, setSearch] = useState("");
  const [iddelete, setIddelete] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  const handleChange = (event) => {
    setUpdategarder(event.target.value);
  };

  useEffect(() => {
    firestore
      .collection("peoples")
      .orderBy("datetime", "desc")
      .onSnapshot((snapshot) => {
        setPeoples(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              people: doc.data().people,
              password: doc.data().password,
              name: doc.data().name,
              garder: doc.data().garder,
              age: doc.data().age,
              tel: doc.data().tel,
              datatime: doc.data().datatime,
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
      .collection("peoples")
      .doc(iddelete)
      .delete()
      .then((res) => {
        console.log("Deleted!", res);
      });
    setOpenDelete(false);
  };

  const openUpdateDialog = (people) => {
    setOpen(true);
    setToUpdateId(people.id);
    setUpdate(people.id);
    setUpdatepassword(people.password);
    setUpdatename(people.name);
    setUpdategarder(people.garder);
    setUpdateage(people.age);
    setUpdatetel(people.tel);
  };

  const editTodo = () => {
    firestore.collection("peoples").doc(toUpdateId).update({
      people: update,
      password: updatepassword,
      name: updatename,
      garder: updategarder,
      age: updateage,
      tel: updatetel,
    });
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const filter = peoples.filter((people) => {
    return people.name.toLowerCase().indexOf(search) !== -1;
  });
  var dataInpage = 0;
  var dataInpage = peoples.length;

  {
    peoples.map((p) => console.log(p.name,p.id));
  }
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
            <h5>ข้อมูลผู้ใช้งานทั้งหมด</h5>
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
              <br></br>
              <br></br>
              {dataInpage > 0 ? (
                <Container>
                  {filter.map((people) => (
                    <div>
                      <Paper variant="outlined" className={classes.paperlist}>
                        <ListItem key={people.id}>
                          <ListItemAvatar>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={people.name}
                            secondary={people.datetime}
                          />
                           

                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="Edit"
                              onClick={() => openUpdateDialog(people)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleClickOpenDelete(people)}
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
                  size="small"
                  autoFocus
                  margin="normal"
                  label="ไอดี"
                  type="text"
                  fullWidth
                  name="updatepeople"
                  value={update}
                  onChange={(event) => setUpdate(event.target.value)}
                />
                <TextField
                  variant="outlined"
                  autoFocus
                  margin="dense"
                  label="รหัสผ่าน"
                  type="text"
                  fullWidth
                  name="updatepassword"
                  value={updatepassword}
                  onChange={(event) => setUpdatepassword(event.target.value)}
                />
                <TextField
                  variant="outlined"
                  autoFocus
                  margin="dense"
                  label="ชื่อ"
                  type="text"
                  fullWidth
                  name="updatename"
                  value={updatename}
                  onChange={(event) => setUpdatename(event.target.value)}
                />
                <FormControl component="fieldset" margin="normal">
                  <FormLabel component="legend">เพศ</FormLabel>
                  <RadioGroup
                    row
                    aria-label="gender"
                    name="gender1"
                    value={updategarder}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="หญิง"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="ชาย"
                    />
                  </RadioGroup>
                </FormControl>

                <TextField
                  variant="outlined"
                  autoFocus
                  margin="dense"
                  label="อายุ"
                  type="text"
                  fullWidth
                  name="updateage"
                  value={updateage}
                  onChange={(event) => setUpdateage(event.target.value)}
                />

                <TextField
                  variant="outlined"
                  autoFocus
                  margin="dense"
                  label="โทรศัพท์"
                  type="text"
                  fullWidth
                  name="updatetel"
                  value={updatetel}
                  onChange={(event) => setUpdatetel(event.target.value)}
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
            <Link to={`${url}/peopleadd`}>
              <Tooltip title="Add" aria-label="Add">
                <Fab color="primary" className={classes.materialicons}>
                  <AddIcon />
                </Fab>
              </Tooltip>
            </Link>
          </Container>
        </Route>
        <Route path={`${path}/peopleadd`}>
          <Peopleadds />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
