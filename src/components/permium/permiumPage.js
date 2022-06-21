import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import FolderIcon from "@material-ui/icons/Folder";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { auth, firestore } from "../../database/firebase";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { AuthContext } from "../../App";
import AssessmentIcon from "@material-ui/icons/Assessment";
import "./premiumPage.css";
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  useRouteMatch,
  useHistory,
  useParams,
} from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import Historylist from "./historylist";
import Report from "./report";
import History from "./history.png";
import Diagram from "./diagram.png";

const NotFound = () => <div>Not Page</div>;
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
    color: "#ffffff",
  },
  labelbar: {
    flexGrow: 1,
    backgroundColor: "#1DB1DF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    color: "#ffffff",
    marginTop: -4,
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
  IconLable: {
    width: 30,
    marginTop: -12,
  },
}));
function App2() {
  let history = useHistory();
  const classes = useStyles();
  const { url, path } = useRouteMatch();
  const [header, setHeader] = useState("เพิ่มแบบประเมิน");
  const [value, setValue] = useState("recents");
  const { logout } = useContext(AuthContext);
  let { pharmacyId, premium } = useParams();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [currentPost, setCurrentPost] = useState({});

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

    fetchData();
  }, [pharmacyId]);

  const goHome = () => {
    history.push(`/premium/${premium}/home`);
    window.location.reload(false);
  };
  return (
    <BrowserRouter>
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
      </div>

      <div class="icon-bar-premium">
        <Link to={`${url}/history`}>
          <div>
            <i>
              <img src={History} className={classes.IconLable} alt="Pharmacy" />
            </i>
            <Typography
              variant="subtitle2"
              gutterBottom
              style={{ marginTop: -10 }}
            >
              ประวัติ
            </Typography>
          </div>
        </Link>
        <Link to={`${url}/report`}>
          <div>
            <i>
              <img src={Diagram} className={classes.IconLable} alt="Pharmacy" />
            </i>
            <Typography
              variant="subtitle2"
              gutterBottom
              style={{ marginTop: -10 }}
            >
              รายงาน
            </Typography>
          </div>
        </Link>
      </div>

      <div className={classes.navstyle}>
        <Switch>
          <Route path={`${path}/history`}>
            <Historylist />
          </Route>
          <Route path={`${path}/report`}>
            <Report />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App2;
