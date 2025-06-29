import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const ProblemAnswerDetail = () => {
  const { userId } = useParams();
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [problemScores, setProblemScores] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissionRes = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_BY_ID_USER("problem", userId));
        const submissionData = submissionRes.data.submissions[0];

        if (!submissionData) {
          toast.error("Data jawaban tidak ditemukan");
          return;
        }

        setSubmission(submissionData);

        const taskRes = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(submissionData.task._id));
        const taskData = taskRes.data;
        setTask(taskData);

        // Inisialisasi nilai problem dengan 0
        const initScores = {};
        submissionData.problemAnswer?.forEach((a) => {
          initScores[a.questionId] = 0;
        });
        setProblemScores(initScores);
      } catch (err) {
        toast.error("Gagal memuat data jawaban siswa");
        console.error(err);
      }
    };

    fetchData();
  }, [userId]);

  // Perbarui nilai total jika ada perubahan nilai per-problem
  useEffect(() => {
    const values = Object.values(problemScores);
    if (values.length > 0) {
      const avg = values.reduce((a, b) => a + Number(b || 0), 0) / values.length;
      setScore(Math.round(avg));
    }
  }, [problemScores]);

  const handleProblemScoreChange = (problemId, value) => {
    const updated = {
      ...problemScores,
      [problemId]: isNaN(value) ? 0 : value,
    };
    setProblemScores(updated);
  };

  const handleScoreSubmit = async () => {
    if (!submission?.task?._id) return toast.error("Task ID belum tersedia");

    try {
      setIsSubmitting(true);
      await axiosInstance.post(API_PATHS.TASKS.POST_SUBMISSION_SCORE("problem", submission.task._id, userId), {
        score,
        problemScores,
      });
      toast.success("Nilai berhasil disimpan");
      navigate(`/admin/list-answer/problem/${submission.task._id}`);
    } catch (err) {
      console.log(err);
      toast.error("Gagal menyimpan nilai");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Manage Courses">
      <div className="max-w-4xl mx-auto mt-4 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Penilaian Jawaban Siswa</h2>

        {/* Otomatis Hitung Nilai Total */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Nilai Total :</label>
          <input type="number" value={score} disabled className="border rounded px-3 py-2 w-32 text-gray-600 bg-gray-100" min={0} max={100} />
          <button onClick={handleScoreSubmit} disabled={isSubmitting} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
            Simpan Nilai
          </button>
        </div>

        {task && submission && (
          <>
            <h3 className="text-lg font-semibold mb-2">Jawaban Problem (Kelompok)</h3>
            {submission.problemAnswer?.length === 0 ? (
              <p className="text-sm italic text-gray-500">User belum mengerjakan soal problem.</p>
            ) : (
              submission.problemAnswer.map((ans, index) => {
                const problem = task.problem.find((p) => p._id === ans.questionId);
                const groupIndex = task.problem.findIndex((p) => p._id === ans.questionId);

                return (
                  <div key={ans.questionId} className="mb-2">
                    <p className="font-medium text-lg mb-2">Kelompok {groupIndex + 1}</p>
                    <p className="font-medium text-md mb-2">
                      Soal: <br />
                      {problem?.problem || "Soal tidak ditemukan"}
                    </p>
                    <p className="text-md text-gray-600 mt-1">
                      Jawaban: <br />
                      {ans.problem || "-"}
                    </p>
                    <input
                      type="number"
                      placeholder="Nilai"
                      className="border rounded px-3 py-1 mt-4 w-32"
                      min={0}
                      max={100}
                      value={problemScores[ans.questionId] !== undefined && problemScores[ans.questionId] !== null ? parseInt(problemScores[ans.questionId]) || "" : ""}
                      onChange={(e) => handleProblemScoreChange(ans.questionId, Number(e.target.value))}
                    />
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProblemAnswerDetail;
