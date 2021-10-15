import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  return (
    <Route
      {...rest}
      render={(props) =>
        isSignedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
