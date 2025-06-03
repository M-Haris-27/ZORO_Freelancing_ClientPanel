import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(cors({ origin: "http://localhost:5173",
    credentials: true
 }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Import routes
import authRouter from "./Routes/auth.routes.js";
import userRouter from "./Routes/user.routes.js";
import jobRouter from "./Routes/job.routes.js";
import proposalRouter from "./Routes/proposal.routes.js";
import paymentRouter from "./Routes/payment.routes.js";
import reviewRouter from "./Routes/review.routes.js";
import disputeRouter from "./Routes/dispute.routes.js";
import notificationRouter from "./Routes/notification.routes.js";
import workSubmissionRouter from "./Routes/workSubmission.routes.js"; // Import work submission routes
import errorMiddleware from "./Middlewares/error.middleware.js";
import profileRouter from "./Routes/profile.routes.js";

// Endpoints
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/proposals", proposalRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/disputes", disputeRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/workSubmissions", workSubmissionRouter); // Add work submissions endpoint
app.use("/api/v1/profile", profileRouter);

// Error handler middleware
app.use(errorMiddleware);

export default app;
