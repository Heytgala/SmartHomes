import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/salesReport")
public class SalesReportServlet extends HttpServlet {
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }    

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
	response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            List<String> reportData = MySQLDataStoreUtilities.getSalesReport();
	    System.out.println(reportData);
            out.println("[");
            for (int i = 0; i < reportData.size(); i++) {
                out.println(reportData.get(i));
                if (i < reportData.size() - 1) {
                    out.println(",");
                }
            }
            out.println("]");
        } catch (Exception e) {
            e.printStackTrace();
            out.println("[]");
        }
    }
}
