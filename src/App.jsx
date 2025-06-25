import React, { useContext } from "react";
import { Route, Routes, BrowserRouter as Router, Outlet, Navigate } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import PrivateRoute from "./routes/PrivateRoute";
import UserProvider, { UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import UserSetting from "./pages/User/UserSetting";
import Setting from "./pages/Admin/Setting";
import PretestPage from "./pages/User/DetailTask/PretestPage";
import PretestAdmin from "./pages/Admin/DetailTask/PretestAdmin";
import PostestAdmin from "./pages/Admin/DetailTask/PostestAdmin";
import PretestListAnswer from "./pages/Admin/AnswerTask/PretestListAnswer";
import PretestAnswerDetail from "./pages/Admin/DetailAnswer/PretestAnswerDetail";
import PretestResultAnswer from "./pages/User/ResultAnswer/PretestResultAnswer";
import SurveyPage from "./pages/User/Surveypage";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />

            {/* Admin */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTasks />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/setting" element={<Setting />} />

              {/* Pretest */}
              <Route path="/admin/create-task/pretest" element={<PretestAdmin />} />
              <Route path="/admin/list-answer/pretest/:taskId" element={<PretestListAnswer />} />
              <Route path="/admin/answer/pretest/:userId" element={<PretestAnswerDetail />} />

              {/* Postest */}
              <Route path="/admin/create-task/postest" element={<PostestAdmin />} />
            </Route>

            {/* User */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/tasks" element={<MyTasks />} />
              <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
              <Route path="/survey" element={<SurveyPage />} />

              {/* Pretest */}
              <Route path="/user/pretest/:id" element={<PretestPage />} />
              <Route path="/user/pretest/result/:id" element={<PretestResultAnswer />} />

              {/* <Route path="/user/postes/:id" element={<Postes />} /> */}
              <Route path="/user/setting" element={<UserSetting />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return null;

  if (!user) {
    return <LandingPage />;
  }

  return user.role === "admin" ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/user/dashboard" replace />;
};
