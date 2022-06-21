import React, { useContext, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logo from "./logo.png";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../App";

const Login = () => {
  const [user, setUser] = useState({ id: "", password: "" });
  const [Id, setId] = useState("");
  const { login, auth } = useContext(AuthContext);
  const history = useHistory();

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "25ch",
    },
    title: {
      textAlign: "center",
      marginTop: 50,
    },
    image: {
      marginRight: 40,
      marginTop: 50,
    },
    labelImage: {
      backgroundColor: "#1DB1DF",
    },
  }));
  //##############################################################################
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setId({ value: user.id });
  };

  useEffect(() => {
    if (auth && auth === "member") {
      history.push(`/user/${Id.value}/home`);
    }
    if (auth && auth === "admin") {
      history.push(`/${Id.value}/question`);
    }
    if (auth && auth === "permium") {
      history.push(`/premium/${Id.value}/home`);
    }
  }, [auth, history]);

  const classes = useStyles();

  return (
    <div style={{ textAlign: "center" }}>
      <div className={classes.labelImage}>
        <img src={logo} className={classes.image} alt="logo" />
        <br></br>
        <br></br>
      </div>

      <Container>
        <br></br>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(user.id, user.password);
            setUser({ id: "", password: "" });
          }}
        >
          <TextField
            variant="outlined"
            className="input"
            type="String"
            label="รหัสผู้ใช้"
            name="id"
            placeholder="รหัสผู้ใช้"
            onChange={handleChange}
          />
          <br></br>
          <br></br>
          <TextField
            variant="outlined"
            className="input"
            type="password"
            label="รหัสผ่าน"
            name="password"
            placeholder="รหัสผ่าน"
            onChange={handleChange}
          />
          <br></br>
          <br></br>
          <button
            style={{
              backgroundColor: "#1DB1DF",
              border: "none",
              color: "white",
              textAlign: "center",
              textDecoration: "none",
              display: "inline-block",
              cursor: "pointer",
              fontSize: 16,
              borderRadius: 4,
              paddingTop: 9,
              paddingBottom: 9,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            เข้าสู่ระบบ
          </button>
        </form>
        <br></br>
        <br></br>
      </Container>
    </div>
  );
};

export default Login;
