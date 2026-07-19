import cookieParser from "cookie-parser";
import express,{ Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { globalErrorHandler, notFound } from "./mddlewires/globalHandler";
import { UserRoutes } from "./modules/user/user.route";
import { CategoryRoutes } from "./modules/category/category.routes";
import { PropertyRoutes } from "./modules/property/property.routes";
import { RentalRoutes } from "./modules/rental/rental.route";
import { PaymentRoutes } from "./modules/payment/paymemt.route";
import { PaymentController } from "./modules/payment/payment.controller";
import { ReviewRoutes } from "./modules/review/review.routes";

const app:Application= express();

// ⚠️ CRITICAL STEP: Webhook Confirm Route MUST process raw body before express.json()
app.post(
  '/api/payments/confirm',
  express.raw({ type: 'application/json' }),
    PaymentController.handleWebhook

);



// Standard Parsers & Middlewares
app.use(cors({
    origin:config.app_url,
    credentials:true
    
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.get("/",async(req:Request,res:Response)=>{

    res.send("welcome to the Prisma-rent-nest app");
    
});

// Application Module Routes
app.use("/api/auth",AuthRoutes);
app.use("/api/users",UserRoutes);
app.use("/api/categories",CategoryRoutes);
app.use("/api/properties", PropertyRoutes);
app.use("/api/rentals", RentalRoutes);
app.use('/api/payments', PaymentRoutes);
app.use("/api/reviews", ReviewRoutes);
app.use(notFound);
app.use(globalErrorHandler);

export default app;