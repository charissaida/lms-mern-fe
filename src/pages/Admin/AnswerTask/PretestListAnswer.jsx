import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import axiosInstance from "../../../utils/axiosInstance";

const PretestListAnswer = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);

  const getUserAnswers = async () => {
    try {
      const res = await axiosInstance.get(`/api/tasks/${taskId}/user-answers`);
      setAnswers(res.data || []);
    } catch (error) {
      console.error("Gagal mengambil data jawaban:", error);
    }
  };

  useEffect(() => {
    getUserAnswers();
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Manage Courses">
      <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Jawaban Siswa</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3">Email</th>
                <th className="p-3">Nilai</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {answers.length === 0 ? (
                <tr>
                  <td className="p-4 text-center" colSpan="4">
                    Belum ada yang menjawab.
                  </td>
                </tr>
              ) : (
                answers.map((answer) => (
                  <tr key={answer.userId} className="border-t">
                    <td className="p-3">{answer.name}</td>
                    <td className="p-3">{answer.email}</td>
                    <td className="p-3">{answer.score ?? "-"}</td>
                    <td className="p-3">
                      <button onClick={() => navigate(`/admin/tasks/${taskId}/answers/${answer.userId}`)} className="text-blue-600 hover:underline">
                        Lihat & Nilai
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PretestListAnswer;
