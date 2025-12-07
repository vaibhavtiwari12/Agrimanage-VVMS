import { Redirect, Route } from 'react-router-dom';

export default function AuthenticatedRoute({ component: C, appProps, ...rest }) {
  console.log('appProps.isAuthenticated', appProps.isAuthenticated, appProps.year);
  return (
    <Route
      {...rest}
      render={props => {
        console.log('App Props = ', appProps);
        if (appProps.isAuthenticated === 'INIT') {
        } else if (appProps.isAuthenticated === 'TRUE') {
          if (props.location.pathname === '/yearSelector') {
            return <C {...props} {...appProps} />;
          } else {
            if (appProps.year) {
              console.log('Returning the Component');
              return <C {...props} {...appProps} />;
            } else {
              console.log('REDIRECTING -----------------------');
              return (
                <Redirect
                  to={`/yearSelector?redirect=${props.location.pathname}${props.location.search}`}
                />
              );
            }
          }
        } else {
          return (
            <Redirect to={`/Login?redirect=${props.location.pathname}${props.location.search}`} />
          );
        }
      }}
    />
  );
}
