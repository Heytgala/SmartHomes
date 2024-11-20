import java.io.*;
import java.net.*;
import java.util.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.MultipartConfig;
import org.json.*;

@WebServlet("/portalsuggestions")
@MultipartConfig
public class SuggestionsServlet extends HttpServlet {

    private static final String OPENAI_API_KEY = "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";
    private static final String ELASTICSEARCH_URL = "http://localhost:9200";

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
	response.setCharacterEncoding("UTF-8");

        // Retrieve user input
        String reviewsearch = request.getParameter("reviewsearch");
        String productrecommendationsearch = request.getParameter("recommendersearch");

        PrintWriter out = response.getWriter();
        response.setContentType("application/json");

        try {
            if (reviewsearch != null && !reviewsearch.isEmpty()) {
                JSONArray result = performSemanticSearch("smarthomes_reviews", "Review_vector", reviewsearch);
                //out.println(result.toString());
		JSONObject finalResponse = new JSONObject();
            	finalResponse.put("status", "success");
            	finalResponse.put("message", "Data received successfully!");
            	finalResponse.put("finalresult", result);
		out.print(finalResponse.toString());


            } else if (productrecommendationsearch != null && !productrecommendationsearch.isEmpty()) {
                JSONArray result = performSemanticSearch("smarthomes_products", "Description_vector", productrecommendationsearch);
		JSONObject finalResponse = new JSONObject();
            	finalResponse.put("status", "success");
            	finalResponse.put("message", "Data received successfully!");
            	finalResponse.put("finalresult", result);
		out.print(finalResponse.toString());

            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("{\"error\": \"Invalid input\"}");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"error\": \"" + e.getMessage() + "\"}");
            e.printStackTrace();
        }
    }

    private JSONArray performSemanticSearch(String indexName, String vectorField, String queryText) throws IOException {
        // Step 1: Generate embedding using OpenAI
        double[] embedding = generateEmbedding(queryText);
        // Step 2: Query Elasticsearch for semantic search
        String query = buildElasticsearchQuery(vectorField, embedding);
        String elasticsearchResponse = queryElasticsearch(indexName, query);
        // Step 3: Parse Elasticsearch response
	//String parsedresponse = parseElasticsearchResponse(elasticsearchResponse);
	System.out.println(queryText);
	if(indexName!="smarthomes_products"){
        return parseElasticsearchResponse(elasticsearchResponse);
	} 
	else{
	return parseElasticsearchProductResponse(elasticsearchResponse);
	}
    }

    private double[] generateEmbedding(String text) throws IOException {
        URL url = new URL("https://api.openai.com/v1/embeddings");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + OPENAI_API_KEY);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        // Create request payload
        JSONObject payload = new JSONObject();
        payload.put("model", "text-embedding-3-small");
        payload.put("input", text);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(payload.toString().getBytes());
        }

        if (conn.getResponseCode() == 200) {
            // Parse OpenAI response
            String response = new BufferedReader(new InputStreamReader(conn.getInputStream())).lines()
                    .reduce("", (acc, line) -> acc + line);
            JSONObject jsonResponse = new JSONObject(response);
            JSONArray embeddingArray = jsonResponse.getJSONArray("data").getJSONObject(0).getJSONArray("embedding");

            // Convert embedding to double array
            double[] embedding = new double[embeddingArray.length()];
            for (int i = 0; i < embeddingArray.length(); i++) {
                embedding[i] = embeddingArray.getDouble(i);
            }
            return embedding;
        } else {
            throw new IOException("Failed to fetch embedding: " + conn.getResponseMessage());
        }
    }

    private String buildElasticsearchQuery(String vectorField, double[] embedding) {
        JSONObject query = new JSONObject();
        JSONObject knn = new JSONObject();
        knn.put("field", vectorField);
        knn.put("query_vector", new JSONArray(embedding));
        //knn.put("k", 5);
        knn.put("num_candidates", 10);

        JSONObject knnQuery = new JSONObject();
        knnQuery.put("knn", knn);

        query.put("query", knnQuery);
	query.put("size", 5);
        return query.toString();
    }

    private String queryElasticsearch(String indexName, String query) throws IOException {
    URL url = new URL(ELASTICSEARCH_URL + "/" + indexName + "/_search");
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setRequestMethod("POST");
    conn.setRequestProperty("Content-Type", "application/json");
    conn.setDoOutput(true);

    try (OutputStream os = conn.getOutputStream()) {
        os.write(query.getBytes());
    }

    int responseCode = conn.getResponseCode();
    String responseMessage = new BufferedReader(new InputStreamReader(
        responseCode == 200 ? conn.getInputStream() : conn.getErrorStream()
    )).lines().reduce("", (acc, line) -> acc + line);

    if (responseCode == 200) {
        return responseMessage;
    } else {
        throw new IOException("Elasticsearch query failed: " + responseMessage);
    }
    }

	
    private JSONArray parseElasticsearchResponse(String response) {
    // Parse the Elasticsearch response string into a JSON object
    JSONObject jsonResponse = new JSONObject(response);
    JSONArray hits = jsonResponse.getJSONObject("hits").getJSONArray("hits");

    // Initialize a JSON array to store the formatted results
    JSONArray results = new JSONArray();
    //JSONObject results = new JSONObject();

    for (int i = 0; i < hits.length(); i++) {
        JSONObject hit = hits.getJSONObject(i);

        // Extract required fields and rename them
        JSONObject formattedResult = new JSONObject();
        formattedResult.put("Index", hit.getString("_index")); // Rename "_index" to "Index"
        formattedResult.put("similarity score", hit.getDouble("_score")); // Rename "_score" to "similarity score"

        // Extract relevant fields from "_source"
        JSONObject source = hit.getJSONObject("_source");
        formattedResult.put("Product Name", source.getString("Product Name"));
        formattedResult.put("Product Price", source.getInt("Product Price"));
        formattedResult.put("Category", source.getString("Category"));
	formattedResult.put("Store ID", source.getInt("Store ID"));	
	formattedResult.put("Street", source.getString("Street"));
        formattedResult.put("City", source.getString("City"));
        formattedResult.put("State", source.getString("State"));
        formattedResult.put("Zip Code", source.getInt("Zip Code"));
	formattedResult.put("Product On Sale", source.getString("Product on Sale"));
        formattedResult.put("Manufacturer Name", source.getString("Manufacturer Name"));
        formattedResult.put("Manufacturer Rebate", source.getString("Manufacturer Rebate"));
        formattedResult.put("Age", source.getInt("Age"));
        formattedResult.put("Gender", source.getString("Gender"));
        formattedResult.put("Occupation", source.getString("Occupation"));
        formattedResult.put("ReviewRating", source.getInt("ReviewRating"));
        formattedResult.put("ReviewComments", source.getString("ReviewComments"));

        // Add the formatted result to the results array
        results.put(formattedResult);
    }

    

    System.out.println("Final Results: " + results); // Debugging

    // Wrap the results in a JSON object
    //JSONObject result = new JSONObject();
    //result.put("results", results);
    return results;
    }

    private JSONArray parseElasticsearchProductResponse(String response) {
    // Parse the Elasticsearch response string into a JSON object
    JSONObject jsonResponse = new JSONObject(response);
    JSONArray hits = jsonResponse.getJSONObject("hits").getJSONArray("hits");

    // Initialize a JSON array to store the formatted results
    JSONArray results = new JSONArray();
    //JSONObject results = new JSONObject();

    for (int i = 0; i < hits.length(); i++) {
        JSONObject hit = hits.getJSONObject(i);

        // Extract required fields and rename them
        JSONObject formattedResult = new JSONObject();
        formattedResult.put("Index", hit.getString("_index")); // Rename "_index" to "Index"
        formattedResult.put("similarity score", hit.getDouble("_score")); // Rename "_score" to "similarity score"

        // Extract relevant fields from "_source"
        JSONObject source = hit.getJSONObject("_source");
        formattedResult.put("Product Name", source.getString("Product Name"));
        formattedResult.put("Product Price", source.getString("Product Price"));
        formattedResult.put("Category", source.getString("Category"));
        formattedResult.put("Discounts", source.getString("Discounts"));
	formattedResult.put("Manufacturer Name", source.getString("Manufacturer Name"));
	formattedResult.put("Rebates", source.getString("Rebates"));
        formattedResult.put("Description", source.getString("Description"));
        // Add the formatted result to the results array
        results.put(formattedResult);
    }

    

    System.out.println("Final Results: " + results); // Debugging

    // Wrap the results in a JSON object
    //JSONObject result = new JSONObject();
    //result.put("results", results);
    return results;
    }


}
