import supertest from "supertest";
import { server } from "../src/application/server"
import { ContactTest, UserTest } from "./test-util";
import { logger } from "../src/application/logging";

describe('POST /api/contacts', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should create new contact', async () => {
        const response = await supertest(server)
            .post("/api/contacts")
            .set("X-API-TOKEN", "test")
            .send({
                first_name: "Farhan",
                last_name: "HR",
                email: "han@mail.com",
                phone: "08128391883"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe("Farhan");
        expect(response.body.data.last_name).toBe("HR");
        expect(response.body.data.email).toBe("han@mail.com");
        expect(response.body.data.phone).toBe("08128391883");

    });

    it('should reject create new contact if data is invalid', async () => {
        const response = await supertest(server)
            .post("/api/contacts")
            .set("X-API-TOKEN", "test")
            .send({
                first_name: "",
                last_name: "",
                email: "han.com",
                phone: "08128391883238249238283298"
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();

    });
});