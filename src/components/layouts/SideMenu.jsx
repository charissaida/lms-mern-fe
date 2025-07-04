import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import avatar from "../../assets/images/avatar.png";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  const handleClick = (route, type) => {
    if (type === "logout") {
      setShowLogoutModal(true);
      return;
    }

    navigate(route);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);

      // Setelah logout, bersihkan token dan context user
      localStorage.clear();
      clearUser();

      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    }
    return () => {};
  }, [user]);

  return (
    <>
      <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[55px] z-20">
        <div className="block lg:hidden">
          <div className="flex flex-col items-center justify-center mb-7 pt-5">
            <div className="relative">
              <img src={user?.profileImageUrl || avatar} alt="Profile Image" className="w-20 h-20 bg-slate-400 rounded-full" />
            </div>

            {user?.role === "admin" && <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">Admin</div>}

            <h5 className="text-gray-950 font-medium leading-6 mt-3">{user?.name || ""}</h5>

            <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
          </div>
        </div>

        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text[15px] ${activeMenu == item.label ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-l-4" : ""} py-3 px-6 mb-3 cursor-pointer`}
            onClick={() => handleClick(item.path, item.type)}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        ))}
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm relative">
            <button onClick={() => setShowLogoutModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer">
              &times;
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 18.25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z" />
                </svg>
              </div>
              <p className="text-lg font-semibold mb-4">Apakah Anda yakin ingin keluar?</p>
              <div className="flex gap-4">
                <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutModal(false);
                    handleLogout();
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideMenu;
