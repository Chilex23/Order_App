import supertest from "supertest";
import { assert, expect } from "chai";
import app from "../app.js";
import { after } from "mocha";

const server = supertest.agent(app);

let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzNGU5N2Q0OGYyN2I5N2ZhOTA1OGY1YiIsInVzZXJuYW1lIjoiQ2hpbGV4MjQiLCJyb2xlIjoiQWRtaW4ifSwiaWF0IjoxNjY2MjA5OTYxLCJleHAiOjE2Njg4MDE5NjF9.E8VKC8RpDBbzCh3tgY46-N44vnuqyzkm9bzFPw-Hikc";

let newFoodItem = {
  title: "Taco",
  description: "Extra wrappings",
  price: 2000,
};

describe("User page", function () {
  describe("Get user profile", function () {
    it("Shows the user profile", async function () {
      const res = await server
        .get("/api/users/profile")
        .set("Authorization", "Bearer " + token);
      assert.equal(res.status, 200);
      assert.isObject(res.body);
      assert.equal(res.body.user.username, "Chilex24");
    });
  });
});

describe("Food Test", function () {
  describe("Add Food", function () {
    // Delete it from the db
    after(async function () {
      await server
        .delete("/api/food/delete/Taco")
        .set("Authorization", "Bearer " + token);
    });

    it("Adds a food item successfully", async function () {
      const res = await server
        .post("/api/food/add")
        .set("Authorization", "Bearer " + token)
        .send(newFoodItem);
      assert.exists(res.body);
      assert.equal(res.status, 201);
      assert.isObject(res.body.data);
      assert.equal(res.body.data.title, "Taco");
      assert.equal(res.body.data.description, "Extra wrappings");
      assert.equal(res.body.data.price, 2000);
      assert.isTrue(res.body.success);
    });
  });
});
