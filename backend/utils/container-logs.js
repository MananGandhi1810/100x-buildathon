import { PrismaClient } from "@prisma/client";
import { sendMessage } from "./socket-service.js";
import Docker from "dockerode";

const prisma = new PrismaClient();
const docker = new Docker();

const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, "");

const logContainerData = async (containerId, projectId) => {
    const container = docker.getContainer(containerId);
    if (!container) return;

    container.logs(
        { stdout: true, stderr: true, follow: true },
        function (err, stream) {
            if (!stream) return;

            stream.on("data", async (data) => {
                const cleanData = stripAnsi(data.toString());
                sendMessage(projectId, "log", cleanData);
            });
            stream.on("error", (e) => {
                console.error(e);
            });
            stream.on("end", () => {
                console.log("Process Ended");
            });
        },
    );
};

const logAllContainers = async () => {
    const projects = await prisma.deployment.findMany({
        where: {
            containerId: { not: null },
        },
        select: {
            id: true,
            containerId: true,
        },
    });
    projects.map((project) =>
        logContainerData(project.containerId, project.id),
    );
};

export { logContainerData, logAllContainers };
