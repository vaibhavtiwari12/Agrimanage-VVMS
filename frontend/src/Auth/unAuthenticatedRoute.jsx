import { Redirect, Route } from "react-router-dom";

const UnAuthenticatedRoute =  ({ component: C, appProps, history,...rest }) =>
  <Route
    {...rest}
    render={props =>
      appProps.isAuthenticated === "FALSE"
        ? <C {...props} {...appProps} />
        : history.location.search ?  <Redirect to={history.location.search.split("=")[1]} /> : <Redirect to="/"/>}
  />;

  export default UnAuthenticatedRoute;