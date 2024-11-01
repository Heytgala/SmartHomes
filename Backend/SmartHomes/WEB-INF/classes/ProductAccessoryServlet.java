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

@WebServlet("/productaccessorylist")
@MultipartConfig
public class ProductAccessoryServlet extends HttpServlet {
    private MySQLDataStoreUtilities dbUtilities = new MySQLDataStoreUtilities();
    private static final String IMAGE_UPLOAD_PATH = "C:/apache-tomcat-9.0.93/webapps/SmartHomes/images/accessories/";
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
    @Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  	int productid = Integer.parseInt(request.getParameter("productName"));
        String AccessoryName = request.getParameter("AccessoryName");
        Double price = Double.parseDouble(request.getParameter("price"));
        Part filePart = request.getPart("image"); 

        if (dbUtilities.productaccessoryExists(AccessoryName)) {
            response.getWriter().write("{\"status\":\"error\", \"message\":\"Product Accessory already exists.\"}");
            return;
        }

        String fileName = filePart.getSubmittedFileName();
        String imagePath = IMAGE_UPLOAD_PATH + fileName;
        filePart.write(imagePath); 

	   String imgpath="/images/accessories/"+fileName;

        if (dbUtilities.addProductAccessory(productid,AccessoryName, price, imgpath)) {
            response.getWriter().write("{\"status\":\"success\"}");
        } else {
            response.getWriter().write("{\"status\":\"error\", \"message\":\"Failed to add product.\"}");
        }

}


}