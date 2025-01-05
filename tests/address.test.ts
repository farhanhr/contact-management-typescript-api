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