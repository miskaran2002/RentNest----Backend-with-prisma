import { Router } from "express";
import auth from "../../mddlewires/auth.middleware";
import validateRequest from "../../mddlewires/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/register", validateRequest(AuthValidation.registerValidationSchema), AuthController.register);
router.post("/login", validateRequest(AuthValidation.loginValidationSchema), AuthController.login);
router.get("/me", auth(), AuthController.getMe);

export const AuthRoutes = router;