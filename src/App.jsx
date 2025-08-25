import { Route, Routes, useMatch, useNavigate } from "react-router-dom";
import { LoginPage, Register, NotFound } from "./Routes";
import {
  MyOrders,
  NewOrderForm,
  ProjectDetail,
  Revisions,
  EditOrder,
  Profile,
  SingleRevision,
} from "./components/client";
import { RootLayout } from "./layouts/RootLayout";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useTokenExpirationCheck } from "./hooks/tokenExpiration";
import "./App.css";
import { Greeting } from "./components/client/Greeting";
import ScrollToTop from "./components/ScrollToTop";
import { Redirect } from "./components/Redirect";

function App() {
  // to block certain developer tools shortcuts on the keyboard
  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (
  //       event.key === "F12" ||
  //       (event.ctrlKey && event.shiftKey && event.key === "I")
  //     ) {
  //       event.preventDefault();
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  useTokenExpirationCheck(); // Call the custom hook to check token expiration

  // ProtectedRoute component to restrict access to certain routes for unauthenticated users
  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector(
      (state) => state.authenticate.isAuthenticated
    );
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/login"); // Redirect to login page if not authenticated
      }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? children : null;
  };

  return (
    <>
      <ScrollToTop />
      <Toaster />
      <Routes>
        <Route path="/">
        <Route index element={<Redirect />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<Register />} />
          {/* Client Dashboard Protected Routes */}
          <Route
            path="clientpanel/*"
            element={
              <ProtectedRoute>
                <RootLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MyOrders />} />
            <Route path="neworder/:service" element={<NewOrderForm />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="orders/:service/:orderId"
              element={<ProjectDetail />}
            />
            <Route path="revisions">
              <Route index element={<Revisions />} />
              <Route path=":service/:orderId" element={<SingleRevision />} />
            </Route>
            <Route
              path="editorder/:serviceType/:orderId"
              element={<EditOrder />}
            />
            <Route path="order/placed" element={<Greeting />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
