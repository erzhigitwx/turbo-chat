import { getCookie } from "@/shared/utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = (): boolean => {
  const token = getCookie("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/registration");
    }
  }, []);

  return !!token;
};

export { useAuth };
