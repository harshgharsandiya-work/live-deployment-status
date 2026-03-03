require("dotenv").config();

const http = require("http");

const app = require("./app");
const prisma = require("./config/prisma");
const { initSocket } = require("./socket/index");

const PORT = process.env.PORT || 4000;

(async () => {
    try {
        await prisma.$connect();
        console.log("Database connected!!!");

        const server = http.createServer(app);

        //initialize socket
        initSocket(server);

        server.listen(PORT, () =>
            console.log(`Server is running at port: ${PORT}`),
        );
    } catch (error) {
        console.error("Database error: ", error);
        process.exit(1);
    }
})();
