import supertest from "supertest";
import { server } from "../src/application/server"
import { logger } from "../src/application/logging";
import { UserTest } from "./test-util";

describe('Post /api/users', () => {

    afterEach(async () => {
         await UserTest.delete();
    })

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

        it ('should register new users', async () => {
            const response = await supertest(server)
            .post("/api/users")
            .send({
                username: "test",
                password: "test",
                name: "test"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");

        });

});