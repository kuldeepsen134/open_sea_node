const express = require("express");
const app = express();

require("dotenv").config({ path: __dirname + '/.env' });
require("express-async-errors")
const compress = require("compression");
var cookieParser = require('cookie-parser')
const path = require("path")

var bodyParser = require('body-parser')
const connectDatabase = require("./src/config/database");

//security dependencies
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");


//middle wares
const errorHandlerMiddleware = require("./src/middleware/error-handler");
const notFoundMiddleware = require("./src/middleware/not-found");
app.use(xss());
app.use(helmet());

//app.use(bodyParser({ limit: '50mb' }));
app.use(compress())

app.use(express.urlencoded({ extended: true }));


app.use("/", express.static(path.join(__dirname, "/client/build")))

app.use(express.json())
app.use(cookieParser())
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(cors({
	origin: "*",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true
}))



//database connect
connectDatabase();

app.get("/", (req, res) => {
	res.status(200).json({ message: "Welcome" });
	// res.sendFile(path.join(__dirname, "/client/build/index.html"))
});

//Routes
const admin = require("./src/routes/admin");
const user = require("./src/routes/user");
const common = require("./src/routes/common");
const opensea = require("./src/routes/opensea");
const order = require("./src/routes/order");
const apiName = require("./src/routes/apiName");
const transaction = require("./src/routes/transaction");
const plan = require("./src/routes/plan");
const checkStatus = require("./src/routes/checkStatus");
const getFileUrl = require("./src/routes/getFileUrl");

const collectionDoodle = require("./src/routes/collectionDoodle");





//routes
app.use("/admin/api", admin);
app.use("/common/api", common);
app.use("/user/api", user);
app.use("/api", opensea);

app.use("/api", apiName);

app.use("/api", plan);

app.use("/api", order);
app.use("/api", transaction)
app.use("/api", checkStatus)
app.use("/api/v1", collectionDoodle)
app.use("/upload", getFileUrl)



app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);


const port = process.env.PORT || 8000
app.listen(port, async () => {
	console.log(`Server is listening on port ${port}`);
})