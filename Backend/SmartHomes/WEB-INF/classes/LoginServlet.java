import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    private MySQLDataStoreUtilities mysqlUtilities = new MySQLDataStoreUtilities();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    String name = request.getParameter("name");
    String email = request.getParameter("email");
    String password = request.getParameter("password");
    String roleParam = request.getParameter("role");

    int roleId = getRoleId(roleParam);
    if (roleId == -1) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"status\": \"error\", \"message\": \"Invalid role\"}");
        return;
    }

    if (mysqlUtilities.isUserExists(email)) {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"status\": \"error\", \"message\": \"User already exists\"}");
        return;
    }

    boolean isRegistered = mysqlUtilities.registerUser(name, email, password, roleId);
    if (isRegistered) {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"status\": \"success\",\"userName\": \"" + name + "\"}");
    } else {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"status\": \"error\", \"message\": \"Registration failed\"}");
    }
}
@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    String email = request.getParameter("email");
    String password = request.getParameter("password");
    String roleParam = request.getParameter("role");

    int roleId = getRoleId(roleParam);
    if (roleId == -1) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"status\": \"error\", \"message\": \"Invalid role\"}");
        return;
    }

    try {
        String userName = mysqlUtilities.loginUser(email, password, roleId);
        if (userName != null) {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"status\": \"success\", \"role\": \"" + roleParam + "\", \"userName\": \"" + userName + "\" }");
        } else {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"status\": \"error\", \"message\": \"Invalid credentials. Please register.\"}");
        }
    } catch (Exception e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"status\": \"error\", \"message\": \"An error occurred\"}");
    }
}

private int getRoleId(String role) {
    switch (role) {
        case "Customer":
            return 1; 
        case "StoreManager":
            return 2; 
        case "Salesman":
            return 3; 
        default:
            return -1; 
    }
}

}