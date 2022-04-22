import { Redirect, Route } from "react-router-dom";

export default function AuthenticatedRoute({ component: C, appProps, ...rest }) {
    console.log("appProps.isAuthenticated",appProps.isAuthenticated)
    return (
      <Route
        {...rest}
        render={props =>
            appProps.isAuthenticated === "INIT" ? "" : 
          appProps.isAuthenticated === "TRUE"
            ? <C {...props} {...appProps} />
            : <Redirect
                to={`/Login?redirect=${props.location.pathname}${props.location.search}`}
              />}
      />
    );
  }