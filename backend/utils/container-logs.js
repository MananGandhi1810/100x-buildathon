import { PrismaClient } from "@prisma/client";
import { sendMessage } from "./socket-service.js";
import Docker from "dockerode";

const prisma = new PrismaClient();
const docker = new Docker();

const logContainerData = async (containerId, projectId) => {
    console.log(`Logging data for container: ${containerId}`);
    const container = docker.getContainer(containerId);
    if (!container) return;

    const logs = await container.logs({ stdout: true, stderr: true });
    sendMessage(projectId, "containerLogs", logs.toString());
};

const updateContainerStatus = async (containerId, projectId) => {
    console.log(`Updating status for container: ${containerId}`);
    const container = docker.getContainer(containerId);
    if (!container) return;

    try {
        const data = await container.inspect();
        const status = data.State.Status;

        await prisma.deployment.update({
            where: { id: projectId },
            data: {
                status: status,
            },
        });
    } catch (error) {
        console.error(
            `Error updating status for container ${containerId}:`,
            error
        );
    }
};

const logAllContainers = async () => {
    setInterval(async () => {
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
            updateContainerStatus(project.containerId, project.id)
        );
    }, 2000);
};

export { logContainerData, logAllContainers };
