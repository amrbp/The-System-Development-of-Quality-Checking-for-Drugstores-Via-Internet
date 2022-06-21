import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import SearchIcon from "@material-ui/icons/Search";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import StoreIcon from "@material-ui/icons/Store";
import { green } from "@material-ui/core/colors";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { AuthContext } from "../../App";
import PermiumPage from "../user/phamacypage";
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  useRouteMatch,
  useHistory,
  useParams,
} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import HomeIcon from "@material-ui/icons/Home";
import { firestore } from "../../database/firebase";

const useStyles = makeStyles((theme) => ({
  user: {
    position: "relative",
  },
  title: {
    flex: 1,
    position: "relative",
    textAlign: "center",
    color: "#ffffff",
  },
}));

export default function Search() {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const { path } = useRouteMatch();
  const [pharmacys, setPharmacys] = useState([]);
  let { user } = useParams();
  const { logout } = useContext(AuthContext);
  let history = useHistory();

  useEffect(() => {
    firestore
      .collection("pharmacys")
      .orderBy("datetime", "asc")
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
  }, []);

  const filter = pharmacys.filter((pharmacy) => {
    return pharmacy.name.toLowerCase().indexOf(search) !== -1;
  });

  const goHome = () => {
    history.push(`/user/${user}/home`);
  };
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={path}>
          <div>
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
                  ค้นหา
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
          </div>
          <br />
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
          <Container>
            <List dense={true}>
              {filter.map((pharmacy) => (
                <div>
                  <Paper variant="outlined" className={classes.paper}>
                    <ListItem key={pharmacy.id}>
                      <ListItemAvatar>
                        <Avatar>
                          <StoreIcon />
                        </Avatar>
                      </ListItemAvatar>

                      <Link to={`/user/${user}/home/pharmacy/${pharmacy.id}`}>
                        <ListItemText
                          primary={pharmacy.name}
                          secondary={pharmacy.datetime}
                        />
                      </Link>
                      <ListItemSecondaryAction>
                        {pharmacy.isCom === true && (
                          <IconButton
                            edge="end"
                            aria-label="alive"
                            size="small"
                          >
                            <FiberManualRecordIcon
                              style={{ color: green[500] }}
                            />
                          </IconButton>
                        )}
                        {pharmacy.isCom === false && (
                          <IconButton
                            edge="end"
                            aria-label="alive"
                            size="small"
                          >
                            <FiberManualRecordIcon color="secondary" />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Paper>
                </div>
              ))}
            </List>
          </Container>
        </Route>
        <Route path={`/user/:user/home/pharmacy/:pharmacyId`}>
          <PermiumPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
