import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { GiBackwardTime } from "react-icons/gi";
import toast from "react-hot-toast";

const PretestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [answers, setAnswers] = useState({});
  const [essayAnswers, setEssayAnswers] = useState({});

  useEffect(() => {
    const getTask = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
        setTask(res.data);
      } catch (e) {
        console.error("Error loading task:", e);
      }
    };
    getTask();
  }, [id]);

  const handleMCQChange = (qId, opt) => setAnswers((prev) => ({ ...prev, [qId]: opt }));

  const handleEssayChange = (qId, val) => setEssayAnswers((prev) => ({ ...prev, [qId]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task) return;

    // Format payload sesuai requirement
    const payload = {
      multipleChoiceAnswers: Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      })),
      essayAnswers: Object.entries(essayAnswers).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
    };

    try {
      await axiosInstance.post(API_PATHS.TASKS.POST_SUBMISSION_BY_TASK_ID(id), payload);
      toast.success("Jawaban berhasil dikirim!");
      navigate("/user/tasks");
    } catch (err) {
      toast.error("Gagal mengirim jawaban");
      console.error("Error submitting answers:", err.response?.data.message || err.message);
    }
  };

  if (!task) return <div className="text-center mt-10">Memuat...</div>;

  return (
    <DashboardLayout activeMenu="Courses">
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="flex-1">
          <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-blue-600 hover:underline cursor-pointer">
            <HiChevronLeft className="mr-1" /> Kembali
          </button>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-gray-600">{task.description}</p>
            <p className="mt-4 text-sm text-black">{(task.multipleChoiceQuestions?.length || 0) + (task.essayQuestions?.length || 0)} Soal</p>
            <div className="mt-2 h-2 bg-blue-500 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {task.multipleChoiceQuestions?.map((q, i) => (
              <div key={q._id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Soal {i + 1}</h3>
                <p className="mb-2">{q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, idx) => (
                    <label key={idx} className="block bg-gray-100 text-gray-600 rounded px-3 py-2 cursor-pointer hover:bg-blue-50">
                      <input type="radio" name={q._id} value={opt} checked={answers[q._id] === opt} onChange={() => handleMCQChange(q._id, opt)} className="mr-2" />
                      {String.fromCharCode(65 + idx)}. {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {task.essayQuestions?.map((q, i) => (
              <div key={q._id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Soal Essai {i + 1}</h3>
                <p className="mb-2">{q.question}</p>
                <textarea
                  name={q._id}
                  value={essayAnswers[q._id] || ""}
                  onChange={(e) => handleEssayChange(q._id, e.target.value)}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2 resize-none"
                  rows={4}
                  placeholder="Isi jawaban essai..."
                />
              </div>
            ))}

            <button type="submit" className="w-full bg-blue-600 text-lg text-white py-2.5 cursor-pointer rounded-md hover:bg-blue-700 transition">
              Kumpulkan
            </button>
            <button type="button" className="w-full bg-gray-600 text-white text-lg py-2.5 cursor-pointer rounded-md hover:bg-gray-700 transition">
              Nilai
            </button>
          </form>
        </div>

        <div className="w-full mt-10 md:w-72 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Course Deadline</h4>
            <p className="text-sm flex gap-1 text-gray-400 font-medium">
              <GiBackwardTime className="text-xl" />
              {new Date(task.dueDate).toLocaleString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-sm mt-8 text-gray-400 font-medium">Status: {task.status === "Completed" ? "Selesai" : "Belum Selesai"}</p>
          </div>

          <div className="bg-white mt-6 p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Course</h4>
            <ul className="list-disc mt-3 list-inside text-sm text-gray-700 space-y-1">
              <li>Soal Pilihan Ganda</li>
              <li>Soal Essai</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PretestPage;
