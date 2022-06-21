import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { auth } from "../../database/firebase";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { AuthContext } from "../../App";
import {
  Container,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { green } from "@material-ui/core/colors";
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  useRouteMatch,
  useHistory,
  useParams
} from "react-router-dom";
import { firestore } from "../../database/firebase";
import PermiumPage from "./permiumPage";
import HomeIcon from "@material-ui/icons/Home";


function App2() {
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
      height: 60,
      color: "#ffffff",
    },
    Toolbar: {
      height: 63,
      flexGrow: 1,
    },
    tabsbar: {
      border: 2,
    },
    navstyle: {
      marginTop: 5,
    },
  }));
  let history = useHistory();
  const classes = useStyles();
  const { url, path } = useRouteMatch();
  const [header, setHeader] = useState("เพิ่มแบบประเมิน");
  const [value, setValue] = useState("recents");
  const { logout } = useContext(AuthContext);
  let { premium } = useParams();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [search, setSearch] = useState("");
  const [pharmacys, setPharmacys] = useState([]);

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
              isCom: doc.data().isCom,
            };
          })
        );
      });
  }, []);
  const filter = pharmacys.filter((pharmacy) => {
    return pharmacy.name.toLowerCase().indexOf(search) !== -1;
  });

  const goHome =()=>{
    history.push(`/premium/${premium}/home`)
  }
  
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={path}>
          <div>
            <AppBar position="static" color="inherit">
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
                  }}
                >
                  <ExitToAppIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
          </div>

          <Container>
            <List dense={true}>
              <input
                type="text"
                placeholder="ค้นหา"
                onChange={(e) => setSearch(e.target.value)}
              />
              {filter.map((pharmacy) => (
                <ListItem key={pharmacy.id}>
                  <Link to={`/premium/${premium}/home/pharmacyPage/${pharmacy.id}/history`}>
                    <ListItemText
                      primary={pharmacy.name}
                      secondary={pharmacy.datetime}
                    />
                  </Link>
                  <ListItemSecondaryAction>
                    {pharmacy.isCom === true && (
                      <IconButton edge="end" aria-label="alive" size="small">
                        <FiberManualRecordIcon style={{ color: green[500] }} />
                      </IconButton>
                    )}
                    {pharmacy.isCom === false && (
                      <IconButton edge="end" aria-label="alive" size="small">
                        <FiberManualRecordIcon color="secondary" />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Container>
        </Route>
        <Route path={`/premium/:premium/home/pharmacyPage/:pharmacyId`}>
          <PermiumPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App2;
