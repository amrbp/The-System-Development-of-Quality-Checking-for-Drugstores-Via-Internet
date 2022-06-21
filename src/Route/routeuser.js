import React, { useEffect, useContext } from "react";
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
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import StoreIcon from "@material-ui/icons/Store";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import { firestore } from "../database/firebase";
import Search from "../components/user/search";
import Phamacypage from "../components/user/phamacypage";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { green } from "@material-ui/core/colors";
import { AuthContext } from "../App";
import { ListItemSecondaryAction } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Container from "@material-ui/core/Container";
////////////////////////////////////////////////////////////////////////////////////////////////////

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: 58,
    maxWidth: 700,
  },
  menuButton: {
    marginRight: theme.spacing(0),
  },
  homeButton: {
    marginLeft: theme.spacing(0),
  },
  SearchButton: {
    marginRight: theme.spacing(0),
  },
  user: {
    position: "absolute",
    width: "30%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  title: {
    flex: 1,
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
    height: 81,
    color: "#ffffff",
  },
  Toolbar: {
    height: 85,
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
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title1: {
    margin: theme.spacing(4, 0, 2),
  },
  paperlist: {
    padding: theme.spacing(1),
    margin: "auto",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function CenteredTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [pharmacys, setPharmacys] = React.useState([]);
  const [pharmacystrue, setPharmacystrue] = React.useState([]);
  const [peoples, setPeoples] = React.useState([]);
  let { user } = useParams();
  const { url, path } = useRouteMatch();
  const { logout } = useContext(AuthContext);
  let history = useHistory();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    firestore
      .collection("pharmacys")
      .where("isCom", "==", "false")
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

    firestore
      .collection("pharmacys")
      .where("isCom", "==", "true")
      .onSnapshot((snapshot) => {
        setPharmacystrue(
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

    firestore
      .collection("peoples")
      .where("id", "==", user)
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={path}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" gutterBottom className={classes.user}>
                {peoples.map((people) => people.name)}
                <Typography variant="subtitle2" gutterBottom>
                  สถานะ: เภสัชกร
                </Typography>
              </Typography>
              <Typography variant="h6" gutterBottom className={classes.title}>
                หน้าแรก
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

          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
              textColor="primary"
              centered
            >
              <Tab
                className={classes.root}
                label="ยังไม่ตรวจ"
                {...a11yProps(0)}
              />
              <Tab
                className={classes.root}
                label="ตรวจแล้ว"
                {...a11yProps(1)}
              />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <Container maxWidth="lg">
              <List dense={true}>
                {pharmacys.map((pharmacy, index) => (
                  <Paper
                    variant="outlined"
                    className={classes.paperlist}
                    key={index}
                  >
                    <ListItem key={pharmacy.id}>
                      <Link to={`${url}/pharmacy/${pharmacy.id}`}>
                        <ListItemAvatar>
                          <Avatar>
                            <StoreIcon />
                          </Avatar>
                        </ListItemAvatar>
                      </Link>
                      <Link to={`${url}/pharmacy/${pharmacy.id}`}>
                        <ListItemText
                          primary={pharmacy.name}
                          secondary={pharmacy.datetime}
                        />
                      </Link>
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="alive" size="small">
                          <FiberManualRecordIcon color="secondary" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className={classes.demo}>
              <Container maxWidth="lg">
                <List dense={true}>
                  {pharmacystrue.map((pharmacy, index) => (
                    <Paper
                      variant="outlined"
                      className={classes.paperlist}
                      key={index}
                    >
                      <ListItem key={pharmacy.id}>
                        <Link to={`${url}/pharmacy/${pharmacy.id}`}>
                          <ListItemAvatar>
                            <Avatar>
                              <StoreIcon />
                            </Avatar>
                          </ListItemAvatar>
                        </Link>
                        <Link to={`${url}/pharmacy/${pharmacy.id}`}>
                          <ListItemText
                            primary={pharmacy.name}
                            secondary={pharmacy.datetime}
                          />
                        </Link>
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="alive"
                            size="small"
                          >
                            <FiberManualRecordIcon
                              style={{ color: green[500] }}
                            />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              </Container>
            </div>
          </TabPanel>

          <Link to={`${url}/search`}>
            <Tooltip title="Search" aria-label="Search">
              <Fab color="primary" className={classes.materialicons}>
                <SearchIcon />
              </Fab>
            </Tooltip>
          </Link>
        </Route>
        <Route path={`${path}/pharmacy/:pharmacyId`}>
          <Phamacypage />
        </Route>
        <Route path={`${path}/search`}>
          <Search />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
