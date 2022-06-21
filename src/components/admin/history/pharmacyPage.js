import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { firestore } from "../../../database/firebase";
import { Button, ButtonGroup } from "@material-ui/core";
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";

import Historylist from "./history";
import Report from "./report";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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

export default function VerticalTabs() {
  const [currentPost, setCurrentPost] = useState({});
  const [historys, setHistorys] = useState([]);
  let { pharmacyId } = useParams();
  const { url, path } = useRouteMatch();
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

        firestore
          .collection("pharmacys")
          .doc(pharmacyId)
          .collection("finish")
          .where("pass", "==", true)
          .orderBy("datetime", "desc")
          .limit(5)
          .onSnapshot((snapshot) => {
            setHistorys(
              snapshot.docs.map((doc) => {
                return {
                  id: doc.id,
                  categoryId: doc.data().categoryId,
                  people_name: doc.data().people_name,
                  finishId: doc.data().finishId,
                  pass: doc.data().pass,
                  datetime: doc.data().datetime,
                  questionId: doc.data().questionId,
                  avgscore: doc.data().avgscore,
                  name: doc.data().name,
                };
              })
            );
          });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [pharmacyId]);

  const data = [];
  {
    historys.map((his) =>
      data.push({
        time: new Date(his.datetime.seconds * 1000).toLocaleDateString(
          "th-TH",
          {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }
        ),
        name: his.name,
        score: his.avgscore,
      })
    );
  }

  return (
    <div>
      <BrowserRouter>
        <AppBar variant="outlined" position="static" color="primary">
          <Toolbar>
            <Typography
              variant="subtitle1"
              style={{ flexGrow: 1, textAlign: "center", marginLeft: 115 }}
              gutterBottom
            >
              {currentPost.name}
            </Typography>
            <ButtonGroup
              variant="text"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Link to={`${url}/history`}>
                <Button>ประวัติ</Button>
              </Link>
              <Link to={`${url}/report`}>
                <Button>รายงาน</Button>
              </Link>
            </ButtonGroup>
          </Toolbar>
        </AppBar>

        <Switch>
          <Route path={`${path}/history`}>
            <Historylist />
          </Route>
          <Route path={`${path}/report`}>
            <Report />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
