import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  useParams,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
  Link,
} from "react-router-dom";
import { ListItem, ListItemText, TextField } from "@material-ui/core";
import { IconButton, Button } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import { firestore } from "../../database/firebase";
import { Table } from "react-bootstrap";
import AlarmIcon from "@material-ui/icons/Alarm";
import "bootstrap/dist/css/bootstrap.min.css";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import firebase from "firebase";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Sumhistory from "./sumhistory";
import { AuthContext } from "../../App";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    maxwidth: 1,
    height: 58,
  },
  menuButton: {
    marginRight: theme.spacing(0),
  },
  homeButton: {
    marginLeft: theme.spacing(0),
  },

  title: {
    flexGrow: 1,
    position: "relative",
    textAlign: "center",
    color: "#ffffff",
  },
  lablebar: {
    flexGrow: 1,
    height: 58,
    maxWidth: 700,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 800,
  },
  papers: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 770,
  },
  image: {
    width: "auto",
    textAlign: "center",
    verticalAlign: "middle",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    paddingBottom: 20,
  },
  upper: {
    width: "auto",
    textAlign: "center",
    verticalAlign: "middle",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    position: "relative",
    padding: theme.spacing(2),
  },
  radio: {},
  score: {
    textAlign: "center",
  },
}));

export default function FullWidthTabs() {
  const classes = useStyles();
  const [categorys, setCategorys] = useState([]);
  let { questionId, pharmacyId, scoreId, categoryId, user } = useParams();
  const [currentPost, setCurrentPost] = useState([]);
  const { url, path } = useRouteMatch();
  let history = useHistory();
  const [scores, setScores] = useState([]);
  const [status, setStatus] = useState([]);
  const [inputname, setInputname] = useState("");
  const { logout } = useContext(AuthContext);
  const [numberaround, setNumberaround] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [fileUrl, setFileUrl] = useState([]);
  const [answer_image, setAnswer_image] = useState([]);
  const [value, setValue] = useState(false);
  const handleChange = (event) => {
    setValue(event.target.value);
  };

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
    firestore
      .collectionGroup("signature")
      .where("answerId", "==", categoryId)
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
        setCinemas(fetchedMovies);
      });

    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(questionId)
      .collection("answers")
      .doc(categoryId)
      .collection("images")
      .get()
      .then((response) => {
        const fetchedMovies = [];
        response.forEach((document) => {
          const fetchedMovie = {
            id: document.id,
            answerId: document.data().answerId,
            categoryId: document.data().categoryId,
            imageUrl: document.data().imageUrl,
            nameImage: document.data().nameImage,
          };
          fetchedMovies.push(fetchedMovie);
        });
        setFileUrl(fetchedMovies);
      });

    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(questionId)
      .collection("answers")
      .doc(categoryId)
      .collection("category_answers")
      .where("answerId", "==", categoryId)
      .onSnapshot((snapshot) => {
        setScores(
          snapshot.docs.map((doc) => {
            return {
              answerId: doc.data().answerId,
              categoryId: doc.data().categoryId,
              name: doc.data().id,
              score: doc.data().score,
              standard_score: doc.data().standard_score,
              subquestionId: doc.data().subquestionId,
              canCut: doc.data().canCut,
            };
          })
        );
      });

    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(questionId)
      .collection("answers")
      .doc(categoryId)
      .collection("signature")
      .limit(1)
      .orderBy("datetime", "asc")
      .onSnapshot((snapshot) => {
        setStatus(
          snapshot.docs.map((doc) => {
            return {
              answerId: doc.data().answerId,
              people_name: doc.data().people_name,
              signatureId: doc.data().signatureId,
            };
          })
        );
      });

    firestore
      .collection("questions")
      .doc(questionId)
      .collection("categorys")
      .get()
      .then((response) => {
        const fetchedCinemas = [];
        response.docs.forEach((document) => {
          const fetchedCinema = {
            id: document.id,
            ...document.data(),
          };
          fetchedCinemas.push(fetchedCinema);
        });
        setCategorys(fetchedCinemas);
      });

    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("around")
      .onSnapshot((snapshot) => {
        setNumberaround(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
            };
          })
        );
      });
    fetchData();
  }, [questionId]);

  const all = [];
  const result = [];
  const titles = [];
  const array1 = [];
  const array2 = [];
  const array3 = [];
  const array4 = [];
  const array5 = [];
  const arrayst1 = [];
  const arrayst2 = [];
  const arrayst3 = [];
  const arrayst4 = [];
  const arrayst5 = [];
  var totalst1 = 0;
  var totalst2 = 0;
  var totalst3 = 0;
  var totalst4 = 0;
  var totalst5 = 0;
  const title1 = [];
  const title2 = [];
  const title3 = [];
  const title4 = [];
  const title5 = [];
  const key1 = [];
  const key2 = [];
  const key3 = [];
  const key4 = [];
  const key5 = [];
  var total1 = 0;
  var total2 = 0;
  var total3 = 0;
  var total4 = 0;
  var total5 = 0;
  const avg = [];
  {
    scores.map((answer, index) => {
      answer.categoryId === "01001" &&
        answer.canCut === false &&
        array1.push(Number(answer.score));
      answer.categoryId === "01002" &&
        answer.canCut === false &&
        array2.push(Number(answer.score));
      answer.categoryId === "01003" &&
        answer.canCut === false &&
        array3.push(Number(answer.score));
      answer.categoryId === "01004" &&
        answer.canCut === false &&
        array4.push(Number(answer.score));
      answer.categoryId === "01005" &&
        answer.canCut === false &&
        array5.push(Number(answer.score));
    });
  }
  const sumarray1 = [];
  const sumarray2 = [];
  const sumarray3 = [];
  const sumarray4 = [];
  const sumarray5 = [];
  const sumWeight1 = [];
  const sumWeight2 = [];
  const sumWeight3 = [];
  const sumWeight4 = [];
  const sumWeight5 = [];
  {
    scores.map((answer, index) => {
      answer.categoryId === "01001" &&
        answer.canCut === false &&
        sumarray1.push(Number(answer.score) * Number(answer.standard_score));
      answer.categoryId === "01002" &&
        answer.canCut === false &&
        sumarray2.push(Number(answer.score) * Number(answer.standard_score));
      answer.categoryId === "01003" &&
        answer.canCut === false &&
        sumarray3.push(Number(answer.score) * Number(answer.standard_score));
      answer.categoryId === "01004" &&
        answer.canCut === false &&
        sumarray4.push(Number(answer.score) * Number(answer.standard_score));
      answer.categoryId === "01005" &&
        answer.canCut === false &&
        sumarray5.push(Number(answer.score) * Number(answer.standard_score));
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "02001" &&
        answer.canCut === false &&
        sumarray1.push(Number(answer.score) * Number(answer.standard_score));
      answer.categoryId === "02002" &&
        answer.canCut === false &&
        sumarray2.push(Number(answer.score) * Number(answer.standard_score));
      answer.categoryId === "02003" &&
        answer.canCut === false &&
        sumarray3.push(Number(answer.score) * Number(answer.standard_score));
      answer.categoryId === "02004" &&
        answer.canCut === false &&
        sumarray4.push(Number(answer.score) * Number(answer.standard_score));
      answer.categoryId === "02005" &&
        answer.canCut === false &&
        sumarray5.push(Number(answer.score) * Number(answer.standard_score));
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "03001" &&
        answer.canCut === false &&
        sumarray1.push(Number(answer.score) * Number(answer.standard_score));
      answer.categoryId === "03002" &&
        answer.canCut === false &&
        sumarray2.push(Number(answer.score) * Number(answer.standard_score));
      answer.categoryId === "03003" &&
        answer.canCut === false &&
        sumarray3.push(Number(answer.score) * Number(answer.standard_score));
      answer.categoryId === "03004" &&
        answer.canCut === false &&
        sumarray4.push(Number(answer.score) * Number(answer.standard_score));
      answer.categoryId === "03005" &&
        answer.canCut === false &&
        sumarray5.push(Number(answer.score) * Number(answer.standard_score));
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "02001" &&
        answer.canCut === false &&
        array1.push(Number(answer.score));
      answer.categoryId === "02002" &&
        answer.canCut === false &&
        array2.push(Number(answer.score));
      answer.categoryId === "02003" &&
        answer.canCut === false &&
        array3.push(Number(answer.score));
      answer.categoryId === "02004" &&
        answer.canCut === false &&
        array4.push(Number(answer.score));
      answer.categoryId === "02005" &&
        answer.canCut === false &&
        array5.push(Number(answer.score));
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "01001" &&
        answer.canCut === false &&
        sumWeight1.push(2 * Number(answer.standard_score));
      answer.categoryId === "01002" &&
        answer.canCut === false &&
        sumWeight2.push(2 * Number(answer.standard_score));
      answer.categoryId === "01003" &&
        answer.canCut === false &&
        sumWeight3.push(2 * Number(answer.standard_score));
      answer.categoryId === "01004" &&
        answer.canCut === false &&
        sumWeight4.push(2 * Number(answer.standard_score));
      answer.categoryId === "01005" &&
        answer.canCut === false &&
        sumWeight5.push(2 * Number(answer.standard_score));
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "02001" &&
        answer.canCut === false &&
        sumWeight1.push(2 * Number(answer.standard_score));
      answer.categoryId === "02002" &&
        answer.canCut === false &&
        sumWeight2.push(2 * Number(answer.standard_score));
      answer.categoryId === "02003" &&
        answer.canCut === false &&
        sumWeight3.push(2 * Number(answer.standard_score));
      answer.categoryId === "02004" &&
        answer.canCut === false &&
        sumWeight4.push(2 * Number(answer.standard_score));
      answer.categoryId === "02005" &&
        answer.canCut === false &&
        sumWeight5.push(2 * Number(answer.standard_score));
    });
  }

  {
    scores.map((answer, index) => {
      answer.categoryId === "03001" &&
        answer.canCut === false &&
        sumWeight1.push(2 * Number(answer.standard_score));
      answer.categoryId === "03002" &&
        answer.canCut === false &&
        sumWeight2.push(2 * Number(answer.standard_score));
      answer.categoryId === "03003" &&
        answer.canCut === false &&
        sumWeight3.push(2 * Number(answer.standard_score));
      answer.categoryId === "03004" &&
        answer.canCut === false &&
        sumWeight4.push(2 * Number(answer.standard_score));
      answer.categoryId === "03005" &&
        answer.canCut === false &&
        sumWeight5.push(2 * Number(answer.standard_score));
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "03001" &&
        answer.canCut === false &&
        array1.push(Number(answer.score));
      answer.categoryId === "03002" &&
        answer.canCut === false &&
        array2.push(Number(answer.score));
      answer.categoryId === "03003" &&
        answer.canCut === false &&
        array3.push(Number(answer.score));
      answer.categoryId === "03004" &&
        answer.canCut === false &&
        array4.push(Number(answer.score));
      answer.categoryId === "03005" &&
        answer.canCut === false &&
        array5.push(Number(answer.score));
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "01001" &&
        answer.canCut === false &&
        arrayst1.push(Number(answer.standard_score));
      answer.categoryId === "01002" &&
        answer.canCut === false &&
        arrayst2.push(Number(answer.standard_score));
      answer.categoryId === "01003" &&
        answer.canCut === false &&
        arrayst3.push(Number(answer.standard_score));
      answer.categoryId === "01004" &&
        answer.canCut === false &&
        arrayst4.push(Number(answer.standard_score));
      answer.categoryId === "01005" &&
        answer.canCut === false &&
        arrayst5.push(Number(answer.standard_score));
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "02001" &&
        answer.canCut === false &&
        arrayst1.push(Number(answer.standard_score));
      answer.categoryId === "02002" &&
        answer.canCut === false &&
        arrayst2.push(Number(answer.standard_score));
      answer.categoryId === "02003" &&
        answer.canCut === false &&
        arrayst3.push(Number(answer.standard_score));
      answer.categoryId === "02004" &&
        answer.canCut === false &&
        arrayst4.push(Number(answer.standard_score));
      answer.categoryId === "02005" &&
        answer.canCut === false &&
        arrayst5.push(Number(answer.standard_score));
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "03001" &&
        answer.canCut === false &&
        arrayst1.push(Number(answer.standard_score));
      answer.categoryId === "03002" &&
        answer.canCut === false &&
        arrayst2.push(Number(answer.standard_score));
      answer.categoryId === "03003" &&
        answer.canCut === false &&
        arrayst3.push(Number(answer.standard_score));
      answer.categoryId === "03004" &&
        answer.canCut === false &&
        arrayst4.push(Number(answer.standard_score));
      answer.categoryId === "03005" &&
        answer.canCut === false &&
        arrayst5.push(Number(answer.standard_score));
    });
  }

  {
    categorys.map((category) => {
      category.categoryId === "01001" && title1.push(category.category_name);
      category.categoryId === "01002" && title2.push(category.category_name);
      category.categoryId === "01003" && title3.push(category.category_name);
      category.categoryId === "01004" && title4.push(category.category_name);
      category.categoryId === "01005" && title5.push(category.category_name);
    });
  }
  {
    categorys.map((category) => {
      category.categoryId === "02001" && title1.push(category.category_name);
      category.categoryId === "02002" && title2.push(category.category_name);
      category.categoryId === "02003" && title3.push(category.category_name);
      category.categoryId === "02004" && title4.push(category.category_name);
      category.categoryId === "02005" && title5.push(category.category_name);
    });
  }
  {
    categorys.map((category) => {
      category.categoryId === "03001" && title1.push(category.category_name);
      category.categoryId === "03002" && title2.push(category.category_name);
      category.categoryId === "03003" && title3.push(category.category_name);
      category.categoryId === "03004" && title4.push(category.category_name);
      category.categoryId === "03005" && title5.push(category.category_name);
    });
  }
  {
    categorys.map((category) => {
      category.categoryId === "01001" && key1.push(category.categoryId);
      category.categoryId === "01002" && key2.push(category.categoryId);
      category.categoryId === "01003" && key3.push(category.categoryId);
      category.categoryId === "01004" && key4.push(category.categoryId);
      category.categoryId === "01005" && key5.push(category.categoryId);
    });
  }
  {
    categorys.map((category) => {
      category.categoryId === "02001" && key1.push(category.categoryId);
      category.categoryId === "02002" && key2.push(category.categoryId);
      category.categoryId === "02003" && key3.push(category.categoryId);
      category.categoryId === "02004" && key4.push(category.categoryId);
      category.categoryId === "02005" && key5.push(category.categoryId);
    });
  }
  {
    categorys.map((category) => {
      category.categoryId === "03001" && key1.push(category.categoryId);
      category.categoryId === "03002" && key2.push(category.categoryId);
      category.categoryId === "03003" && key3.push(category.categoryId);
      category.categoryId === "03004" && key4.push(category.categoryId);
      category.categoryId === "03005" && key5.push(category.categoryId);
    });
  }

  const sub_question1 = [];
  const sub_question2 = [];
  const sub_question3 = [];
  const sub_question4 = [];
  const sub_question5 = [];
  {
    scores.map((answer, index) => {
      answer.categoryId === "01001" &&
        sub_question1.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          score: answer.score,
          canCut: answer.canCut,
        });
      answer.categoryId === "01002" &&
        sub_question2.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          score: answer.score,
          canCut: answer.canCut,
        });
      answer.categoryId === "01003" &&
        sub_question3.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          score: answer.score,
          canCut: answer.canCut,
        });
      answer.categoryId === "01004" &&
        sub_question4.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          score: answer.score,
          canCut: answer.canCut,
        });
      answer.categoryId === "01005" &&
        sub_question5.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          score: answer.score,
          canCut: answer.canCut,
        });
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "02001" &&
        sub_question1.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          canCut: answer.canCut,
          score: answer.score,
        });
      answer.categoryId === "02002" &&
        sub_question2.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          score: answer.score,
          canCut: answer.canCut,
        });
      answer.categoryId === "02003" &&
        sub_question3.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          score: answer.score,
          canCut: answer.canCut,
        });
      answer.categoryId === "02004" &&
        sub_question4.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          score: answer.score,
          canCut: answer.canCut,
        });
      answer.categoryId === "02005" &&
        sub_question5.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          score: answer.score,
          canCut: answer.canCut,
        });
    });
  }
  {
    scores.map((answer, index) => {
      answer.categoryId === "03001" &&
        sub_question1.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          score: answer.score,
          canCut: answer.canCut,
        });
      answer.categoryId === "03002" &&
        sub_question2.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          score: answer.score,
          canCut: answer.canCut,
        });
      answer.categoryId === "03003" &&
        sub_question3.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          score: answer.score,
          canCut: answer.canCut,
        });
      answer.categoryId === "03004" &&
        sub_question4.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          score: answer.score,
          canCut: answer.canCut,
        });
      answer.categoryId === "03005" &&
        sub_question5.push({
          subquestion: answer.subquestionId,
          subquestion_name: answer.name,
          standard: answer.standard_score,
          score: answer.score,
          canCut: answer.canCut,
        });
    });
  }
  for (var i = 0; i < array1.length; i++) {
    total1 += array1[i];
  }
  for (var i = 0; i < array2.length; i++) {
    total2 += array2[i];
  }
  for (var i = 0; i < array3.length; i++) {
    total3 += array3[i];
  }
  for (var i = 0; i < array4.length; i++) {
    total4 += array4[i];
  }
  for (var i = 0; i < array5.length; i++) {
    total5 += array5[i];
  }

  for (var i = 0; i < arrayst1.length; i++) {
    totalst1 += arrayst1[i];
  }
  for (var i = 0; i < array2.length; i++) {
    totalst2 += arrayst2[i];
  }
  for (var i = 0; i < array3.length; i++) {
    totalst3 += arrayst3[i];
  }
  for (var i = 0; i < array4.length; i++) {
    totalst4 += arrayst4[i];
  }
  for (var i = 0; i < array5.length; i++) {
    totalst5 += arrayst5[i];
  }

  var totalCate1 = 0;
  var totalCate2 = 0;
  var totalCate3 = 0;
  var totalCate4 = 0;
  var totalCate5 = 0;
  for (var i = 0; i < sumarray1.length; i++) {
    totalCate1 += sumarray1[i];
  }
  for (var i = 0; i < sumarray2.length; i++) {
    totalCate2 += sumarray2[i];
  }
  for (var i = 0; i < sumarray3.length; i++) {
    totalCate3 += sumarray3[i];
  }
  for (var i = 0; i < sumarray4.length; i++) {
    totalCate4 += sumarray4[i];
  }
  for (var i = 0; i < sumarray5.length; i++) {
    totalCate5 += sumarray5[i];
  }

  var totalW1 = 0;
  var totalW2 = 0;
  var totalW3 = 0;
  var totalW4 = 0;
  var totalW5 = 0;

  for (var i = 0; i < sumWeight1.length; i++) {
    totalW1 += sumWeight1[i];
  }
  for (var i = 0; i < sumWeight2.length; i++) {
    totalW2 += sumWeight2[i];
  }
  for (var i = 0; i < sumWeight3.length; i++) {
    totalW3 += sumWeight3[i];
  }
  for (var i = 0; i < sumWeight4.length; i++) {
    totalW4 += sumWeight4[i];
  }
  for (var i = 0; i < sumWeight5.length; i++) {
    totalW5 += sumWeight5[i];
  }

  const sumAll1 = [];
  const sumAll2 = [];
  const sumAll3 = [];
  const sumAll4 = [];
  const sumAll5 = [];

  const numSumAll = [];
  numSumAll.push(
    sumAll1.push((totalCate1 / totalW1) * 100),
    sumAll2.push((totalCate2 / totalW2) * 100),
    sumAll3.push((totalCate3 / totalW3) * 100),
    sumAll4.push((totalCate4 / totalW4) * 100),
    sumAll5.push((totalCate5 / totalW5) * 100)
  );

  avg.push(
    (sumAll1[0] + sumAll2[0] + sumAll3[0] + sumAll4[0] + sumAll5[0]) /
      numSumAll.length
  );

  result.push(
    {
      score_standard: total1,
      category_answer: totalst1,
      category_name: title1.toString(),
      categoryId: key1.toString(),
      sub_question: sub_question1,
      scoreCate: totalCate1,
      scoreW: totalW1,
    },
    {
      score_standard: total2,
      category_answer: totalst2,
      category_name: title2.toString(),
      categoryId: key2.toString(),
      sub_question: sub_question2,
      scoreCate: totalCate2,
      scoreW: totalW2,
    },
    {
      score_standard: total3,
      category_answer: totalst3,
      category_name: title3.toString(),
      categoryId: key3.toString(),
      sub_question: sub_question3,
      scoreCate: totalCate3,
      scoreW: totalW3,
    },
    {
      score_standard: total4,
      category_answer: totalst4,
      category_name: title4.toString(),
      categoryId: key4.toString(),
      sub_question: sub_question4,
      scoreCate: totalCate4,
      scoreW: totalW4,
    },
    {
      score_standard: total5,
      category_answer: totalst5,
      category_name: title5.toString(),
      categoryId: key5.toString(),
      sub_question: sub_question5,
      scoreCate: totalCate5,
      scoreW: totalW5,
    }
  );

  // firestore
  //   .collection("pharmacys")
  //   .doc(pharmacyId)
  //   .collection("historys")
  //   .doc(questionId)
  //   .collection("answers")
  //   .doc(scoreId)
  //   .collection("category_answers")
  //   .doc("category")
  //   .update({
  //     totals_answers: avg[0],
  //     category_answers: result,
  //   });
  // firestore
  // .collection("pharmacys")
  // .doc(pharmacyId)
  // .collection("historys")
  // .doc(questionId)
  // .collection("answers")
  // .doc(scoreId)
  // .collection("category_answers")
  // .doc(`category/category_answers/0/sub_question`)
  // .update({
  //   totals_answers: avg[0],
  //   category_answers: result,
  // });

  const people_name = [];
  {
    status.map((sta) => people_name.push(sta.people_name));
  }
  var aroundnum = 0;
  var aroundnum = numberaround.length;
  console.log(result);
  const finish = () => {
    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(questionId)
      .collection("answers")
      .doc(scoreId)
      .update({
        comment: inputname,
      });

    firestore
      .collection("historys")
      .add({})
      .then(function (doc) {
        firestore
          .collection("historys")
          .doc(doc.id)
          .set({
            finishId: doc.id,
            pass: value,
            questionId: questionId,
            categoryId: categoryId,
            people_name: people_name[0],
            avgscore: avg[0],
            name: `ครั้งที่ ${aroundnum + 1}`,
            pharmacyName: currentPost.name,
            datetime: firebase.firestore.FieldValue.serverTimestamp(),
          });
      });

    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("historys")
      .doc(questionId)
      .collection("answers")
      .doc(categoryId)
      .update({
        signatures: cinemas,
        category_answers: result,
        images: fileUrl,
      });

    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("finish")
      .add({})
      .then(function (doc) {
        firestore
          .collection("pharmacys")
          .doc(pharmacyId)
          .collection("finish")
          .doc(doc.id)
          .set({
            finishId: doc.id,
            pass: value,
            questionId: questionId,
            categoryId: categoryId,
            people_name: people_name[0],
            avgscore: avg[0],
            name: `ครั้งที่ ${aroundnum + 1}`,
            pharmacyName: currentPost.name,
            datetime: firebase.firestore.FieldValue.serverTimestamp(),
          });
      });

    firestore.collection("pharmacys").doc(pharmacyId).update({ isCom: value });

    firestore
      .collection("pharmacys")
      .doc(pharmacyId)
      .collection("around")
      .add({})
      .then(function (doc) {
        firestore
          .collection("pharmacys")
          .doc(pharmacyId)
          .collection("around")
          .doc(doc.id)
          .set({
            around: doc.id,
            categoryId: categoryId,
            datetime: firebase.firestore.FieldValue.serverTimestamp(),
          });
      });

    history.push(`/user/${user}/home/pharmacy/${pharmacyId}`);
  };

  const goHome = () => {
    history.push(`/user/${user}/home`);
  };

  return (
    <div>
      <Switch>
        <Route exact path={path}>
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
          <div
            style={{
              flexGrow: 1,
              backgroundColor: "#1DB1DF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 81,
              color: "#ffffff",
            }}
          >
            <h5 style={{ textAlign: "center" }}>สรุปคะแนน</h5>
          </div>
          <br></br>
          <div>
            <h6 style={{ textAlign: "center" }}>หมวดคำถาม</h6>
          </div>
          <br></br>
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>หมวดที่</th>
                  <th>รายละเอียด</th>
                  <th>ร้อยละ</th>
                </tr>
              </thead>
              <tbody>
                {result.map((resu, index) => (
                  <tr key={index}>
                    <td>หมวดที่ {index + 1}</td>
                    <Link to={`${url}/Sumhistory/${resu.categoryId}`}>
                      <td>{resu.category_name}</td>
                    </Link>
                    <td>
                      {(
                        (Number(resu.scoreCate) / Number(resu.scoreW)) *
                        100
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2">ร้อยละเฉลี่ย</td>
                  <td>{avg.map((a) => Number(a).toFixed(2))}</td>
                </tr>
              </tbody>
            </Table>
            <br></br>
            <div>
              <div>
                <div>
                  <ListItem>
                    <ListItemText primary="สรุปผลการประเมิน" />

                    <RadioGroup
                      name="gender1"
                      value={value}
                      onChange={handleChange}
                      row
                      aria-label="position"
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio color="primary" />}
                        label="ผ่าน"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio color="primary" />}
                        label="ไม่ผ่าน"
                      />
                    </RadioGroup>
                  </ListItem>
                </div>
              </div>
              <br></br>
              <div>
                <TextField
                  id="filled-multiline-static"
                  label="ส่วนที่บกพร่อง/ขอให้แก้ไข"
                  multiline
                  fullWidth
                  rows={4}
                  variant="filled"
                  value={inputname}
                  onChange={(event) => setInputname(event.target.value)}
                />
              </div>
              <br></br>
              <br></br>
              <div style={{ textAlign: "center" }}>
                <br></br>
                <Button
                  variant="contained"
                  size="medium"
                  color="primary"
                  className={classes.margin}
                  onClick={finish}
                  disabled={!inputname}
                >
                  บันทึก
                </Button>
              </div>
            </div>
            <br></br>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around"></Grid>
            </MuiPickersUtilsProvider>
          </div>
        </Route>
        <Route path={`${path}/Sumhistory/:subquestionId`}>
          <Sumhistory />
        </Route>
      </Switch>
    </div>
  );
}
