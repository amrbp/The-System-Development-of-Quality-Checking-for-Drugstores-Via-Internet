import React, { createContext, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// import { authentication } from "./components/utils/fakeBackend";
import Login from "./Route/login";
import Routeadmin from "./Route/route";
import RouteUser from "./Route/routeuser";
import RoutePermium from "./Route/routepermium";
import { firestore } from "./database/firebase";

var peoples = [];
firestore
  .collection("peoples")
  .get()
  .then((snapshot) => {
    var data = snapshot.docs.map((doc) => ({
      id: doc.id,
      password: doc.data().password,
      role: doc.data().role,
      name: doc.data().name,
    }));
    peoples.push(data);
  });

const authentication = (id, password, name) => {
  var authentication;
  var name;
  var getpeople = [];
  peoples.map((u) => {
    u.map((s) => {
      getpeople.push(s);
    });
  });

  var user = getpeople.find((u) => (u.id === id) & (u.password === password));

  if (user) {
    if (user.role === "member") {
      authentication = "member";
      name = user.name;
      console.log(user.role);
    } else if (user.role === "admin") {
      authentication = "admin";
      name = user.name;
      console.log(user.role);
    } else if (user.role === "permium") {
      authentication = "permium";
      name = user.name;
      console.log(user.role);
    }
  } else {
    authentication = null;
    window.location.reload(false);
    alert("ไม่พบผู้ใช้งาน");
  }

  return authentication;
};

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [show, setShow] = useState(null);
  const login = (id, password) => setAuth(authentication(id, password));
  const showName = (name) => setShow(authentication(name));
  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider value={{ auth, show, login, logout, showName }}>
      {children}
    </AuthContext.Provider>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/admin">
            <Routeadmin />
          </Route>
          <Route path="/user/:user/home">
            <RouteUser />
          </Route>
          <Route path="/premium/:premium/Home">
            <RoutePermium />
          </Route>
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
