import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import Error from "./Components/Error.jsx";
import DefaultLayout from "./Components/DefaultLayout.jsx";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from "./store/store.js";
import ProtectedRoute from "./Auth_Components/ProtectedRoute.jsx";
import LoginDisabled from "./Components/LoginDisabled.jsx";
import {CssBaseline} from "@mui/material";
import {HelmetProvider} from "react-helmet-async"
import ClientDashboard from "./Pages/Dashboard.jsx";
import JobManagementPage from "./Pages/JobManagement.jsx";
import ProposalManagementPage from "./Pages/ProposalManagement.jsx";
import RatingsFeedback from "./Pages/Review.jsx";
import PaymentManagement from "./Pages/Payment.jsx";
import WorkSubmissionsTracking from "./Pages/ProjectTracking.jsx";
import ProfilePage from "./Pages/Profile.jsx";
import HomePage from "./Pages/home.jsx";
import Chatbot from "./Pages/chatbot.jsx";


const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    path: "/",
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <HomePage/>,
      },

      {
        element: <ProtectedRoute />,
        path: "/",
        children: [
          {
            element: <ClientDashboard />,
            path: "/dashboard",
          },
          {
            element: <ProposalManagementPage />,
            path: "/proposal",
          },
          {
            element: <JobManagementPage />,
            path: "/jobs",
          },
          {
            element: <WorkSubmissionsTracking/>,
            path: "/project",
          },
          {
            element: <ProfilePage/>,
            path: "/profile",
          },
          {
            element: <PaymentManagement/>,
            path: "/payment",
          },
          {
            element: <RatingsFeedback/>,
            path: "/feedback",
          },
          {
            element: <Chatbot/>,
            path: "/chatbot",
          },
        ]
      },
      {
        element: <LoginDisabled />,
        children: [
          {
            element: <Login />,
            path: "/login",
          }
        ]
      },
      {
        element: <Signup/>,
        path: "/signup",
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </HelmetProvider>
      </PersistGate>
    </Provider>
);
