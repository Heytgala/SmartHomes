import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/dailySalesReport")
public class DailySalesReportServlet extends HttpServlet {
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
        response.setStatus(HttpServletResponse.SC_OK);
	response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        List<Map<String, Object>> salesReports = MySQLDataStoreUtilities.getDailySalesReport();
        StringBuilder jsonOutput = new StringBuilder();
        jsonOutput.append("[");

        for (int i = 0; i < salesReports.size(); i++) {
            Map<String, Object> report = salesReports.get(i);
            jsonOutput.append("{")
                .append("\"date\":\"").append(report.get("date")).append("\",")
                .append("\"totalSales\":").append(report.get("totalSales")).append(",")
                .append("\"totalProductCount\":").append(report.get("totalProductCount")).append(",")
                .append("\"productNames\":\"").append(report.get("productNames")).append("\"")
                .append("}");

            if (i < salesReports.size() - 1) {
                jsonOutput.append(",");
            }
        }

        jsonOutput.append("]");
        out.write(jsonOutput.toString());
        out.flush();
    }
}
