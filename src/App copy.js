import React, { createContext, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// import { authentication } from "./components/utils/fakeBackend";
import Login from "./Route/login";
import Routeadmin from "./Route/route";
import RouteUser from "./Route/routeuser";
import db from "./database/firebase";
const users = [
  { id: "admin", password: "admin", role: "admin" },
  { id: "user", password: "user", role: "member" },
  { id: "user", password: "123", role: "member" },
];

export const authentication = (id, password) => {
  authentication = db.collection("peoples").get().then((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      password: doc.data().password,
      role: doc.data().role,
    }));
    console.log(data)
    const user = data.find((u) => u.id === id && u.password === password);
    let authentication;

    if (user) {
      if (user.role === "member") {
        authentication = "member";
        console.log(user.role);
      } else if (user.role === "admin") {
        authentication = "admin";
        console.log(user.role);
      }
    } else {
      authentication = null;
      console.log("false");
    }
    return authentication;
  });
  
  return authentication;
};

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const login = (id, password) => setAuth(authentication(id, password));

  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
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
          <Route path="/:userId">
            <RouteUser />
          </Route>
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
