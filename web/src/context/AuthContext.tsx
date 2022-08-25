import { createContext, useContext } from "react";
import {
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  User,
} from "../graphql/generated";

interface AuthContextProvider {
  user?: User | null;
  loading: boolean;
  login: ReturnType<typeof useLoginMutation>[0];
  logout: ReturnType<typeof useLogoutMutation>[0];
}

const AuthContext = createContext<AuthContextProvider>({
  user: null,
  loading: false,
  login: {},
  logout: {},
} as AuthContextProvider);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, loading: meLoading } = useMeQuery();
  const [login, { loading: loginLoading }] = useLoginMutation({
    refetchQueries: ["Me"],
  });
  const [logout, { loading: logoutLoading }] = useLogoutMutation(
    { refetchQueries: ["Me"] }
  );
  const loading = meLoading || loginLoading || logoutLoading;
  const user = data?.me;
  const value = { user, loading, login, logout };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
