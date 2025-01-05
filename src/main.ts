import { logger } from "./application/logging";
import { server } from "./application/server";

server.listen(3000, () => {
    logger.info("Server berjalan di port 3000");
})