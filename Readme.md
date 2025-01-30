<h1 strong>SMART HOMES</h1>

This project is a web-based enterprise application for an online SmartHome retailer, developed using Servlets, React, MySQL, MongoDB, and ElasticSearch. It follows MVC architecture and object-oriented design principles to provide a scalable and extensible solution.

<b>Key Features:</b>

✅ User Authentication – Secure login system with MySQL database. <br/>
✅ Product Management – CRUD operations for products stored in MySQL. <br/>
✅ Order Processing – Store customer transactions in MySQL, supporting home delivery & in-store pickup. <br/>
✅ Product Reviews – Customers can submit reviews stored in MongoDB. <br/>
✅ Trending & Analytics – Track top-rated products and sales trends. <br/>
✅ Customer Service Module – Users can open tickets, upload images, and receive AI-based resolutions. <br/>
✅ Semantic Search & Recommendations – Uses OpenAI embeddings & ElasticSearch for intelligent product search & review analysis.

Built with React, Servlet, MySQL, MongoDB, Docker, and OpenAI APIs, this project enhances the online shopping experience with smart recommendations and automated customer support.
🚀 Tech Stack: React, Servlet, MySQL, MongoDB, ElasticSearch, OpenAI APIs.


<b>Steps to implement:</b>

1) Firstly install the Apache Tomcat "apache-tomcat-9.0.93" version --> https://archive.apache.org/dist/tomcat/tomcat-9/v9.0.93/bin/

2) Once installed unzip the folder in the "C" drive of your computer

3) Once unzipped, in the "Apache Tomcat" folder go to "webapps" folder and place the folder from my "backend" folder containing "SmartHomes" folder inside the "webapps" folder

4) Add "json-20210307.jar; mysql-connector-java.jar; mongodb-driver-3.12.10.jar; mongodb-driver-core-3.12.10.jar; bson-3.12.10.jar; okio-2.10.0.jar; okhttp-4.9.3.jar" file inside the "Apache Tomcat" folder containing "lib" folder

5) Install jdk-17 version if not installed and save it in "C:\Program Files\Java\" folder

6) Performing below java commands in the terminal : <br/>
	a) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar -d . LoginServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	b) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar -d . StoreServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	c) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar -d . CategoryServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	d) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . ProductServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	e) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . BuyProductServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	f) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . CheckoutServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	g) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . OrderServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	h) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . CancelOrderServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	i) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mongodb-driver-3.12.10.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar;C:\apache-tomcat-9.0.93\lib\mongodb-driver-core-3.12.10.jar;C:\apache-tomcat-9.0.93\lib\bson-3.12.10.jar -d . ProductReviewServlet.java MongoDBDataStoreUtilities.java MySQLDataStoreUtilities.java Store.java <br/>
	j) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . CustomerServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	k) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mongodb-driver-3.12.10.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar;C:\apache-tomcat-9.0.93\lib\mongodb-driver-core-3.12.10.jar;C:\apache-tomcat-9.0.93\lib\bson-3.12.10.jar -d . TrendingServle
t.java MongoDBDataStoreUtilities.java MySQLDataStoreUtilities.java Store.java <br/>
	l) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . ProductAccessoryServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	m)  javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . BuyProductAccessoryServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	n) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . InventoryReportServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	o) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . SalesReportServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	p) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . DailySalesReportServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	q) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar -d . AjaxUtility.java <br/>
	r) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar;C:\apache-tomcat-9.0.93\lib\okhttp-4.9.3.jar;C:\apache-tomcat-9.0.93\lib\okio-2.10.0.jar -d . OpenTicketOrderServlet.java MySQLDataStoreUtilities.java Store.java <br/>
	s) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . SuggestionsServlet.java

7) Start backend server using following commands in terminal:
   a) set JAVA_HOME=C:\Program Files\Java\jdk-17 <br/>
   b) set PATH="C:\Program Files\Java\jdk-17\bin";%PATH% <br/>
   c) set CLASSPATH=.;C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\jsp-api.jar;C:\apache-tomcat-9.0.93\lib\el-api.jar;C:\apache-tomcat-9.0.93\lib\commons-beanutils-1.8.3.jar;C:\apache-tomcat-9.0.93\mongo-java-driver-3.1.0.jar;C:\apache-tomcat-9.0.93\lib\gson-2.3.1.jar <br/>
   d) set ANT_HOME=C:\apache-tomcat-9.0.93 <br/>
   e) set TOMCAT_HOME=C:\apache-tomcat-9.0.93 <br/>
   f) set CATALINA_HOME=C:\apache-tomcat-9.0.93 <br/>
   h) cd "C:\apache-tomcat-9.0.93\bin" <br/>
   i) startup.bat

8) Once backend server starts running perfectly try testing the url of it. Default would be "http://localhost:8080/". If it works we move further

9) We need to have our Docker image running before we start our frontend. It would run on "http://localhost:9200/" as default. If it works we move further. Steps for generating docker image can be found in Elastic Search Vector Embedding folder.

9) In frontend folder we have config.js file -- Set baseURL if it is not using default url.

10) Once everthing is saved in frontend, Perform following command: <br/>
	npm start
