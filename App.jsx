import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showLowAttendance, setShowLowAttendance] = useState(false);
  const [sortOrder, setSortOrder] = useState("none");

  const API_URL = "https://jsonplaceholder.typicode.com/users";

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const studentsWithAttendance = data.map((user) => ({
          ...user,
          attendance: Math.floor(Math.random() * 101),
        }));

        setStudents(studentsWithAttendance);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-lg font-medium">
        Loading students...
      </p>
    );
  }

  let filteredStudents = students;

  if (filterType === "present") {
    filteredStudents = filteredStudents.filter(
      (s) => s.attendance >= 75
    );
  } else if (filterType === "absent") {
    filteredStudents = filteredStudents.filter(
      (s) => s.attendance < 75
    );
  }

  if (showLowAttendance) {
    filteredStudents = filteredStudents.filter(
      (s) => s.attendance < 75
    );
  }

  if (sortOrder === "asc") {
    filteredStudents = [...filteredStudents].sort(
      (a, b) => a.attendance - b.attendance
    );
  } else if (sortOrder === "desc") {
    filteredStudents = [...filteredStudents].sort(
      (a, b) => b.attendance - a.attendance
    );
  }

  const totalStudents = filteredStudents.length;
  const lowAttendanceCount = filteredStudents.filter(
    (s) => s.attendance < 75
  ).length;

  if (!loading && filteredStudents.length === 0) {
    return (
      <p className="text-center mt-10 text-lg font-medium">
        No students found
      </p>
    );
  }

  return (
    <div className="main-card">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="app-title">Student Attendance Viewer</h1>

        <div className="text-center mb-6 text-sm text-gray-700 bg-slate-50 rounded-xl py-4 border">
          <p>Total Students: <span className="font-semibold">{totalStudents}</span></p>
          <p>
            Below 75%:{" "}
            <span className="font-semibold text-red-600">
              {lowAttendanceCount}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-6 justify-center mb-8">
          <button
            onClick={() => setFilterType("all")}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${filterType === "all" ? "bg-indigo-500 text-white" : "bg-gray-200"
              }`}
          >
            All
          </button>

          <button
            onClick={() => setFilterType("present")}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${filterType === "present"
              ? "bg-emerald-500 text-white"
              : "bg-gray-200"
              }`}
          >
            Present
          </button>

          <button
            onClick={() => setFilterType("absent")}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${filterType === "absent"
              ? "bg-rose-500 text-white"
              : "bg-gray-200"
              }`}
          >
            Absent
          </button>
        </div>

        <div className="checkbox-container">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLowAttendance}
              onChange={() => setShowLowAttendance((prev) => !prev)}
            />
            Show &lt; 75% Attendance
          </label>
        </div>

        <div className="mb-10"> 
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border px-4 py-2.5 rounded-lg shadow-sm"
          >
            <option value="none">No Sorting</option>
            <option value="asc">Attendance Low → High</option>
            <option value="desc">Attendance High → Low</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Attendance %</th>
                <th className="border p-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
                  className={selectedStudent === student.id ? "selected-row" : ""}
                >
                  <td className="font-semibold text-slate-700">{student.name}</td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{student.attendance}%</span>
                      <div className="progress-container">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${student.attendance}%`,
                            backgroundColor: student.attendance >= 75 ? '#10b981' : '#ef4444'
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${student.attendance >= 75 ? "badge-present" : "badge-absent"}`}>
                      {student.attendance >= 75 ? "● Present" : "● Absent"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

}

export default App;