import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js";
import postRoutes from "./src/routes/post.routes.js";
import commentRoutes from "./src/routes/comment.routes.js";
import followRoutes from "./src/routes/follow.routes.js";
import serviceRoutes from "./src/routes/service.routes.js";
import membershipRoutes from "./src/routes/membership.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/memberships", membershipRoutes);

export default app;
