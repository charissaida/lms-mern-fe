import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import axiosInstance from "../../../utils/axiosInstance";

const PretestAnswerDetail = () => {
  const { taskId, userId } = useParams();
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const res = await axiosInstance.get(`/api/tasks/${taskId}/answers/${userId}`);
        setUserAnswer(res.data);
        setScore(res.data.score || 0);
      } catch (err) {
        toast.error("Gagal memuat jawaban siswa");
      }
    };
    fetchAnswer();
  }, [taskId, userId]);

  const handleScoreSubmit = async () => {
    try {
      setIsSubmitting(true);
      await axiosInstance.post(`/api/tasks/${taskId}/score/${userId}`, { score });
      toast.success("Nilai berhasil disimpan");
    } catch (err) {
      toast.error("Gagal menyimpan nilai");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <DashboardLayout activeMenu="Manage Courses">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Penilaian Jawaban: {userAnswer.user.name}</h2>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Nilai:</label>
          <input type="number" value={score} onChange={(e) => setScore(e.target.value)} className="border rounded px-3 py-2 w-32" min={0} max={100} />
          <button onClick={handleScoreSubmit} disabled={isSubmitting} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Simpan Nilai
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Jawaban Siswa</h3>
          {userAnswer.answers.map((ans, index) => (
            <div key={index} className="mb-4">
              <p className="font-medium">
                {index + 1}. {ans.question}
              </p>
              <p className="text-sm text-gray-600 mt-1">Jawaban: {ans.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PretestAnswerDetail;
