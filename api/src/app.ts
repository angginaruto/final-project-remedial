import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js"
import testRouter from "./routes/test.route.js"
import productRouter from "./routes/product.route.js"
import categoryRouter from "./routes/category.route.js"
import cashierRouter from "./routes/cashier.route.js"
import shiftRouter from "./routes/shift.route.js"
import transactionRouter from "./routes/tansaction.route.js"
import reportRouter from "./routes/report.route.js"

const app = express();

app.use(cors());
// supaya express bisa membaca isi json
app.use(express.json());

app.get("/", (req,res) => {
    res.json({
        message : "Cashier App Backend is running"
    })
})

app.use("/api/auth", authRouter)
app.use("/api/test", testRouter)
app.use("/api/products", productRouter)
app.use("/api/category", categoryRouter)
app.use("/api/cashier", cashierRouter)
app.use("/api/shift",shiftRouter)
app.use("/api/transaction", transactionRouter)
app.use("/api/reports", reportRouter)

export default app;