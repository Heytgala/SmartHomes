import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;

@WebServlet("/submitReview")
public class ProductReviewServlet extends HttpServlet {

@Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        JSONObject reviewData = new JSONObject(sb.toString());
	MongoDBDataStoreUtilities MongoDBDataUtilities= new MongoDBDataStoreUtilities();

MySQLDataStoreUtilities dbutilities = new MySQLDataStoreUtilities();

        int categoryid = Integer.parseInt(reviewData.getString("categoryName"));
	   String categoryName= dbutilities.getCategoryName(categoryid);
        String productName = reviewData.getString("productName");

String productDetailsJson = dbutilities.getProductDetails(productName);

        JSONObject jsonResponse = new JSONObject(productDetailsJson);
        String productprice = Double.toString(jsonResponse.getDouble("price"));
	   String discount = Double.toString(jsonResponse.getDouble("discount"));
String productonsale="Yes";
String manufacturerebate="Yes";
if(discount.equals("")||discount.equals(null)||discount.equals("0")){
	productonsale="No";
	manufacturerebate="No";
}
String manufacturerName = jsonResponse.getString("manufacturerName");

        int storeId = Integer.parseInt(reviewData.getString("storeAddress"));
	  String address= dbutilities.getStoreAddress(storeId);
	  String[] addressParts = address.split(",");
	  String Street= addressParts[0];
       String City= addressParts[1];
        String State= addressParts[2];
       String Zipcode= addressParts[3];
        String age = reviewData.getString("age");
        String gender = reviewData.getString("gender");
        String occupation = reviewData.getString("occupation");
        String reviewRating = reviewData.getString("reviewRating");
        String reviewComments = reviewData.getString("reviewComments");
        String userName = reviewData.getString("userName");
	   int user_id=dbutilities.getUserId(userName);


MongoDBDataUtilities.insertReview(categoryName,productName,productprice,storeId,Street,City,State,Zipcode,manufacturerName,age,gender,occupation,reviewRating,reviewComments,user_id,productonsale,manufacturerebate);

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write("{\"message\":\"Review submitted successfully\"}");
    }

    @Override
    public void destroy() {
        MongoDBDataStoreUtilities.closeConnection();
    }
}
