import supertest from "supertest";
import { server } from "../src/application/server"
import { logger } from "../src/application/logging";

describe('Post /api/users', () => {

    it('should reject new user if request is invalid', async () => {
        const response = await supertest(server)
            .post("/api/users")
            .send({
                username: "",
                password: "",
                name: ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();

    });

});