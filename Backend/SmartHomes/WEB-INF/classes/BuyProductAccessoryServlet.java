import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet("/buyProductAccessory")
public class BuyProductAccessoryServlet extends HttpServlet {

private MySQLDataStoreUtilities dbUtilities = new MySQLDataStoreUtilities();

@Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        response.setContentType("application/json");
        request.setCharacterEncoding("UTF-8");

        BufferedReader reader = request.getReader();
        StringBuilder stringBuilder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            stringBuilder.append(line);
        }

        String requestBody = stringBuilder.toString();
        JSONObject productData = new JSONObject(requestBody);
	int productId=productData.getInt("productID");        
        String price = String.valueOf(productData.getDouble("price"));
        String username = productData.getString("userName");
	String categoryName=productData.getString("categoryName");
	int accessoryid=productData.getInt("accessory_id");
	String accessoryname=productData.getString("accessory_name");
	String imagePath=productData.getString("imagePath");
       int categoryId=dbUtilities.getCategoryID(categoryName);
	int userId=dbUtilities.getUserId(username);
	String order_status="In-Cart";
	String orderId="";
	orderId=dbUtilities.getOrderID(username,"In-Cart");
	System.out.println(orderId);
	if(orderId == "-1"){
		int randomNum = new Random().nextInt(10000); 
		orderId = "ORDER-" + randomNum;
	}
	System.out.println(orderId);
        boolean isAdded = dbUtilities.addProductAccessoryToCart(orderId,userId, username, productId, categoryId, categoryName, price, imagePath,accessoryid,accessoryname, order_status);
    if (isAdded) {
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write("{\"message\":\"Product purchase successful\"}");
    } else {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().write("{\"message\":\"Failed to add product to cart\"}");
    }
        
    }



    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setStatus(HttpServletResponse.SC_OK);
    }


}