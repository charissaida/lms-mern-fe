import React, { useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import axiosInstance from "../../../utils/axiosInstance";
import { UserContext } from "../../../context/userContext";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { HiChevronLeft } from "react-icons/hi";
import { API_PATHS } from "../../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const EPortfolioPage = () => {
  const { user } = useContext(UserContext);
  const userId = user?._id;
  const [data, setData] = useState(null);
  const [averageScore, setAverageScore] = useState(null);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const taskId = location.state?.taskId;
  const ePortfolioId = localStorage.getItem("ePortfolioId");

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get(`/api/tasks/full-submissions/${userId}`);
      setData(res.data);

      const scores = [...(res.data.taskSubmissions || []), ...(res.data.mindmapSubmissions || [])].map((item) => item.score).filter((s) => typeof s === "number");

      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      setAverageScore(avg.toFixed(2));
    } catch (err) {
      console.error("Gagal mengambil data e-portofolio:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `E-Portfolio - ${user?.name || "Siswa"}`,
    removeAfterPrint: true,
    onBeforeGetContent: () =>
      new Promise((resolve) => {
        setTimeout(resolve, 500);
      }),
  });

  const handleDownload = async () => {
    if (!userId) return;
    setLoadingDownload(true);
    toast.loading("Mempersiapkan file unduhan...", { id: "download-toast" });

    try {
      const response = await axiosInstance.get(`/api/tasks/eportfolio/${userId}/download`, {
        responseType: "blob",
      });

      // Membuat URL sementara dari data file (blob) yang diterima
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Membuat elemen link virtual untuk memicu unduhan
      const link = document.createElement("a");
      link.href = url;
      // Menentukan nama file saat diunduh
      link.setAttribute("download", `E-Portfolio - ${user.name || userId}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Membersihkan setelah selesai
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Unduhan dimulai!", { id: "download-toast" });
    } catch (error) {
      console.error("Gagal mengunduh e-portfolio:", error);
      toast.error("Gagal mengunduh file.", { id: "download-toast" });
    } finally {
      setLoadingDownload(false);
    }
  };

  if (!data || !user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <DashboardLayout activeMenu="Courses">
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="">
          <button onClick={() => window.history.back()} className="flex items-center mb-4 text-blue-600 hover:underline cursor-pointer">
            <HiChevronLeft className="mr-1" /> Kembali
          </button>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold">E-Portfolio</h2>
            <p className="text-gray-600">Rangkuman Pembelajaran</p>
            <div className="mt-11 h-2 bg-blue-500 rounded-full"></div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <button onClick={handleDownload} disabled={loadingDownload} className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded inline-block disabled:bg-gray-400">
              {loadingDownload ? "Memproses..." : "Download E-Portfolio (PDF)"}
            </button>

            <div className="bg-white text-black w-full">
              {/* Cover */}
              <div className="h-[100vh] flex flex-col items-center justify-center bg-teal-800 text-white">
                <h1 className="text-5xl font-bold">E-Portfolio</h1>
                <p className="text-2xl mt-2">Fisiologi Tumbuhan: Hubungan Air dan Tumbuhan</p>
                {user.profileImageUrl && <img src={user.profileImageUrl} alt="Profile" className="w-32 h-40 object-cover mt-6 rounded" />}
                <p className="mt-4 text-2xl font-semibold">{user.name}</p>
                <p className="text-lg">{user.nim}</p>
                <p className="text-lg">{user.offering}</p>
              </div>

              {/* Nilai */}
              <div className="p-10">
                <h2 className="text-2xl font-bold mb-4">Rekapitulasi Nilai</h2>
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">No</th>
                      <th className="border p-2 text-left">Judul Tugas</th>
                      <th className="border p-2 text-center">Skor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...(data.taskSubmissions || []), ...(data.mindmapSubmissions || [])]
                      .filter((item) => item.score !== undefined)
                      .map((item, idx) => (
                        <tr key={idx}>
                          <td className="border p-2 text-center">{idx + 1}</td>
                          <td className="border p-2 capitalize">{item.task?.title || item.type || "Tugas"}</td>
                          <td className="border p-2 text-center">{item.score}</td>
                        </tr>
                      ))}
                    <tr className="font-bold bg-gray-100">
                      <td colSpan={2} className="border p-2 text-center">
                        Rata-rata
                      </td>
                      <td className="border p-2 text-center">{averageScore}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Jawaban */}
              <div className="p-10">
                <h2 className="text-2xl font-bold mb-6">Detail Jawaban</h2>

                {(data.taskSubmissions || []).map((submission, idx) => (
                  <div key={idx} className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">
                      {idx + 1}. {submission.task?.title || `Tugas ${idx + 1}`}
                    </h3>

                    {(submission.task?.essayQuestions || []).map((q, i) => {
                      const answer = submission.essayAnswers?.find((ea) => ea.questionId === q._id);
                      return (
                        <div key={i} className="mb-2">
                          <p className="font-medium">Essay {i + 1}:</p>
                          <p className="italic mb-1">{q.question}</p>
                          <p className="ml-4">Jawaban: {answer?.answer || "Belum dijawab"}</p>
                        </div>
                      );
                    })}

                    {(submission.task?.multipleChoiceQuestions || []).map((q, i) => {
                      const answer = submission.multipleChoiceAnswers?.find((mc) => mc.questionId === q._id);
                      return (
                        <div key={i} className="mb-2">
                          <p className="font-medium">Pilihan Ganda {i + 1}:</p>
                          <p className="italic mb-1">{q.question}</p>
                          <p className="ml-4">Jawaban: {answer?.selectedOption || "Belum dijawab"}</p>
                        </div>
                      );
                    })}

                    {(submission.task?.problem || [])
                      .filter((p) => submission.problemAnswer?.some((pa) => pa.questionId.toString() === p._id.toString()))
                      .map((p) => {
                        const answer = submission.problemAnswer.find((pa) => pa.questionId.toString() === p._id.toString());

                        const originalIndex = (submission.task?.problem || []).findIndex((originalProblem) => originalProblem._id.toString() === p._id.toString());

                        return (
                          <div key={p._id} className="mb-4">
                            <p className="font-medium">Problem Kelompok {originalIndex + 1}:</p>
                            <div className="pl-4 mt-1 border-l-2 border-gray-200">
                              <p className="italic mb-1">{p.problem || "(Soal belum tersedia)"}</p>
                              <p>
                                <strong>Jawaban:</strong> {answer?.problem || "Belum dijawab"}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                    {submission.feedbackFile && (
                      <div className="mt-4">
                        <p className="font-medium mb-2">File Feedback:</p>

                        {/* SEMBUNYIKAN BAGIAN INI SAAT PRINT */}
                        <div className="print:hidden">
                          <iframe src={submission.feedbackFile} width="100%" height="600px" className="rounded border" title={`Feedback PDF ${idx}`} />
                        </div>

                        {/* TAMPILKAN PESAN INI SAAT PRINT */}
                        <div className="hidden print:block text-gray-500 text-sm border p-2 mt-2">[Konten file PDF tidak disertakan dalam hasil cetak]</div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Mindmap */}
                {(data.mindmapSubmissions || []).map((mindmap, idx) => (
                  <div key={idx} className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 capitalize">{mindmap.type || `Mindmap ${idx + 1}`}</h3>
                    <p className="mb-2 font-medium">Instruksi:</p>
                    <p className="mb-4">{mindmap.instructions}</p>

                    <p className="mb-2 font-medium">Rubrik Mindmap:</p>
                    {mindmap.rubric?.map((rubricItem, rIdx) => (
                      <div key={rIdx} className="mb-4">
                        <p className="mb-1">{rubricItem.text}</p>
                        <div className="print:hidden">
                          <iframe src={rubricItem.file} width="100%" height="600px" className="rounded border" title={`Rubrik PDF ${rIdx}`} />
                        </div>
                        <div className="hidden print:block text-gray-500 text-sm border p-2 mt-2">[Konten file PDF tidak disertakan dalam hasil cetak]</div>
                      </div>
                    ))}

                    <p className="mb-2 font-medium">Jawaban PDF:</p>
                    {mindmap.answerPdf && (
                      <>
                        <div className="print:hidden">
                          <iframe src={mindmap.answerPdf} width="100%" height="600px" className="rounded border" title={`Mindmap PDF ${idx}`} />
                        </div>
                        <div className="hidden print:block text-gray-500 text-sm border p-2 mt-2">[Konten file PDF tidak disertakan dalam hasil cetak]</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/survey", {
                  state: {
                    taskTitle: "E-Portfolio",
                    taskId: ePortfolioId,
                  },
                })
              }
              className="bg-blue-600 w-full cursor-pointer text-white px-6 py-2 rounded-md mt-4 hover:bg-blue-700"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EPortfolioPage;
