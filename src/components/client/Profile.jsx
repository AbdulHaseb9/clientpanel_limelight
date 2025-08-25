import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const Profile = () => {
  const [employees, setEmployees] = useState([]);
  const [showChange, setShowChange] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(""); // Store selected employee ID
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    assignTo: "",
  });

  const fetchUserInfo = () => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/user/getuser/info`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((resp) => {
        setUserInfo(resp.data.user);
        setEmployees(resp.data.employees);
      })
      .catch((error) => {
        toast.error("Error fetching user info");
      });
  };
  
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleAssignTo = () => {
    if (!selectedEmployee) {
      alert("Please select an employee to assign the task.");
      return;
    }
    axios
      .patch(
        `${import.meta.env.VITE_API_BASE_URL}/user/update/assign-project`,
        { assignTo: selectedEmployee }, // Send the selected employee ID
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setShowChange(false);
        fetchUserInfo();
      })
      .catch((error) => {
        toast.error("Error assigning project");
      });
  };

  return (
    <section className="h-full flex justify-center items-center">
      <div>
        <h1 className="text-3xl tracking-wider text-center">Profile</h1>
        <div className="space-y-4 mt-4 text-center">
          {/* Display user's profile information */}
          <p className="text-lg">
            <span className="font-semibold text-xl mr-3">Username:</span>
            {userInfo.username}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-xl mr-3">Email:</span>
            {userInfo.email}
          </p>

          {/* Assignment dropdown */}
          <div className="flex flex-col gap-y-4">
            <label htmlFor="assignTo" className="font-semibold">
              Choose Who to assign task
            </label>
            <p>{userInfo.assignTo}</p>
            <button
              className="px-4 py-2 bg-primary rounded-lg text-white"
              onClick={() => setShowChange(!showChange)}
            >
              {showChange ? (
                <span>hide Selected User</span>
              ) : (
                <span>Select User</span>
              )}
            </button>
            {showChange && (
              <div className="flex flex-col gap-y-4">
                <select
                  id="assignTo"
                  className="px-4 py-2 rounded-lg"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)} // Update selected employee state
                >
                  <option value="">Select an employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.username}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignTo}
                  className="px-4 py-2 bg-primary rounded-lg text-white"
                >
                  Update Assign field
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
