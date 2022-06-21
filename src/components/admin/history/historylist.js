import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { firestore } from "../../../database/firebase";
import { Link, Switch, Route, useRouteMatch } from "react-router-dom";
import {
  Container,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@material-ui/core";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import StoreIcon from "@material-ui/icons/Store";
import SearchIcon from "@material-ui/icons/Search";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { green } from "@material-ui/core/colors";
import PharmacyPage from "./pharmacyPage";
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
    height: 85,
    flexGrow: 1,
  },
  tabsbar: {
    border: 2,
  },
  paperlist: {
    padding: theme.spacing(1),
    margin: "auto",
  },
}));

export default function Historylist(props) {
  const classes = useStyles();
  const { url, path } = useRouteMatch();
  const [pharmacys, setPharmacys] = useState([]);
  const [search, setSearch] = useState("");

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

  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <div className={classes.labelbar}>
            <h5>ประวัติย้อนหลัง</h5>
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
              <br />
              <br />

              {filter.map((pharmacy) => (
                <div>
                  <Paper variant="outlined" className={classes.paperlist}>
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
        </Route>
        <Route path={`${path}/pharmacyPage/:pharmacyId`}>
          <PharmacyPage />
        </Route>
      </Switch>
    </div>
  );
}
