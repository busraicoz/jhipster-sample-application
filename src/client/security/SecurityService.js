/* 
* Generated by
* 
*      _____ _          __  __      _     _
*     / ____| |        / _|/ _|    | |   | |
*    | (___ | | ____ _| |_| |_ ___ | | __| | ___ _ __
*     \___ \| |/ / _` |  _|  _/ _ \| |/ _` |/ _ \ '__|
*     ____) |   < (_| | | | || (_) | | (_| |  __/ |
*    |_____/|_|\_\__,_|_| |_| \___/|_|\__,_|\___|_|
*
* The code generator that works in many programming languages
*
*			https://www.skaffolder.com
*
*
* You can generate the code from the command-line
*       https://npmjs.com/package/skaffolder-cli
*
*       npm install -g skaffodler-cli
*
*   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
*
* To remove this comment please upgrade your plan here: 
*      https://app.skaffolder.com/#!/upgrade
*
* Or get up to 70% discount sharing your unique link:
*       https://app.skaffolder.com/#!/register?friend=5dcc4fd7f1ef4518a5383351
*
* You will get 10% discount for each one of your friends
* 
*/
import axios from "axios";
import { AsyncStorage } from "react-native";

// Global error alert
axios.interceptors.response.use(res => res, function(error) {
  if (
    error.response.status != 401 &&
    error.response.data != "Old password not valid"
  ) {
    try {
      alert(error.response.data.message);
    } catch (err2) {
      alert(error);
    }
  }
  return Promise.reject(error);
});

export default class SecurityService {
  /**
   * Set Authorization header
   */
  static async setAuthorization() {
    const user = await SecurityService.getUser();
    if (user && user.token) {
      axios.defaults.headers.common["authorization"] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common["authorization"];
    }
  }

  /**
   * Logout
   */
  static async logout() {
    // Clear user
    await AsyncStorage.clear();
    // Set header
    await SecurityService.setAuthorization();
  }

  /**
   * Get logged user
   */
  static async getUser() {
    let user = await AsyncStorage.getItem("user");
    try {
      user = JSON.parse(user);
    } catch (e) {
      user = null;
      console.warn("User not valid");
      console.warn(e);
    }

    return user;
  }

  /**
   * Check role user
   */
  static async hasRole(role) {
    const user = await SecurityService.getUser();
    return user && user.roles && user.roles.indexOf(role) !== -1;
  }

  /**
   * Check if role array is auth
   */
  static async isAuth(roles) {
    const user = await SecurityService.getUser();
    "is aut", user;
    if (!user) return false;

    if (!roles || roles.length === 0) return true;
    if (SecurityService.hasRole("ADMIN")) return true;

    for (let i in roles) {
      if (SecurityService.hasRole(roles[i])) return true;
    }
    return false;
  }

  /**
   * Get update user
   */
  static async updateUser(user) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    return user;
  }
}
