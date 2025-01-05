import { Address } from "@prisma/client";

export type AddressResponse = {
    id: number;
    street?: string | null;
    city?: string | null;
    province?: string | null;
    country: string;
}

export type CreateAddressRequest = {
    contact_id: number;
    street?: string | null;
    city?: string | null;
    province?: string | null;
    country: string;
}

export function toAddressResponse(address: Address): AddressResponse {
    return {
        id: address.id,
        street: address.street,
        city: address.city,
        province: address.province,
        country: address.country,
    }
}