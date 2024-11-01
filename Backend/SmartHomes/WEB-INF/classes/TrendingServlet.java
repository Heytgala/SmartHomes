import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;

@WebServlet("/TrendingProducts")
public class TrendingServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        String action = request.getParameter("action");
        if ("zipcodes".equals(action)) {
            fetchTopZipCodes(response);
        } else if ("liked".equals(action)) {
            fetchTopLikedProducts(response);
        } else if ("soldproducts".equals(action)) {
            fetchSoldProducts(response);
        } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid action");
        }
    }

private void fetchTopZipCodes(HttpServletResponse response) throws IOException {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setContentType("application/json");
    PrintWriter out = response.getWriter();
    
    try {
        List<Map<String, Object>> zipCodes = MySQLDataStoreUtilities.getTopZipCodes();
        StringBuilder jsonResponse = new StringBuilder();
        jsonResponse.append("[");
        
        for (int i = 0; i < zipCodes.size(); i++) {
            Map<String, Object> zipCode = zipCodes.get(i);
            jsonResponse.append("{")
                        .append("\"zipcode\":\"").append(zipCode.get("zipcode")).append("\",")
                        .append("\"productCount\":").append(zipCode.get("productCount"))
                        .append("}");

            if (i < zipCodes.size() - 1) {
                jsonResponse.append(",");
            }
        }

        jsonResponse.append("]");
        out.print(jsonResponse.toString());
        out.flush();
    } catch (Exception e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.write("{\"error\":\"Unable to fetch top zip codes.\"}");
    }
}

    private void fetchTopLikedProducts(HttpServletResponse response) throws IOException {
    	response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    	response.setContentType("application/json");
    PrintWriter out = response.getWriter();
    
    try {
        List<Map<String, Object>> likedProducts = MongoDBDataStoreUtilities.getLikedProducts();
        String jsonResponse = com.mongodb.util.JSON.serialize(likedProducts);
        out.print(jsonResponse);
        out.flush();
    } catch (Exception e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.write("{\"error\":\"Unable to fetch liked products.\"}");
    }
}
    


private void fetchSoldProducts(HttpServletResponse response) throws IOException {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setContentType("application/json");
    PrintWriter out = response.getWriter();
    
    try {
        List<Map<String, Object>> soldProducts = MySQLDataStoreUtilities.getTopSoldProducts(); // Implement this method

        StringBuilder jsonResponse = new StringBuilder();
        jsonResponse.append("[");
        
        for (int i = 0; i < soldProducts.size(); i++) {
            Map<String, Object> product = soldProducts.get(i);
            jsonResponse.append("{")
                        .append("\"productName\":\"").append(product.get("ProductName")).append("\",")
                        .append("\"description\":\"").append(product.get("Description")).append("\",")
                        .append("\"productCount\":").append(product.get("productCount"))
                        .append("}");

            if (i < soldProducts.size() - 1) {
                jsonResponse.append(",");
            }
        }

        jsonResponse.append("]");
        out.print(jsonResponse.toString());
        out.flush();
    } catch (Exception e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.write("{\"error\":\"Unable to fetch sold products.\"}");
    }
}    


    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
