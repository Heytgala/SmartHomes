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

@WebServlet("/buyProduct")
public class BuyProductServlet extends HttpServlet {

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
String productName = productData.getString("productName");
        String price = productData.getString("price");
        String description = productData.getString("description");
        String username = productData.getString("userName");
	   String categoryName=productData.getString("categoryName");
String imagePath=productData.getString("imagePath");
        String specialDiscount = "";
        if (productData.has("discounts")) {
            specialDiscount = productData.getString("discounts");
        }
	  String Rebates=productData.getString("Rebates");
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
        boolean isAdded = dbUtilities.addProductToCart(orderId,userId, username, productId,productName, categoryId, categoryName, price, imagePath,specialDiscount, description, order_status,Rebates);

    if (isAdded) {
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write("{\"message\":\"Product purchase successful\"}");
    } else {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().write("{\"message\":\"Failed to add product to cart\"}");
    }
        
    }

@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // Handle CORS headers for GET requests
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    
    response.setContentType("application/json");
    request.setCharacterEncoding("UTF-8");
    
    PrintWriter out = response.getWriter();

    String username = request.getParameter("userName");

    if (username == null || username.isEmpty()) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        out.write("{\"message\":\"Username is required\"}");
        return;
    }

    try (ResultSet rs = MySQLDataStoreUtilities.getOrderCartByUsername(username)) {
        StringBuilder jsonResponse = new StringBuilder();
        jsonResponse.append("[");
        boolean first = true;

        while (rs.next()) {
            if (!first) {
                jsonResponse.append(",");
            }
            first = false;

            jsonResponse.append("{")
                .append("\"OrderID\":\"").append(rs.getString("OrderID")).append("\",") 
                .append("\"user_id\":").append(rs.getInt("user_id")).append(",")
                .append("\"name\":\"").append(rs.getString("name")).append("\",")
                .append("\"ProductID\":").append(rs.getInt("ProductID")).append(",")
                .append("\"ProductName\":\"").append(rs.getString("ProductName")).append("\",")
			.append("\"Rebates\":\"").append(rs.getString("Rebates")).append("\",")
                .append("\"CategoryID\":").append(rs.getInt("CategoryID")).append(",")
                .append("\"CategoryName\":\"").append(rs.getString("CategoryName")).append("\",")
                .append("\"Price\":\"").append(rs.getString("Price")).append("\",")
                .append("\"ImagePath\":\"").append(rs.getString("ImagePath")).append("\",")
                .append("\"Discounts\":\"").append(rs.getString("Discounts") != null ? rs.getString("Discounts") : "").append("\",")
			.append("\"accessoryid\":\"").append(rs.getInt("accessory_id")).append("\",")
                .append("\"accessoryname\":\"").append(rs.getString("accessory_name") != null ? rs.getString("accessory_name") : "").append("\",")
                .append("\"Description\":\"").append(rs.getString("Description")).append("\"")
                .append("}");
        }

        jsonResponse.append("]");
        out.print(jsonResponse.toString()); 
    } catch (SQLException e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // Set error status
    } finally {
        out.close();
    }
}

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        response.setContentType("application/json");
        request.setCharacterEncoding("UTF-8");

        String productName = request.getParameter("productName");
	   String accessoryName=request.getParameter("accessoryname");
        String username = request.getParameter("userName");
	   System.out.println(username);
        if (username == null || username.isEmpty() || productName == null || productName.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"message\":\"Username and product name are required\"}");
            return;
        }
MySQLDataStoreUtilities dbUtilities = new MySQLDataStoreUtilities();

    if (!dbUtilities.cartExists(username)) {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        response.getWriter().write("{\"message\":\"Cart not found\"}");
        return;
    }

    boolean productDeleted = false;
if(productName!=null && productName!=""){
System.out.println(productName);
productDeleted= dbUtilities.deleteProductFromCart(username, productName);
}

if(accessoryName!= null && accessoryName!=""){
System.out.println("Loop name"+accessoryName);
productDeleted= dbUtilities.deleteProductAccessoryFromCart(username, accessoryName);
}

    if (!productDeleted) {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        response.getWriter().write("{\"message\":\"Product not found in cart\"}");
    } else {
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write("{\"message\":\"Product removed successfully\"}");
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