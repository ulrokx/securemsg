import { Outlet } from "react-router-dom";
import { useMeQuery } from "../../graphql/generated";

const ProtectedRoute = () => {
  const { data } = useMeQuery();
  console.log(data)
  return <Outlet />;
};

export default ProtectedRoute;
