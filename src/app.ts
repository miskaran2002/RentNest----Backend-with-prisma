import cookieParser from "cookie-parser";
import express,{ Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { globalErrorHandler, notFound } from "./mddlewires/globalHandler";
import { UserRoutes } from "./modules/user/user.route";
import { CategoryRoutes } from "./modules/category/category.routes";
import { PropertyRoutes } from "./modules/property/property.routes";

const app:Application= express();


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

app.use("/api/auth",AuthRoutes);
app.use("/api/users",UserRoutes);
app.use("/api/categories",CategoryRoutes);
app.use("/api/properties", PropertyRoutes);
app.use(notFound);
app.use(globalErrorHandler);

export default app;