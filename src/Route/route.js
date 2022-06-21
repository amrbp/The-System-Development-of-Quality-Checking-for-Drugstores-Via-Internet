import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { auth } from "../database/firebase";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { AuthContext } from "../App";
import "./route.css";
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  useRouteMatch,
  useHistory,
} from "react-router-dom";

//######################## icon ########################
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PharmacyIcon from "./pharmacy.png";
import AddUser from "./add-user.png";
import History from "./history.png";
import Assessment from "./Assessment.png";
// #############################People############################
import Question from "../components/admin/question/questionlist";
import Addquestion from "../components/admin/question/addquestion";

// #############################People############################
import Peoplelist from "../components/admin/people/peoplelist";
import Peopleadd from "../components/admin/people/peopleadd";

// #############################People############################
import Pharmacylist from "../components/admin/pharmacy/pharmacylist";
import Pharmacyadd from "../components/admin/pharmacy/pharmacyadd";

// #############################People############################
import Historylist from "../components/admin/history/historylist";
import PharmacyPage from "../components/admin/history/pharmacyPage";
const NotFound = () => <div>Not Page</div>;

function App2() {
  const useStyles = makeStyles((theme) => ({
    menuButton: {
      marginRight: theme.spacing(0),
    },
    title: {
      flexGrow: 1,
      position: "relative",
      textAlign: "center",
      color: "#ffffff",
      marginLeft: 20,
    },
    admin: {
      position: "absolute",
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
    tabIcon: {
      flexGrow: 1,
      position: "relative",
      textAlign: "center",
      color: "#ffffff",
    },
    IconLable: {
      width: 30,
      marginTop: -12,
    },
  }));
  let history = useHistory();
  const classes = useStyles();
  const { url, path } = useRouteMatch();
  const [header, setHeader] = useState("เพิ่มแบบประเมิน");
  const { logout } = useContext(AuthContext);

  React.useEffect(() => {}, [header]);
  return (
    <div>
      <BrowserRouter>
        <div>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" className={classes.admin}>
                admin
              </Typography>
              <Typography variant="h6" className={classes.title}>
                {header}
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

        <div class="icon-bar">
          <Link to={`${url}/question`}>
            <div onClick={() => setHeader("เพิ่มแบบประเมิน")}>
              <i class="fa fa-home">
                <img
                  src={Assessment}
                  className={classes.IconLable}
                  alt="Pharmacy"
                />
              </i>
              <Typography
                variant="subtitle2"
                gutterBottom
                style={{ marginTop: -10 }}
              >
                แบบฟอร์ม
              </Typography>
            </div>
          </Link>

          <Link to={`${url}/people`}>
            <div onClick={() => setHeader("จัดการผู้ใช้งาน")}>
              <i class="fa fa-search">
                <img
                  src={AddUser}
                  className={classes.IconLable}
                  alt="Pharmacy"
                />
              </i>
              <Typography
                variant="subtitle2"
                gutterBottom
                style={{ marginTop: -10 }}
              >
                เพิ่มผู้ใช้
              </Typography>
            </div>
          </Link>
          <Link to={`${url}/pharmacy`}>
            <div onClick={() => setHeader("จัดการร้านขายยา")}>
              <i class="fa fa-envelope">
                <img
                  src={PharmacyIcon}
                  className={classes.IconLable}
                  alt="Pharmacy"
                />
              </i>
              <Typography
                variant="subtitle2"
                gutterBottom
                style={{ marginTop: -10 }}
              >
                ร้านขายยา
              </Typography>
            </div>
          </Link>
          <Link to={`${url}/history`}>
            <div onClick={() => setHeader("ดูผลตรวจย้อนหลัง")}>
              <i class="fa fa-globe">
                <img
                  src={History}
                  className={classes.IconLable}
                  alt="Pharmacy"
                />
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
        </div>

        <div className={classes.navstyle}>
          <Switch>
            <Route path="/admin/question">
              <Question />
            </Route>
            <Route path={`${path}/people`}>
              <Peoplelist />
            </Route>
            <Route path={`${path}/pharmacy`}>
              <Pharmacylist />
            </Route>
            <Route path={`${path}/history`}>
              <Historylist />
            </Route>
            <Route path={`${path}/peopleadd`}>
              <Peopleadd />
            </Route>
            <Route path={`${path}/addquestion`}>
              <Addquestion />
            </Route>
            <Route path={`${path}/pharmacyadd`}>
              <Pharmacyadd />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App2;
