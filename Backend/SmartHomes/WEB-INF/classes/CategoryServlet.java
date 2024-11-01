import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/CategoryServlet")
public class CategoryServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	   response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        try {
            List<Map<String, Object>> categories = MySQLDataStoreUtilities.getProductCategories();
            
            StringBuilder jsonCategories = new StringBuilder();
            jsonCategories.append("[");
            
            for (int i = 0; i < categories.size(); i++) {
                Map<String, Object> category = categories.get(i);
                int categoryId = (int) category.get("categoryId");
                String categoryName = (String) category.get("categoryName");
                
                jsonCategories.append("{")
                    .append("\"categoryId\":").append(categoryId).append(",")
                    .append("\"categoryName\":\"").append(categoryName).append("\"")
                    .append("}");
                
                if (i < categories.size() - 1) {
                    jsonCategories.append(",");
                }
            }
            
            jsonCategories.append("]");
            
            out.print(jsonCategories.toString());
            out.flush();
            
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"error\":\"Unable to fetch categories.\"}");
        }
    }

protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

}