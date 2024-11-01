import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.Map;

@WebServlet("/customers")
public class CustomerServlet extends HttpServlet {


    @Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setHeader("Access-Control-Allow-Origin", "*"); 
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");

        PrintWriter out = response.getWriter();

        try {
            List<Map<String, Object>> customerList = MySQLDataStoreUtilities.getAllUsers();
            
            JSONArray responseArray = new JSONArray();
            
            for (Map<String, Object> customer : customerList) {
                JSONObject jsonCustomer = new JSONObject();
                jsonCustomer.put("user_id", customer.get("user_id"));
                jsonCustomer.put("name", customer.get("name"));
                jsonCustomer.put("emailid", customer.get("emailid"));
                
                responseArray.put(jsonCustomer);
            }

            out.print(responseArray.toString());
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred while processing the request.");
        } finally {
            out.close();
        }
    }
}