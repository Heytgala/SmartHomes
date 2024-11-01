import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.Part;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import okhttp3.*;
import org.json.JSONObject;
import java.util.Base64;
import org.json.JSONArray;
import java.net.URL;
import java.net.HttpURLConnection;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;

@WebServlet("/ticketservice")
@MultipartConfig
public class OpenTicketOrderServlet extends HttpServlet {
    
    private MySQLDataStoreUtilities dbUtilities = new MySQLDataStoreUtilities();
    private static final String IMAGE_UPLOAD_PATH = "C:/apache-tomcat-9.0.93/webapps/SmartHomes/images/serviceticket/";  
    private static final String INSTRUCTION_PROMPT = "You are a customer service assistant for a delivery service, responsible for analyzing package and product images. Follow these guidelines to determine the appropriate action: If a package appears heavily damaged in the image, automatically process a refund according to policy and select 'refund_order'. If the package looks wet (e.g., visible water stains or moisture), initiate a replacement & select 'replace_order'. Wet packages should not be categorized as damaged unless they are both wet and heavily damaged. If the package appears normal and not damaged, select 'escalate_to_agent'. For any other issues or unclear images, select 'escalate_to_agent'.";

    private static final String OPENAI_API_KEY = System.getenv("OPENAI_API_KEY");

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
	response.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from your React app
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        String userName = request.getParameter("userName"); // Retrieve userName from request parameter
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        if (userName != null && !userName.isEmpty()) {
            ArrayList<String> orderIds = MySQLDataStoreUtilities.getOrderIdsByUserName(userName);

            // Building JSON response manually
            StringBuilder jsonResponse = new StringBuilder();
            jsonResponse.append("[");
            for (int i = 0; i < orderIds.size(); i++) {
                jsonResponse.append("\"").append(orderIds.get(i)).append("\"");
                if (i < orderIds.size() - 1) {
                    jsonResponse.append(",");
                }
            }
            jsonResponse.append("]");

            out.print(jsonResponse.toString());
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"error\":\"Missing or invalid userName parameter\"}");
        }
        out.flush();
    }

    
    @Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) 
        throws ServletException, IOException {
    response.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from your React app
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    PrintWriter out = response.getWriter();
    String ticketstatus = request.getParameter("ticketstatus");
    String resultCategory = "";

    if ("OpenTicket".equals(ticketstatus)) {
        String OrderId = request.getParameter("OrderNumber");
        String ticketdescription = request.getParameter("shipmentDescription");
        String ticketNumber = "T" + (int)(Math.floor(100000 + Math.random() * 900000));
        String imgpath="";
	String actionResult="";
	String AIstatus="";
        Part filePart = request.getPart("uploadedImage");
        if (filePart != null && filePart.getSize() > 0) {
	    
            String fileName = filePart.getSubmittedFileName();
            String imagePath = IMAGE_UPLOAD_PATH + fileName;
            filePart.write(imagePath); 
	    imgpath = "/images/serviceticket/" + fileName; 
	   
	    String base64Image;
	    byte[] imageBytes = Files.readAllBytes(Paths.get(imagePath));
            base64Image = Base64.getEncoder().encodeToString(imageBytes);
            
	    JSONObject payload = createPayload(base64Image);
	    
	    OkHttpClient client = new OkHttpClient();
            RequestBody body = RequestBody.create(payload.toString(), MediaType.parse("application/json"));
            Request apiRequest = new Request.Builder()
                    .url("https://api.openai.com/v1/chat/completions")
                    .header("Authorization", "Bearer " + OPENAI_API_KEY)
                    .post(body)
                    .build();
	    
	    try (Response apiResponse = client.newCall(apiRequest).execute()) {
                if (apiResponse.isSuccessful()) {
		    String responseBody = apiResponse.body().string();
                    // Process response and determine action
                    JSONObject apiResponseBody = new JSONObject(responseBody);
                    String action = apiResponseBody.getJSONArray("choices").getJSONObject(0)
                            .getJSONObject("message").getJSONObject("function_call").getString("name");
                    JSONObject arguments = new JSONObject(apiResponseBody.getJSONArray("choices")
                            .getJSONObject(0).getJSONObject("message").getJSONObject("function_call")
                            .getString("arguments"));

                    // Handle specific actions and output response
		    actionResult = handleAction(action, arguments);                     
		    JSONObject actionResultJson = new JSONObject(actionResult);
                                        
                    if ("refund_order".equals(actionResultJson.getString("status"))) {
                        AIstatus = "Refund Order"; 
                    } else if("replace_order".equals(actionResultJson.getString("status"))){
		    	AIstatus="Replace Order";
		    } else{
		   	AIstatus="Escalate to Human Agent";
                    }
			

                } else {
                    throw new IOException("Error: " + apiResponse.body().string());
                }
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                e.printStackTrace();
                response.getWriter().print("{\"error\":\"Failed to analyze image\"}");
            }

            
        }
		
        response.setContentType("application/json");
        
	if(dbUtilities.addTicket(ticketstatus,OrderId,ticketdescription,ticketNumber,imgpath,AIstatus)){
	
        	out.print("{\"status\":\"success\",\"tickettype\":\"OpenTicket\",\"message\":\"Ticket created successfully\", \"ticketNumber\":\"" + ticketNumber + "\"}");
        	out.flush();
	}
	else{
		out.print("{\"status\":\"error\",\"error\":\"Not able to create ticket\"}");
	}
    } 
	else if("StatusTicket".equals(ticketstatus)){
		String ticketnumber= request.getParameter("TicketNumberStatus");
		String AIstatus= dbUtilities.getticketAIstatus(ticketnumber);
		out.print("{\"status\":\"success\",\"tickettype\":\"Tickettracker\",\"message\":\"Status of Ticket\", \"ticketNumber\":\"" + ticketnumber + "\", \"AIstatus\":\"" + AIstatus + "\"}");

					        	
	}
	else {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        response.getWriter().print("{\"status\":\"error\",\"error\":\"Invalid ticket status\"}");
    }
}

