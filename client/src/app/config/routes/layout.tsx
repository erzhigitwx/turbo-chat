import { Route, Routes, useNavigate } from "react-router-dom";
import { routes } from "@/app/config/routes/routes";
import { getCookie } from "@/shared/utils";

const Layout = () => {
  const token = getCookie("token");
  const navigate = useNavigate();

  return (
    <Routes>
      {routes.map((route) => {
        if (route.credentials) {
          if (token) {
            return <Route path={route.path} element={route.element} id={route.name} key={route.name} />;
          } else {
            navigate("/registration");
          }
        } else {
          return <Route path={route.path} element={route.element} id={route.name} key={route.name} />;
        }
      })}
    </Routes>
  );
};

export { Layout };
