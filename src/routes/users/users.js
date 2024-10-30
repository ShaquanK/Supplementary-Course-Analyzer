import axios from "axios";

class UserAPI {
  // Base URL for your Express API
  baseUrl = "http://localhost:5000"; // Change to your deployed server URL if needed

  /**
   * Retrieves all users via the Express API
   *
   * @returns Array
   */
  getUsers = async () => {
    try {
      const response = await axios.get(`${this.baseUrl}/list-users`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  /**
   * Retrieves a specific user via user ID from the Express API
   *
   * @param String userId - The id of the user
   *
   * @returns Object
   */
  getUser = async (userId) => {
    try {
      const response = await axios.get(`${this.baseUrl}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  /**
   * Creates or updates a user via the Express API
   *
   * @param Object userData - The user data to be saved
   *
   */
  setUser = async (userData) => {
    try {
      const response = await axios.post(`${this.baseUrl}/createUser`, userData);
      return response.data; // This could return the created user's ID
    } catch (error) {
      console.error("Error creating/updating user:", error);
    }
  };

  /**
   * Deletes a user via the Express API
   *
   * @param String userId - The id of the user to be deleted
   *
   */
  deleteUser = async (userId) => {
    try {
      await axios.delete(`${this.baseUrl}/delete-user/${userId}`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
}

export const userAPI = new UserAPI();
