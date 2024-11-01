import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.Part;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Map;

@WebServlet("/productlist")
@MultipartConfig
public class ProductServlet extends HttpServlet {
    private MySQLDataStoreUtilities dbUtilities = new MySQLDataStoreUtilities();
    private static final String PRODUCT_FILE_PATH = "C:/apache-tomcat-9.0.93/webapps/SmartHomes/database/Productdetails.json";
private static final String IMAGE_UPLOAD_PATH = "C:/apache-tomcat-9.0.93/webapps/SmartHomes/images/";

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
response.setContentType("application/json");
    PrintWriter out = response.getWriter();

String category = request.getParameter("categoryName");

List<Map<String, Object>> products;

if (category != null && !category.isEmpty()) {
            products = MySQLDataStoreUtilities.getProductsByCategory(category);
        } else {
            products = MySQLDataStoreUtilities.getAllProducts();
        }    
    JSONArray jsonProducts = new JSONArray();
    
    for (Map<String, Object> product : products) {
        JSONObject jsonProduct = new JSONObject();
        jsonProduct.put("productID", product.get("productID"));
        jsonProduct.put("productName", product.get("productName"));
	   jsonProduct.put("ManufacturerName", product.get("ManufacturerName"));
        jsonProduct.put("categoryName", product.get("categoryName")); // This will be enclosed in quotes
        jsonProduct.put("description", product.get("description"));
        jsonProduct.put("price", product.get("price"));
        jsonProduct.put("imagePath", product.get("imagePath"));
        jsonProduct.put("discounts", product.get("discounts"));
	   jsonProduct.put("Rebates", product.get("Rebates"));
        jsonProducts.put(jsonProduct);
    }
    
    out.print(jsonProducts.toString());
    out.flush();

            }

@Override
protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    response.setContentType("application/json");
    PrintWriter out = response.getWriter();
    try {
        BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream()));
        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        String jsonData = sb.toString();
        JSONObject jsonRequest = new JSONObject(jsonData);

        int productID = jsonRequest.getInt("productID");
        String productName = jsonRequest.getString("productName");
	  String ManufacturerName= jsonRequest.getString("ManufacturerName");
        String description = jsonRequest.getString("description");
	   String imagePath=jsonRequest.getString("image");
        double price = jsonRequest.getDouble("price");
        String specialDiscounts = jsonRequest.getString("specialDiscounts");
	   String Rebates=jsonRequest.getString("Rebates");

        MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();
        boolean isUpdated = (dataStore.updateProduct(productID, productName,ManufacturerName, description,imagePath, price, specialDiscounts,Rebates)&&dataStore.updateProductReport(productName,price,specialDiscounts,Rebates));

        if (isUpdated) {
            response.setStatus(HttpServletResponse.SC_OK);
            out.print("{\"status\":\"success\"}");
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"status\":\"failure\", \"message\":\"Unable to update product.\"}");
        }
    } catch (JSONException e) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        out.print("{\"status\":\"failure\", \"message\":\"Invalid JSON input.\"}");
        e.printStackTrace();
    } catch (Exception e) {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.print("{\"status\":\"failure\", \"message\":\"Server error.\"}");
        e.printStackTrace(); 
    } finally {
        out.close();
    } 
    
     }

@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  	String productName = request.getParameter("productName");
	String ManufacturerName= request.getParameter("ManufacturerName");
        String categoryName = request.getParameter("categoryName");
        String description = request.getParameter("description");
        String price = request.getParameter("price");
        String specialDiscounts = request.getParameter("specialDiscounts");
        Part filePart = request.getPart("image"); 
	   String Rebates=request.getParameter("Rebates");


        if (dbUtilities.productExists(productName)) {
            response.getWriter().write("{\"status\":\"error\", \"message\":\"Product already exists.\"}");
            return;
        }

        String fileName = filePart.getSubmittedFileName();
        String imagePath = IMAGE_UPLOAD_PATH + fileName;
        filePart.write(imagePath); // Save the file

	   String imgpath="/images/"+fileName; 
	   int defaultquantity=100;

        if (dbUtilities.addProduct(productName,ManufacturerName, categoryName, description, price, imgpath, specialDiscounts,Rebates) && dbUtilities.addProductReport(productName,price,specialDiscounts,defaultquantity,Rebates)){
            response.getWriter().write("{\"status\":\"success\"}");
        } else {
            response.getWriter().write("{\"status\":\"error\", \"message\":\"Failed to add product.\"}");
        }

}
    
@Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

response.setContentType("application/json");
    PrintWriter out = response.getWriter();
    
    StringBuilder sb = new StringBuilder();
    String line;
    
    try (BufferedReader reader = request.getReader()) {
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
    }

    String productNametoDelete = null;
    int productId=0;
    try {
        JSONObject jsonRequest = new JSONObject(sb.toString());
        productNametoDelete = jsonRequest.getString("productName");
	  productId=jsonRequest.getInt("productID");
    } catch (JSONException e) {
        e.printStackTrace();
    }

        boolean isDeleted = false;

if (productNametoDelete!= null && !productNametoDelete.isEmpty()) {
            
isDeleted = MySQLDataStoreUtilities.deleteProductAccessory(productId);
isDeleted = MySQLDataStoreUtilities.deleteProductByName(productNametoDelete);
        }   


if (isDeleted) {
        out.write("{\"status\":\"success\", \"message\":\"Product deleted successfully\"}");
    } else {
        out.write("{\"status\":\"error\", \"message\":\"Product deletion failed\"}");
    }     
        out.flush();

            }
}