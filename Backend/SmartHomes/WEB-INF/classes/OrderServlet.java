import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import org.json.JSONArray;
import org.json.JSONObject;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.io.BufferedReader;

@WebServlet({"/getOrder", "/updateOrder"})
public class OrderServlet extends HttpServlet {

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

        String userName = request.getParameter("userName");

        MySQLDataStoreUtilities dbUtils = new MySQLDataStoreUtilities();
        int userId = -1;
        List<List<String>> orderList;

        try {
            userId = dbUtils.getUserId(userName);
            if (userId == -1) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("User not found.");
                return;
            }

            orderList = dbUtils.getOrderCheckoutListByUser(userId);

            response.setContentType("application/json");
            PrintWriter out = response.getWriter();

            StringBuilder jsonResponse = new StringBuilder();
            jsonResponse.append("[");
            for (int i = 0; i < orderList.size(); i++) {
                List<String> orderDetails = orderList.get(i);
                jsonResponse.append("{");
                jsonResponse.append("\"purchaseDate\":\"").append(orderDetails.get(0)).append("\",");
                jsonResponse.append("\"shipDate\":\"").append(orderDetails.get(1)).append("\",");
                jsonResponse.append("\"DeliveryMethod\":\"").append(orderDetails.get(2)).append("\",");
                jsonResponse.append("\"Store_id\":").append(orderDetails.get(3)).append(",");
                jsonResponse.append("\"Store_address\":\"").append(orderDetails.get(4)).append("\",");
                jsonResponse.append("\"Order_status\":\"").append(orderDetails.get(5)).append("\",");
                jsonResponse.append("\"OrderID\":\"").append(orderDetails.get(6)).append("\",");
			jsonResponse.append("\"Confirmation_number\":\"").append(orderDetails.get(7)).append("\"");
                jsonResponse.append("}");
                if (i < orderList.size() - 1) {
                    jsonResponse.append(",");
                }
            }
            jsonResponse.append("]");

            out.print(jsonResponse.toString());
            out.flush();

        }  catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("An unexpected error occurred: " + e.getMessage());
        }
    }


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

	   MySQLDataStoreUtilities dbUtility=new MySQLDataStoreUtilities();
        
	   try {
        StringBuilder stringBuilder = new StringBuilder();
            String line;
            try (BufferedReader reader = request.getReader()) {
                while ((line = reader.readLine()) != null) {
                    stringBuilder.append(line);
                }
            }
            String requestBody = stringBuilder.toString();

            JSONObject jsonObject = new JSONObject(requestBody);
		  String OrderID = jsonObject.getString("orderNumber");
        String newStatus = jsonObject.getString("newStatus");
        String userName = jsonObject.getString("userName");
	   dbUtility.ordercheckoutstatus(OrderID,newStatus);	
	   dbUtility.ordercartstatus(OrderID,newStatus);
	   response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("Order updated successfully.");
		 } catch (Exception e) {
            
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JSONObject errorJson = new JSONObject();
            errorJson.put("error", "An error occurred while processing the request.");
            errorJson.put("details", e.getMessage());
            response.getWriter().write(errorJson.toString());
            
        }


     }
}