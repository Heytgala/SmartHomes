import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.PrintWriter;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/cancelOrder")
public class CancelOrderServlet extends HttpServlet {
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST,DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }


@Override
protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

StringBuilder sb = new StringBuilder();
    String line;
    try (BufferedReader reader = request.getReader()) {
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
    }

    String jsonString = sb.toString();
    JSONObject jsonObject = new JSONObject(jsonString); // Requires org.json library

    String orderNumber = jsonObject.getString("orderNumber");
    String userName = jsonObject.getString("userName");


    MySQLDataStoreUtilities dbUtils = new MySQLDataStoreUtilities();

    int userId = dbUtils.getUserId(userName);
    
    boolean isDeleted = dbUtils.deleteOrder(orderNumber, userId);

    if (isDeleted) {
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write("Order canceled successfully.");
    } else {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        response.getWriter().write("Order not found or could not be canceled.");
    }
}


}