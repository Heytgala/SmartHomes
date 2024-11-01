import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/getAccessories")
public class AccessoryServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	   response.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from your React app
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        String productId = request.getParameter("productID");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        try {
            int productID = Integer.parseInt(productId);
            List<Map<String, Object>> accessoriesList = MySQLDataStoreUtilities.getAccessoriesByProductID(productID);

            JSONArray jsonArray = new JSONArray();
            for (Map<String, Object> accessory : accessoriesList) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("accessory_id", accessory.get("accessory_id"));
                jsonObject.put("accessory_name", accessory.get("accessory_name"));
                jsonObject.put("accessory_price", accessory.get("accessory_price"));
                jsonObject.put("accessoryPath", accessory.get("accessoryPath"));

                jsonArray.put(jsonObject);
            }

            out.print(jsonArray.toString());
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"Failed to retrieve accessories\"}");
        }
    }
}
