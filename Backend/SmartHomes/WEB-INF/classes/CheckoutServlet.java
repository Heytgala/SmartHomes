import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import org.json.JSONObject;
import org.json.JSONArray;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@WebServlet("/checkout")
public class CheckoutServlet extends HttpServlet {


    private static final Logger logger = Logger.getLogger(CheckoutServlet.class.getName());

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
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

            String userName = jsonObject.getString("userName");
            String Customername = jsonObject.getString("name");
            String address = jsonObject.getString("address");
		String city = jsonObject.getString("city");
		String state = jsonObject.getString("state");
		String zip = jsonObject.getString("zip");
		String Customeraddress=address+","+city+","+state+","+zip;	
		
            String creditCardNumber = jsonObject.getString("creditCard");
            String deliverymethod = jsonObject.getString("deliveryMethod");
double total_sales=0;
String HomeShippingcost="";
if(deliverymethod.equals("Home")){
 HomeShippingcost="50";
 total_sales=50;
}
            String storeID = jsonObject.optString("storeLocation", "");
int storeid=0;
String storeaddress="";
if(storeID != null && !storeID.isEmpty()){
storeid=Integer.parseInt(storeID);
 storeaddress=dbUtility.getStoreAddress(storeid);
}
            String confirmationNumber = jsonObject.getString("confirmationNumber");
            String shipDate = jsonObject.getString("deliveryDate");
            String orderStatus = jsonObject.getString("orderstatus");
		 String purchaseDate=jsonObject.getString("OrderDate");
		 int user_id=dbUtility.getUserId(userName);
System.out.println("SUCCESS");

JSONArray cartItems = jsonObject.getJSONArray("cartItems");
for(int j=0;j<cartItems.length();j++){
     JSONObject cart = cartItems.getJSONObject(j);
	double price=Double.parseDouble(cart.getString("Price"));
	String discount=cart.getString("Discounts");
	String Rebates=cart.getString("Rebates");
	double discounts=0;
	double rebates=0;
	if(discount!=""){
	 discounts=Double.parseDouble(discount);
	}
	if (Rebates != null && !Rebates.trim().isEmpty() && !Rebates.equalsIgnoreCase("null")){
	 rebates=Double.parseDouble(Rebates);
	}
	
	total_sales= total_sales + (price-discounts-rebates);
}
JSONObject cartItem = cartItems.getJSONObject(0);
            String orderID = cartItem.getString("OrderID");

		 dbUtility.insertOrder(user_id,Customername,Customeraddress,creditCardNumber,purchaseDate,shipDate,deliverymethod,HomeShippingcost,storeid,storeaddress, confirmationNumber,orderStatus, orderID, total_sales);

dbUtility.ordercartstatus(orderID,orderStatus);

double reportsales=0;
for(int k=0;k<cartItems.length();k++){
	JSONObject cart = cartItems.getJSONObject(k);
	String prodname=cart.optString("ProductName",null);
	if(prodname!=null || !prodname.equals("null")){
	double reportprice=Double.parseDouble(cart.getString("Price"));
	String reportdiscount=cart.getString("Discounts");
	String reportrebates=cart.getString("Rebates");
	double reportdiscounts=0;
	double reportRebate=0;
	if(reportdiscount!=""){
	 reportdiscounts=Double.parseDouble(reportdiscount);
	}
	if (reportrebates!= null && !reportrebates.trim().isEmpty() && !reportrebates.equalsIgnoreCase("null")){
	 reportRebate=Double.parseDouble(reportrebates);
	}

	reportsales = (reportprice-reportdiscounts-reportRebate);
		int originalproductcount=dbUtility.getreportproductcount(prodname);
	int originalproductssold=dbUtility.getreportproductssold(prodname);
	double originaltotalsale=dbUtility.getreporttotalsale(prodname);

	originalproductcount=originalproductcount-1;
	originalproductssold=originalproductssold+1;
	originaltotalsale=originaltotalsale+reportsales;
	dbUtility.productreportupdate(prodname,originalproductcount,originalproductssold,originaltotalsale);
}
}

            JSONObject responseJson = new JSONObject();
            responseJson.put("confirmationNumber", confirmationNumber);
            responseJson.put("estimatedDeliveryDate", shipDate);
            response.setStatus(HttpServletResponse.SC_OK);
            out.print(responseJson.toString());
            out.flush();
        } catch (Exception e) {
            logger.log(Level.SEVERE, "An error occurred while processing the request.", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JSONObject errorJson = new JSONObject();
            errorJson.put("error", "An error occurred while processing the request.");
            errorJson.put("details", e.getMessage());
            out.print(errorJson.toString());
            out.flush();
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