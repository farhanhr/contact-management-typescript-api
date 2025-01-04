import supertest from "supertest";
import { server } from "../src/application/server"
import { logger } from "../src/application/logging";
import { UserTest } from "./test-util";
import bcrypt from "bcrypt";

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

describe('POST /api/users/login', () => {

    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it('should be able to login', async () => {
        const response = await supertest(server)
            .post("/api/users/login")
            .send({
                username: "test",
                password: "test"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
        expect(response.body.data.token).toBeDefined();
    });


    it('should reject login when username or password is wrong', async () => {
        const response = await supertest(server)
            .post("/api/users/login")
            .send({
                username: "test",
                password: "wrong password"
            });

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it('should be able to get user', async () => {
        const response = await supertest(server)
            .get("/api/users/current")
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
    });

    it('should reject get User if token is invalid', async () => {
        const response = await supertest(server)
            .get("/api/users/current")
            .set("X-API-TOKEN", "wrong token");

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});

describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it('should reject update user if request is invalid', async () => {
        const response = await supertest(server)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "test")
            .send({
                name: "",
                password: ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject update user if token is invalid', async () => {
        const response = await supertest(server)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "invalid token")
            .send({
                name: "Jacky",
                password: "jack123"
            });

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    it('should be able to update username', async () => {
        const response = await supertest(server)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "test")
            .send({
                name: "Jacky"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("Jacky");
    });

    it('should be able to update password', async () => {
        const response = await supertest(server)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "test")
            .send({
                password: "jacky123"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);

        const user = await UserTest.get();
        expect(await bcrypt.compare("jacky123", user.password)).toBe(true);
    });
});

describe('DELETE /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it('should be able to logout', async () => {
        const response = await supertest(server)
            .delete("/api/users/current")
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data).toBe("Ok");

        const user = await UserTest.get();
        expect(user.token).toBe(null);
    });

    it('should reject logout if token invalid', async () => {
        const response = await supertest(server)
            .delete("/api/users/current")
            .set("X-API-TOKEN", "invalid token");

        logger.debug(response.body);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});