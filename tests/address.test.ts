import supertest from "supertest";
import { AddressTest, ContactTest, UserTest } from "./test-util";
import { server } from "../src/application/server";
import { logger } from "../src/application/logging";

describe('POST /api/contacts/:contactsId/addresses', () => {
        beforeEach(async () => {
            await UserTest.create();
            await ContactTest.create();
        });
    
        afterEach(async () => {
            await AddressTest.deleteAll();
            await ContactTest.deleteAll();
            await UserTest.delete();
        });

        it('should be able to create address', async () => {
            const contact = await ContactTest.get();
            const response = await supertest(server)
                .post(`/api/contacts/${contact.id}/addresses`)
                .set("X-API-TOKEN", "test")
                .send({
                    street: "Jalan Colon no.01",
                    city: "Kota Sofya",
                    province: "Margasatwa",
                    country: "Toram",
                    postal_code: "9915"
                });

            logger.debug(response.body);
            expect(response.status).toBe(200);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.street).toBe("Jalan Colon no.01");
            expect(response.body.data.city).toBe("Kota Sofya");
            expect(response.body.data.province).toBe("Margasatwa");
            expect(response.body.data.country).toBe("Toram");
            expect(response.body.data.postal_code).toBe("9915");
        });

        it('should reject to create address if required field is null', async () => {
            const contact = await ContactTest.get();
            const response = await supertest(server)
                .post(`/api/contacts/${contact.id}/addresses`)
                .set("X-API-TOKEN", "test")
                .send({
                    street: "Jalan Colon no.01",
                    city: "Kota Sofya",
                    province: "Margasatwa",
                    country: "",
                    postal_code: ""
                });

            logger.debug(response.body);
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should reject to create address if contact is not found', async () => {
            const contact = await ContactTest.get();
            const response = await supertest(server)
                .post(`/api/contacts/${contact.id + 1}/addresses`)
                .set("X-API-TOKEN", "test")
                .send({
                    street: "Jalan Colon no.01",
                    city: "Kota Sofya",
                    province: "Margasatwa",
                    country: "Sofya",
                    postal_code: "89210"
                });

            logger.debug(response.body);
            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });
});

describe('POST /api/contacts/:contactsId/addresses/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to get Address', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(server)
            .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.street).toBe(address.street);
        expect(response.body.data.city).toBe(address.city);
        expect(response.body.data.province).toBe(address.province);
        expect(response.body.data.country).toBe(address.country);
        expect(response.body.data.postal_code).toBe(address.postal_code);

    });

    it('should reject to get Address if address is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(server)
            .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();

    });

    it('should reject to get Address if contact id is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(server)
            .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();

    });
});

describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to update address', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(server)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "Jalan Wanderer no.33",
                    city: "Kota El Scaro",
                    province: "Provinsi Witeka",
                    country: "Diomedea",
                    postal_code: "68173"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(address.id);
        expect(response.body.data.street).toBe("Jalan Wanderer no.33");
        expect(response.body.data.city).toBe("Kota El Scaro");
        expect(response.body.data.province).toBe("Provinsi Witeka");
        expect(response.body.data.country).toBe("Diomedea");
        expect(response.body.data.postal_code).toBe("68173");
    });

    it('should reject to update address if request field is invalid', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(server)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "Jalan Wanderer no.33",
                    city: "Kota El Scaro",
                    province: "Provinsi Witeka",
                    country: "",
                    postal_code: ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject to update address if addressId is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(server)
            .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "Jalan Wanderer no.33",
                    city: "Kota El Scaro",
                    province: "Provinsi Witeka",
                    country: "Toram",
                    postal_code: "98123"
            });

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject to update address if contact is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(server)
            .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "Jalan Wanderer no.33",
                    city: "Kota El Scaro",
                    province: "Provinsi Witeka",
                    country: "Toram",
                    postal_code: "98123"
            });

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to remove address', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(server)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("Ok");
    });

    it('should reject to remove address if address is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(server)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject to remove address if contact is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(server)
            .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});