import React, { useState, useEffect } from "react";
import { firestore } from "../../../database/firebase";
import { Link, Switch, Route, useRouteMatch } from "react-router-dom";
import { DeleteOutlineRounded, Edit } from "@material-ui/icons";
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
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import StoreIcon from "@material-ui/icons/Store";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import Pharmacyadd from "./pharmacyadd";

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
  const [pharmacys, setPharmacys] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateid, setUpdateid] = useState("");
  const [updatename, setUpdatename] = useState("");
  const [updateowner, setUpdateowner] = useState("");
  const [updateoperator, setUpdateoperator] = useState("");
  const [updateaddress, setUpdateaddress] = useState("");
  const [updatetel, setUpdatetel] = useState("");
  const [updatefax, setUpdatefax] = useState("");
  const [updatephone, setUpdatephone] = useState("");
  const [toUpdateId, setToUpdateId] = useState("");
  const { url, path } = useRouteMatch();
  const [search, setSearch] = useState("");
  const [iddelete, setIddelete] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [openReset, setOpenReset] = useState(false);

  useEffect(() => {
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
      .collection("pharmacys")
      .doc(iddelete)
      .delete()
      .then((res) => {
        console.log("Deleted!", res);
      });
    setOpenDelete(false);
  };

  const openUpdateDialog = (pharmacy) => {
    setOpen(true);
    setToUpdateId(pharmacy.id);
    setUpdateid(pharmacy.id);
    setUpdatename(pharmacy.name);
    setUpdateowner(pharmacy.nameowner);
    setUpdateoperator(pharmacy.nameoperator);
    setUpdateaddress(pharmacy.address);
    setUpdatetel(pharmacy.tel);
    setUpdatefax(pharmacy.fax);
    setUpdatephone(pharmacy.phone);
  };

  const handleClickOpenReset = () => {
    setOpenReset(true);
  };
  const handleCloseReset = () => {
    setOpenReset(false);
  };

  const resetPharmacys = () => {
    firestore
      .collection("pharmacys")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.update({
            isCom: "false",
          });
        });
      });
    firestore
      .collection("pharmacys")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref
            .collection("around")
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.delete();
              });
            });
        });
      });
    firestore
      .collection("pharmacys")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref
            .collection("form_show")
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.delete();
              });
            });
        });
      });

    setOpenReset(false);
  };

  const editTodo = () => {
    firestore.collection("pharmacys").doc(toUpdateId).update({
      id: updateid,
      name: updatename,
      nameowner: updateowner,
      nameoperator: updateoperator,
      address: updateaddress,
      tel: updatetel,
      fax: updatefax,
      phone: updatephone,
    });
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const filter = pharmacys.filter((pharmacy) => {
    return pharmacy.name.toLowerCase().indexOf(search) !== -1;
  });
  var dataInpage = 0;
  var dataInpage = pharmacys.length;
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
            <h5>ข้อมูลร้านขายยาทั้งหมด</h5>
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
              {dataInpage > 0 ? (
                <Container maxWidth="lg">
                  <div style={{ position: "absolute", right: 0 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleClickOpenReset}
                    >
                      รีเซ็ตร้านที่ผ่านทั้งหมด
                    </Button>
                  </div>
                  <br></br>
                  <br></br>
                  {filter.map((pharmacy) => (
                    <div>
                      <Paper variant="outlined" className={classes.paperlist}>
                        <ListItem key={pharmacy.id}>
                          <ListItemAvatar>
                            <Avatar>
                              <StoreIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={pharmacy.name}
                            secondary={pharmacy.datetime}
                          />

                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="Edit"
                              onClick={() => openUpdateDialog(pharmacy)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleClickOpenDelete(pharmacy)}
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
                  label="เลขที่ใบอนุญาต"
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
                  label="สถานประกอบการชื่อ"
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
                  id="nameowner"
                  label="ชื่อผู้รับอนุญาต"
                  name="nameowner"
                  autoFocus
                  value={updateowner}
                  onChange={(event) => setUpdateowner(event.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  size="small"
                  fullWidth
                  id="nameoperator"
                  label="ชื่อผู้รับอนุญาต"
                  name="nameoperator"
                  autoFocus
                  value={updateoperator}
                  onChange={(event) => setUpdateoperator(event.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  size="small"
                  fullWidth
                  id="address"
                  label="ที่อยู่"
                  name="address"
                  autoFocus
                  value={updateaddress}
                  onChange={(event) => setUpdateaddress(event.target.value)}
                />

                <TextField
                  variant="outlined"
                  margin="dense"
                  size="small"
                  fullWidth
                  id="tel"
                  label="เบอร์โทร"
                  name="tel"
                  autoFocus
                  value={updatetel}
                  onChange={(event) => setUpdatetel(event.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  size="small"
                  fullWidth
                  id="fax"
                  label="โทรสาร"
                  name="fax"
                  autoFocus
                  value={updatefax}
                  onChange={(event) => setUpdatefax(event.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  size="small"
                  fullWidth
                  id="phone"
                  label="มือถือ"
                  name="phone"
                  autoFocus
                  value={updatephone}
                  onChange={(event) => setUpdatephone(event.target.value)}
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
              onClose={handleClosedelete}
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

            <Dialog
              open={openReset}
              onClose={handleCloseReset}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"รีเซ็ตร้านที่ผ่านทั้งหมด"}
              </DialogTitle>
              <DialogContent>
                คุณต้องการที่จะรีเซ็ตร้านทั้งหมดที่ผ่านการประเมินหรือไม่
              </DialogContent>
              <DialogActions>
                <Button onClick={resetPharmacys} color="primary">
                  ยืนยัน
                </Button>
                <Button onClick={handleCloseReset} color="primary" autoFocus>
                  ยกเลิก
                </Button>
              </DialogActions>
            </Dialog>

            <Link to={`${url}/pharmacyadd`}>
              <Tooltip title="Add" aria-label="Add">
                <Fab color="primary" className={classes.materialicons}>
                  <AddIcon />
                </Fab>
              </Tooltip>
            </Link>
          </Container>
        </Route>
        <Route path={`${path}/pharmacyadd`}>
          <Pharmacyadd />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