private JSONObject createPayload(String base64Image) {
    JSONObject payload = new JSONObject();
    payload.put("model", "gpt-4o-mini");

    JSONArray messages = new JSONArray();
    
    // Instruction message
    JSONObject instructionMessage = new JSONObject();
    instructionMessage.put("role", "user");
    instructionMessage.put("content", INSTRUCTION_PROMPT);
    messages.put(instructionMessage);

    // Image message with role specified and image data as content
    JSONObject imageMessage = new JSONObject();
    imageMessage.put("role", "user");
    imageMessage.put("content", "data:image/jpeg;base64," + base64Image);
    messages.put(imageMessage);

    payload.put("messages", messages);

    // Define functions for the assistant
    JSONArray functions = new JSONArray();
    functions.put(createFunction("refund_order", "Refund an order", new String[]{"rationale", "image_description"}));
    functions.put(createFunction("replace_order", "Replace an order", new String[]{"rationale", "image_description"}));
    functions.put(createFunction("escalate_to_agent", "Escalate to agent", new String[]{"rationale", "image_description"}));
    payload.put("functions", functions);

    // Other settings
    payload.put("function_call", "auto");  // Request the assistant to auto-determine the function call
    payload.put("temperature", 0.0);

    return payload;
}


private JSONObject createFunction(String name, String description, String[] requiredParams) {
        JSONObject function = new JSONObject();
        function.put("name", name);
        function.put("description", description);
        JSONObject parameters = new JSONObject();
        JSONObject properties = new JSONObject();
        for (String param : requiredParams) {
            properties.put(param, new JSONObject().put("type", "string"));
        }
        parameters.put("type", "object");
        parameters.put("properties", properties);
        parameters.put("required", new JSONArray(requiredParams));
        function.put("parameters", parameters);
        return function;
    }

private String handleAction(String action, JSONObject arguments) throws IOException {
    switch (action) {
        case "refund_order":
            return "{\"status\":\"refund_order\",\"rationale\":\"" + arguments.getString("rationale") + "\", \"description\":\"" + arguments.getString("image_description") + "\"}";
        case "replace_order":
            return "{\"status\":\"replace_order\",\"rationale\":\"" + arguments.getString("rationale") + "\", \"description\":\"" + arguments.getString("image_description") + "\"}";
        case "escalate_to_agent":
            return "{\"status\":\"escalate_to_agent\",\"rationale\":\"" + arguments.getString("rationale") + "\", \"description\":\"" + arguments.getString("image_description") + "\"}";
        default:
            return "{\"status\":\"escalate_to_agent\",\"rationale\":\"Unknown action received, escalating to agent for review.\", \"description\":\"" + arguments.optString("image_description", "No description provided.") + "\"}";
    }
}



}
