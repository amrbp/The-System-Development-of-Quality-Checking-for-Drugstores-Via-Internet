import React, { useState, useEffect } from "react";
import {
  useParams,
  Link,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import { Button } from "@material-ui/core";
import { firestore } from "../../../database/firebase";
import Categorylist from "./categorylist";
import Imagelist from "./imagelist";
import Addpeoples from "./addpeoples";


const Selectquestion = () => {
  const { url, path } = useRouteMatch();
  const [loading, setLoading] = useState(true);
  let { userId } = useParams();
  const [currentPost, setCurrentPost] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await firestore
          .collection("questions")
          .doc(userId)
          .get();
        let data = { title: "not found" };
        if (response.exists) {
          data = response.data();
        }
        setCurrentPost(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [userId]);

  return (
    <div>
      <Switch>
        <Route exact path={`${path}`}>
          {!loading && currentPost.title}

          <div
            style={{
              flexGrow: 1,
              backgroundColor: "#1DB1DF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 60,
              color: "#ffffff",
              marginTop: -4,
            }}
          >
            <h5>เลือกแบบประเมิน</h5>
          </div>
          <br></br>
          <div style={{ textAlign: "center" }}>
            <div>{currentPost.question_name} </div>
            <br></br>
            <Link to={`${url}/categorys/${currentPost.questionId}`}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth5
              >
                คำถาม
              </Button>
            </Link>
            <br></br>
            <br></br>
            <Link to={`${url}/image/${currentPost.questionId}`}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth5
              >
                รูปภาพ
              </Button>
            </Link>
            <br></br>
            <br></br>
            <Link to={`${url}/questionPeoples/${currentPost.questionId}`}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth5
              >
                ผู้ตรวจ
              </Button>
            </Link>
          </div>
        </Route>
        <Route path={`${path}/categorys/:userId`}>
          <Categorylist />
        </Route>
        <Route path={`${path}/image/:userId`}>
          <Imagelist />
        </Route>
        <Route path={`${path}/questionPeoples/:peopleId`}>
          <Addpeoples />
        </Route>
      </Switch>
    </div>
  );
};

export default Selectquestion;
