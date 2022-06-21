import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { firestore } from "../../database/firebase";
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  useRouteMatch,
  useHistory,
  useParams,
} from "react-router-dom";
import { AuthContext } from "../../App";
import HistoryPharmacy from "./historyPharmacy";
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
} from "recharts";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

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
}));

export default function Historylist(props) {
  const classes = useStyles();
  const { url, path } = useRouteMatch();
  const [pharmacys, setPharmacys] = useState([]);
  let history = useHistory();
  const { logout } = useContext(AuthContext);
  const [historys, setHistorys] = useState([]);
  let { pharmacyId } = useParams();
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
  }, []);

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
      <Switch>
        <Route exact path={path}>
          <div className={classes.labelbar}>
            <h5>รายงาน</h5>
          </div>
          <Container maxWidth="sm">
            <div style={{ textAlign: "center" }}>
              <br></br>
              <Typography variant="h6" gutterBottom>
                กราฟผลการประเมินของ {currentPost.name}
              </Typography>
              <Container maxWidth="xs">
              <BarChart
                width={360}
                height={300}
                data={data}
                margin={{ top: 20, right: 60, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="6 6" />
                <XAxis dataKey="time"></XAxis>
                <YAxis dataKey="score" />
                <Tooltip />
                <Bar dataKey="score" fill="#8884d8">
                  <LabelList dataKey="score" position="inside" />
                  <LabelList dataKey="name" position="insideBottom" />
                </Bar>
              </BarChart>
              </Container>
            </div>
          </Container>
          <br></br>
          <br></br>
        </Route>
        <Route path={`${path}/:questionId/history/:categoryId/:finishId`}>
          <HistoryPharmacy />
        </Route>
      </Switch>
    </div>
  );
}
