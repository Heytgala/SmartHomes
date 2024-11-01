import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/InventoryReport")
public class InventoryReportServlet extends HttpServlet {
    private MySQLDataStoreUtilities dataStoreUtilities = new MySQLDataStoreUtilities();
	 
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
        // Get the "reportType" query parameter from the request
        String reportType = request.getParameter("reportType");

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        // Handle different report types
        if ("sale".equalsIgnoreCase(reportType)) {
            // Generate report for products on sale
            List<MySQLDataStoreUtilities.Product> productsOnSale = dataStoreUtilities.getProductsOnSale();
            writeProductsAsJson(out, productsOnSale);

        } else if ("rebate".equalsIgnoreCase(reportType)) {
            // Generate report for products with manufacturer rebates
            List<MySQLDataStoreUtilities.Product> productsWithRebates = dataStoreUtilities.getProductsWithRebates();
            writeProductsAsJson(out, productsWithRebates);

        } else {
            // Default to all products
            List<MySQLDataStoreUtilities.Product> allProducts = dataStoreUtilities.getAllProductsReport();
            writeProductsAsJson(out, allProducts);
        }

        out.flush();
    }

    // Utility method to write the list of products as JSON
    private void writeProductsAsJson(PrintWriter out, List<MySQLDataStoreUtilities.Product> products) {
        out.print("[");
        for (int i = 0; i < products.size(); i++) {
            MySQLDataStoreUtilities.Product product = products.get(i);
            out.print("{");
            out.print("\"productname\":\"" + product.getProductName() + "\",");
            out.print("\"productprice\":" + product.getProductPrice() + ",");
            out.print("\"availableproductcount\":" + product.getAvailableCount() + ",");
            out.print("\"productsale\":" + (product.getProductSale() != null ? product.getProductSale() : "null") + ",");
            out.print("\"productrebate\":" + (product.getProductRebate() != null ? product.getProductRebate() : "null"));
            out.print("}");
            if (i < products.size() - 1) {
                out.print(",");
            }
        }
        out.print("]");
    }    
}
