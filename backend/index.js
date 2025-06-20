import express from "express";
import cors from "cors";
import authRouter from "./router/auth.js";
import logger from "morgan";
import deployRouter from "./router/deploy.js";
import projectRouter from "./router/project.js";
import codeEnvRouter from "./router/subdomains.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);

app.use("/auth", authRouter);
app.use("/deployment", deployRouter);
app.use("/project", projectRouter);

app.use(
    "/",
    (req, res, next) => {
        if (req.subdomains.length < 1 || req.subdomains[0] == "api") {
            return res.status(404).json({
                success: false,
                message: "This route could not be found",
                data: null,
            });
        }
        next();
    },
    codeEnvRouter,
);

app.use(function (req, res, next) {
    res.status(404).json({
        success: false,
        message: "This route could not be found",
        data: null,
    });
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    console.log(err);

    res.status(err.status || 500).json({
        success: false,
        message: "An unexpected error occured",
        data: null,
    });
});

export default app;
