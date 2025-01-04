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

describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to get contact', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(server)
            .get(`/api/contacts/${contact.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe(contact.first_name);
        expect(response.body.data.last_name).toBe(contact.last_name);
        expect(response.body.data.email).toBe(contact.email);
        expect(response.body.data.phone).toBe(contact.phone);

    });

    it('should reject to get contact when id is not found', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(server)
            .get(`/api/contacts/${contact.id + 1}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to update contact', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(server)
            .put(`/api/contacts/${contact.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                first_name: "Farhan",
                last_name: "HR",
                email: "han@mail.com",
                phone: "082793919938",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(contact.id);
        expect(response.body.data.first_name).toBe("Farhan");
        expect(response.body.data.last_name).toBe("HR");
        expect(response.body.data.email).toBe("han@mail.com");
        expect(response.body.data.phone).toBe("082793919938");
    });

    it('should be able to reject update when request is invalid', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(server)
            .put(`/api/contacts/${contact.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                first_name: "",
                last_name: "",
                email: "han.com",
                phone: "",
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();

    });
});

describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to remove contact', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(server)
            .delete(`/api/contacts/${contact.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("Ok");
    });

    it('should reject to remove contact if contact is not found', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(server)
            .delete(`/api/contacts/${contact.id + 1}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('SEARCH GET /api/contacts', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to search contact', async () => {
        const response = await supertest(server)
            .get("/api/contacts")
            .set("X-API-TOKEN", 'test');

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);

    });

    it('should be able to search contact using name', async () => {
        const response = await supertest(server)
            .get("/api/contacts")
            .query({
                name: "st"
            })
            .set("X-API-TOKEN", 'test');

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);

    });

    it('should be able to search contact using email', async () => {
        const response = await supertest(server)
            .get("/api/contacts")
            .query({
                email: "mail"
            })
            .set("X-API-TOKEN", 'test');

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);

    });

    it('should be able to search contact using phone', async () => {
        const response = await supertest(server)
            .get("/api/contacts")
            .query({
                phone: "1823"
            })
            .set("X-API-TOKEN", 'test');

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);

    });

    it('should be able to search contact with no result', async () => {
        const response = await supertest(server)
            .get("/api/contacts")
            .query({
                name: "karaken"
            })
            .set("X-API-TOKEN", 'test');

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(0);
        expect(response.body.paging.size).toBe(10);

    });

    it('should be able to search contact with paging', async () => {
        const response = await supertest(server)
            .get("/api/contacts")
            .query({
                page: 2,
                size: 1
            })
            .set("X-API-TOKEN", 'test');

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(2);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(1);

    });
});