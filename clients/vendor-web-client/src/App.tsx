import React from "react";
import "./App.css";
import Sidenav from "./Components/Sidenav";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ShopInfo from "./Components/ShopInfo";
import Products from "./Components/Products";
import { useAuth0 } from "@auth0/auth0-react";
import loading from "./Assets/images/loading.gif";
import Login from "./Components/Login";
import Welcome from "./Components/Welcome";
import Orders from "./Components/Orders";
import Discounts from "./Components/Discounts";
import Review from "./Components/Review";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading)
    return (
      <div id="bgImg">
        <img
          style={{
            width: "10%",
            position: "absolute",
            left: "45%",
            top: "40%",
          }}
          src={loading}
        />
      </div>
    );

  return (
    <div className="App">
      <Router>
        {isAuthenticated ? (
          <Sidenav>
            <Switch>
              <Route exact path="/" component={Welcome} />
              <Route exact path="/shopinfo" component={ShopInfo} />
              <Route path="/products" component={Products} />
              <Route path="/orders" component={Orders} />
              <Route path="/discounts" component={Discounts} />
              <Route path="/reviews" component={Review} />
            </Switch>
          </Sidenav>
        ) : (
          <Login />
        )}
      </Router>
    </div>
  );
}

export default App;
