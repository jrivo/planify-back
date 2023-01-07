import { Test, TestingModule } from "@nestjs/testing";
import { ActivityService } from "./activity.service";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

describe("ActivityService", () => {
  let service: ActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityService],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // it("should return the list of activities", async () => {
  //   const findMany = jest.fn().mockResolvedValue([
  //     {
  //       id: 1,
  //       name: "Activity 1",
  //       place: {
  //         owner: {
  //           id: 1,
  //           firstName: "John",
  //           lastName: "Doe",
  //         },
  //       },
  //       medias: [
  //         {
  //           id: 1,
  //           url: "https://cdn.example.com/activity-1.jpg",
  //         },
  //       ],
  //       address: {
  //         id: 1,
  //         street: "Main St",
  //         streetNumber: "123",
  //         city: "New York",
  //         postalCode: "10001",
  //         country: "USA",
  //         region: "NY",
  //       },
  //       rating: 4,
  //     },
  //     {
  //       id: 2,
  //       name: "Activity 2",
  //       place: {
  //         owner: {
  //           id: 2,
  //           firstName: "Jane",
  //           lastName: "Doe",
  //         },
  //       },
  //       medias: [
  //         {
  //           id: 2,
  //           url: "https://cdn.example.com/activity-2.jpg",
  //         },
  //       ],
  //       address: {
  //         id: 2,
  //         street: "Second Ave",
  //         streetNumber: "456",
  //         city: "New York",
  //         postalCode: "10002",
  //         country: "USA",
  //         region: "NY",
  //       },
  //       rating: 5,
  //     },
  //   ]);
  //   prisma.activity.findMany = findMany;

  //   const count = jest.fn().mockResolvedValue(2);
  //   prisma.place.count = count;

  //   const queries = {
  //     category: "1",
  //     merchant: 1,
  //     search: "activity",
  //     page: 1,
  //     limit: 10,
  //   };
  //   const result = await service.getAll(queries);

  //   expect(result).toEqual({
  //     activities: [
  //       {
  //         id: 1,
  //         name: "Activity 1",
  //         ownerFirstName: "John",
  //         ownerLastName: "Doe",
  //         ownerId: 1,
  //         medias: [
  //           {
  //             id: 1,
  //             url: "https://cdn.example.com/activity-1.jpg",
  //           },
  //         ],
  //         address: {
  //           id: 1,
  //           street: "Main St",
  //           streetNumber: "123",
  //           city: "New York",
  //           postalCode: "10001",
  //           country: "USA",
  //           region: "NY",
  //         },
  //         rating: 4,
  //       },
  //       {
  //         id: 2,
  //         name: "Activity 2",
  //         ownerFirstName: "Jane",
  //         ownerLastName: "Doe",
  //         ownerId: 2,
  //         medias: [
  //           {
  //             id: 2,
  //             url: "https://cdn.example.com/activity-2.jpg",
  //           },
  //         ],
  //         address: {
  //           id: 2,
  //           street: "Second Ave",
  //           streetNumber: "456",
  //           city: "New York",
  //           postalCode: "10002",
  //           country: "USA",
  //           region: "NY",
  //         },
  //         rating: 3,
  //       },
  //     ],
  //     totalPages: 2,
  //   });
  // });

  // it('should return the activity with the specified id', async () => {
  //   const id = "14";
  //   const expectedActivity = {
  //     "id": 14,
  //     "name": "Movie",
  //     "mainImageId": null,
  //     "description": "Come watch a movie with us",
  //     "date": "2022-12-09T09:39:53.824Z",
  //     "createdAt": "2022-12-09T09:41:31.671Z",
  //     "updatedAt": "2022-12-17T10:09:01.326Z",
  //     "placeId": 3,
  //     "price": 15,
  //     "addressId": 8,
  //     "medias": [
  //         {
  //             "id": 17,
  //             "url": "https://planify.b-cdn.net/default/dhlXDQjf0iAKWl6UwEY1.undefined"
  //         }
  //     ],
  //     "address": {
  //         "id": 8,
  //         "street": "Rue Oberkampf",
  //         "streetNumber": "123",
  //         "city": "Paris",
  //         "postalCode": "75011",
  //         "country": "France",
  //         "region": "Île-de-France",
  //         "createdAt": "2022-12-08T22:54:12.254Z",
  //         "updatedAt": "2022-12-11T21:48:00.479Z",
  //         "latitude": 48.8661874,
  //         "longitude": 2.3790752,
  //         "googleAddressId": "ChIJE9ka-O9t5kcRxCHlakhDl74"
  //     },
  //     "rating": null,
  //     "ownerFirstName": "steph",
  //     "ownerLastName": "brown",
  //     "ownerId": 2
  // };

  //   jest.spyOn(prisma.activity, 'findUnique').mockResolvedValue(expectedActivity);

  //   const result = service.getById(id);

  //   expect(result).toEqual(expectedActivity);
  // });
});
