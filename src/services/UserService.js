import axios from "axios";

const BASE_URL = "http://localhost:8081/ijaa";

class UserService {
  getAllUser() {
    const token = localStorage.getItem("token"); // Retrieve the JWT from localStorage
    return axios.get(BASE_URL + "/users", {
      headers: {
        Authorization: `Bearer ${token}`, // Include the JWT in the Authorization header
      },
    });
  }

  saveUser(UserData) {
    const token = localStorage.getItem("token");
    return axios.post(BASE_URL, UserData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new UserService();
