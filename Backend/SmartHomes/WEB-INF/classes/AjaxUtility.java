import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.DriverManager;

@WebServlet("/AjaxUtility")
public class AjaxUtility extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String DB_URL = "jdbc:mysql://localhost:3306/SmartHomes";
    private static final String USER = "root"; // replace with your MySQL username
    private static final String PASSWORD = "root"; // replace with your MySQL password

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }    

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
	response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        String searchTerm = request.getParameter("searchTerm");
	ArrayList<HashMap<String, Object>> productList = new ArrayList<>();
        
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);) {
            String query = "SELECT CategoryID,ProductName FROM products WHERE ProductName LIKE ?";
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setString(1, "%" + searchTerm + "%");
                ResultSet rs = stmt.executeQuery();

                while (rs.next()) {
		    HashMap<String, Object> productMap = new HashMap<>();
                    productMap.put("ProductName", rs.getString("ProductName"));
                    productMap.put("CategoryID", rs.getInt("CategoryID"));
                    productList.add(productMap);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Convert productMap values to a JSON-like format (manually or with a library)
        StringBuilder json = new StringBuilder("[");
        for (HashMap<String, Object> product : productList) {
            json.append("{");
            json.append("\"productName\":\"").append(product.get("ProductName")).append("\",");
            json.append("\"categoryID\":").append(product.get("CategoryID"));
            json.append("},");
        }
        if (json.length() > 1) {
            json.setLength(json.length() - 1); // Remove last comma
        }
        json.append("]");

        response.setContentType("application/json");
        response.getWriter().write(json.toString());
    }
}
