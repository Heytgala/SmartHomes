import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/getStores")
public class StoreServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	   response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        List<Store> stores = MySQLDataStoreUtilities.getAllStores();
        StringBuilder json = new StringBuilder("[");
        
        for (int i = 0; i < stores.size(); i++) {
            Store store = stores.get(i);
            json.append("{")
                .append("\"storeID\":").append(store.getStoreID()).append(",")
                .append("\"street\":\"").append(store.getStreet()).append("\",")
                .append("\"city\":\"").append(store.getCity()).append("\",")
                .append("\"state\":\"").append(store.getState()).append("\",")
                .append("\"zipCode\":\"").append(store.getZipCode()).append("\"")
                .append("}");

            if (i < stores.size() - 1) {
                json.append(",");
            }
        }
        
        json.append("]");
        out.print(json.toString());
        out.flush();
    }

protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
}