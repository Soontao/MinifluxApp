import { Route } from "react-router-dom";
import { useAppSelector } from "../store";

const PrivateRoute = ({ component: Component, login: Login, ...rest }: any) => {
  const userSetup = useAppSelector((state) => state.userReducer.userSetup);

  return (
    <Route
      {...rest}
      render={(props) => (userSetup ? <Component {...props} /> : <Login />)}
    />
  );
};

export default PrivateRoute;
