import React, { use, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import TaskCard2 from "../../components/Cards/TaskCard2";
import toast from "react-hot-toast";

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const [generalRes, mindmapRes] = await Promise.all([
        axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
          params: { status: filterStatus === "All" ? "" : filterStatus },
        }),
        axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASK_MINDMAP),
      ]);

      const generalTasks = generalRes.data?.tasks || [];
      const mindmapTasks = mindmapRes.data || [];

      // Gabungkan dan urutkan berdasarkan createdAt
      const combinedTasks = [...generalTasks, ...mindmapTasks];
      const sortedTasks = combinedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      setAllTasks(sortedTasks);

      const statusSummary = generalRes.data?.statusSummary || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
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
    } else {
      navigate(`/user/task-details/${task._id}`);
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Courses">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Air dan Tumbuhan</h2>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks?.map((item, index) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              assignedTo={item.assignedTo}
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoChecklist={item.todoChecklist || []}
              onClick={() => handleClick(item)}
            />
          ))}
        </div> */}

        <div className="relative flex flex-col gap-6 mt-4 pl-4">
          {allTasks?.map((item, index) => {
            const isLocked = index > 0 && allTasks[index - 1].status !== "Completed";
            const isCompleted = item.status === "Completed";
            const isLast = index === allTasks.length - 1;

            return (
              <div key={item._id} className="flex">
                {/* Lingkaran indikator */}
                <div className="absolute mt-4">
                  <div className={`w-8 h-8 rounded-full z-10 ${isCompleted ? "bg-blue-500" : "bg-gray-300"}`} />
                  {!isLast && <div className={`ml-2.5 -mt-1 w-3 h-16 z-0 ${isCompleted ? "bg-blue-500" : "bg-gray-300"}`} />}
                </div>
                <div className="w-full ml-12">
                  <TaskCard2
                    title={item.title}
                    description={item.description}
                    status={item.status}
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
