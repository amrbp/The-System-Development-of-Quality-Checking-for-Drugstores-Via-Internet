import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { auth } from "../database/firebase";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { AuthContext } from "../App";
import { green } from "@material-ui/core/colors";
import {
  Container,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  LabelList,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
} from "recharts";
//################################  Icon   ####################################
import SearchIcon from "@material-ui/icons/Search";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import StoreIcon from "@material-ui/icons/Store";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
//###########################################################################

import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  useRouteMatch,
  useHistory,
  useParams,
} from "react-router-dom";
import { firestore } from "../database/firebase";
import PermiumPage from "../components/permium/permiumPage";
import Search from "../components/permium/search";
import Paper from "@material-ui/core/Paper";

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
    marginLeft: 30,
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
  premium: {
    position: "absolute",
    width: "27%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tabsbar: {
    border: 2,
  },
  navstyle: {
    marginTop: 5,
  },
  paper: {
    padding: theme.spacing(1),
    margin: "auto",
  },
}));

function App2() {
  let history = useHistory();
  const classes = useStyles();
  const { url, path } = useRouteMatch();
  const [header, setHeader] = useState("เพิ่มแบบประเมิน");
  const [value, setValue] = useState("recents");
  const { logout } = useContext(AuthContext);
  let { premium } = useParams();
  const [peoples, setPeoples] = React.useState([]);
  const [movies, setMovies] = useState([]);
  const [historys, setHistorys] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [search, setSearch] = useState("");

  const [pharmacys, setPharmacys] = useState([]);
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

    firestore
      .collection("historys")
      .get()
      .then((response) => {
        const fetchedMovies = [];
        response.forEach((document) => {
          const fetchedMovie = {
            id: document.id,
            ...document.data(),
          };
          fetchedMovies.push(fetchedMovie);
        });
        setHistorys(fetchedMovies);
      });

    firestore
      .collection("peoples")
      .where("id", "==", premium)
      .onSnapshot((snapshot) => {
        setPeoples(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              name: doc.data().name,
            };
          })
        );
      });
  }, []);
  const filter = pharmacys.filter((pharmacy) => {
    return pharmacy.name.toLowerCase().indexOf(search) !== -1;
  });

  var data = [];
  var data01 = [];
  var scoreAvg = [];
  var total1 = 0;
  var array1 = [];
  var useData = [];

  {
    historys.map((m) =>
      data.push({
        avgscore: Number(m.avgscore).toFixed(2),
        pharmacyName: m.pharmacyName,
      })
    );
  }
  {
    historys.map((m) =>
      data01.push({ name: m.pharmacyName, value: m.avgscore })
    );
  }

  {
    historys.map((m) => array1.push(Number(m.avgscore)));
  }

  for (var i = 0; i < array1.length; i++) {
    total1 += array1[i];
  }
  scoreAvg.push(total1);
  useData.push(Number(scoreAvg[0] / array1.length));
  {
    movies.map((m) => console.log(m));
  }
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={path}>
          <div>
            <AppBar position="static" color="primary">
              <Toolbar>
                <Typography variant="h6" className={classes.premium}>
                  {peoples.map((people) => people.name)}
                  <Typography variant="subtitle2" gutterBottom>
                    สถานะ: เจ้าหน้าที่กระทรวงสาธารณสุข
                  </Typography>
                </Typography>

                <Typography variant="h6" className={classes.title}>
                  หน้าแรก
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
            <h5>ผลตรวจย้อนหลัง</h5>
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
                style={{ width: 250, height: 30, borderRadius: 15, border: 2 }}
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
              {filter.map((pharmacy, index) => (
                <div key={index}>
                  <Paper variant="outlined" className={classes.paper}>
                    <ListItem key={pharmacy.id}>
                      <Link to={`${url}/pharmacyPage/${pharmacy.id}/history`}>
                        <ListItemAvatar>
                          <Avatar>
                            <StoreIcon />
                          </Avatar>
                        </ListItemAvatar>
                      </Link>
                      <Link to={`${url}/pharmacyPage/${pharmacy.id}/history`}>
                        <ListItemText
                          primary={pharmacy.name}
                          secondary={pharmacy.datetime}
                        />
                      </Link>
                      <ListItemSecondaryAction>
                        {pharmacy.isCom === "true" && (
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
                        {pharmacy.isCom === "false" && (
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
          <Container maxWidth="sm">
            <div style={{ textAlign: "center" }}>
              <br></br>
              <Typography variant="h6" gutterBottom>
                กราฟผลการประเมินของร้านขายยาทั้งหมด
              </Typography>
              <Container maxWidth="lg">
                <LineChart
                  layout="vertical"
                  width={360}
                  height={300}
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="6 6" />
                  <XAxis type="pharmacyName" />
                  <YAxis dataKey="pharmacyName" type="category" />
                  <Tooltip />
                  <Line dataKey="avgscore" stroke="#8884d8" />
                </LineChart>
                <PieChart width={400} height={400}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={data01}
                    cx={200}
                    cy={200}
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                </PieChart>
              </Container>
            </div>
            <div style={{ position: "absolute" }}>
              <Typography variant="h6" gutterBottom>
                คะแนนเฉลี่ยของร้านขายยาทั้งหมด : {useData.map((u) => u)}
              </Typography>
            </div>
            <br />
            <br />
            <br />
          </Container>
        </Route>
        <Route path={`${path}/pharmacyPage/:pharmacyId`}>
          <PermiumPage />
        </Route>
        <Route path={`${path}/Search`}>
          <Search />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
export default App2;
