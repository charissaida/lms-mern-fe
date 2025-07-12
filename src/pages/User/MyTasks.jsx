import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import TaskCard2 from "../../components/Cards/TaskCard2";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import { ObjectId } from "bson";

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [surveyedTaskIds, setSurveyedTaskIds] = useState([]);
  const [ePortfolioId, setEPortfolioId] = useState(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fixedId = "6870c39f1782cf126fa700e1";
    localStorage.setItem("ePortfolioId", fixedId);
    setEPortfolioId(fixedId);
  }, []);

  const getSurveyedTasks = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_SURVEY_BY_USER_ID(user._id));
      const surveyList = Array.isArray(res.data) ? res.data : [res.data];
      const taskIds = surveyList.map((s) => s.idTask);
      setSurveyedTaskIds(taskIds);
    } catch (error) {
      if (error.response?.status === 404) {
        setSurveyedTaskIds([]);
      } else {
        console.error("Gagal mengambil data survei:", error);
        toast.error("Gagal mengambil data survei");
      }
    }
  };

  const getAllTasks = async () => {
    try {
      const [generalRes, mindmapRes, materialRes] = await Promise.all([axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS), axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASK_MINDMAP), axiosInstance.get(API_PATHS.TASKS.GET_MATERIALS)]);

      const generalTasks = generalRes.data?.tasks || [];
      const mindmapTasks = mindmapRes.data || [];
      const materialTasks =
        materialRes.data?.map((m, i) => ({
          ...m,
          taskType: "material",
          title: i === 0 && m.term ? m.term : m.title || m.term || "Materi",
        })) || [];

      const combinedTasks = [...generalTasks, ...mindmapTasks, ...materialTasks];
      let sortedTasks = combinedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      // Tambahkan task E-Portfolio di akhir
      const ePortfolioTask = {
        _id: "6870c39f1782cf126fa700e1",
        taskType: "e-portfolio",
        title: "E-Portfolio",
        description: "Lengkapi portofolio akhirmu di sini.",
        status: "Pending",
        createdAt: new Date().toISOString(),
        assignedTo: [],
        attachments: [],
        completedTodoCount: 0,
        todoChecklist: [],
      };

      sortedTasks = [...sortedTasks, ePortfolioTask];

      setAllTasks(sortedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Gagal mengambil data tugas");
    }
  };

  const handleClick = (task) => {
    const title = task.title.toLowerCase();

    if (title.includes("pretest")) {
      navigate(`/user/pretest/${task._id}`);
    } else if (title.includes("postest")) {
      navigate(`/user/postest/${task._id}`);
    } else if (title.includes("problem")) {
      navigate(`/user/problem/${task._id}`);
    } else if (title.includes("mindmap")) {
      navigate(`/user/mindmap/${task._id}`);
    } else if (title.includes("refleksi")) {
      navigate(`/user/refleksi/${task._id}`);
    } else if (title.includes("materi")) {
      navigate(`/user/materi/${task._id}`);
    } else if (title.includes("glosarium")) {
      navigate(`/user/glosarium/${task._id}`);
    } else if (title.includes("learning")) {
      navigate(`/user/lo/${task._id}`);
    } else if (title.includes("berpikir")) {
      navigate(`/user/kbk/${task._id}`);
    } else if (task.taskType === "e-portfolio") {
      navigate("/user/e-portfolio", { state: { taskId: task._id } });
    } else {
      navigate(`/user/task-details/${task._id}`);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getSurveyedTasks();
    }
  }, [user]);

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  useEffect(() => {
    const ePortfolioWasCompleted = location.state?.ePortfolioCompleted;
    if (ePortfolioWasCompleted && ePortfolioId) {
      setSurveyedTaskIds((prev) => [...new Set([...prev, ePortfolioId])]);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, ePortfolioId]);

  return (
    <DashboardLayout activeMenu="Courses">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Hubungan Air dan Tumbuhan</h2>
        </div>

        <div className="relative flex flex-col gap-6 mt-4 pl-4">
          {allTasks?.map((item, index) => {
            const isCompleted = surveyedTaskIds.includes(item._id);
            const isLocked = index > 0 && !surveyedTaskIds.includes(allTasks[index - 1]._id);
            const isLast = index === allTasks.length - 1;

            return (
              <div key={item._id} className="flex">
                <div className="absolute mt-4">
                  <div className={`w-8 h-8 rounded-full z-10 ${isCompleted ? "bg-blue-500" : "bg-gray-300"}`} />
                  {!isLast && <div className={`ml-2.5 -mt-1 w-3 h-16 z-0 ${isCompleted ? "bg-blue-500" : "bg-gray-300"}`} />}
                </div>
                <div className="w-full ml-12">
                  <TaskCard2
                    title={item.title}
                    description={item.description}
                    status={isCompleted ? "Completed" : "Pending"}
                    createdAt={item.createdAt}
                    assignedTo={item.assignedTo}
                    attachmentCount={item.attachments?.length || 0}
                    completedTodoCount={item.completedTodoCount || 0}
                    onClick={() => {
                      if (!isLocked) handleClick(item);
                    }}
                    isLocked={isLocked}
                    isCompleted={isCompleted}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
