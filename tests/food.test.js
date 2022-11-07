import supertest from "supertest";
import { assert } from "chai";
import app from "../app.js";
import { after } from "mocha";

const server = supertest.agent(app);

let token = process.env.JWT_TOKEN;
let food_id = "7ebef72d-a3ed-4474-92eb-aee446a49011";
let updateFoodId, newFoodId;
let newFoodItem = {
  title: "Taco",
  description: "Extra wrappings",
  price: 2000,
};

let updateFoodJson = {
  title: "Taco",
  description: "Extra wrappings and Chilli Pepper.",
  price: 2200,
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
  /*
   * ADD FOOD ENDPOINTS TESTS
   */

  describe("Add Food", function () {
    // Delete it from the db
    after(async function () {
      await server
        .delete(`/api/food/delete/${newFoodId}`)
        .set("Authorization", "Bearer " + token);
    });

    it("Adds a food item successfully", async function () {
      const res = await server
        .post("/api/food/add")
        .set("Authorization", "Bearer " + token)
        .send(newFoodItem);
      newFoodId = res.body.data.uuid;

      assert.exists(res.body);
      assert.equal(res.status, 201);
      assert.isObject(res.body.data);
      assert.equal(res.body.data.title, "Taco");
      assert.equal(res.body.data.description, "Extra wrappings");
      assert.equal(res.body.data.price, 2000);
      assert.isTrue(res.body.success);
    });
  });

  /*
   * GET FOOD ENDPOINTS TESTS
   */

  describe("Get Food Items", function () {
    it("list all food items", async function () {
      const res = await server
        .get("/api/food?page=1")
        .set("Authorization", "Bearer " + token);

      assert.equal(res.status, 200);
      assert.exists(res.body);
      assert.isArray(res.body.foodItems);
      assert.isTrue(res.body.success);
      assert.equal(res.body.currentPage, 1);
      assert.isAbove(res.body.totalPages, 0);
    });

    it("Should fail if the page query parameter is not a number", async function () {
      const res = await server
        .get("/api/food?page=a")
        .set("Authorization", "Bearer " + token);

      assert.equal(res.status, 400);
      assert.isFalse(res.body.success);
      assert.equal(
        res.body.message,
        "The page query parameter must be greater than 0 and must be a number"
      );
    });

    it("Should fail if the page query parameter is not present", async function () {
      const res = await server
        .get("/api/food")
        .set("Authorization", "Bearer " + token);

      assert.equal(res.status, 400);
      assert.isFalse(res.body.success);
    });

    it("Get a single food Item", async function () {
      const res = await server
        .get(`/api/food/${food_id}`)
        .set("Authorization", "Bearer " + token);

      assert.equal(res.status, 200);
      assert.exists(res.body);
      assert.isTrue(res.body.success);
      assert.isObject(res.body.data);
      assert.equal(res.body.data.title, "Blueberry pie");
    });
  });

  /*
   * UPDATE FOOD ENDPOINTS TESTS
   */

  describe("Update Food Item", function () {
    beforeEach(async function () {
      const res = await server
        .post("/api/food/add")
        .set("Authorization", "Bearer " + token)
        .send(newFoodItem);
      updateFoodId = res.body.data.uuid;
    });

    afterEach(async function () {
      await server
        .delete(`/api/food/delete/${updateFoodId}`)
        .set("Authorization", "Bearer " + token);
    });

    it("update food successfully", async function () {
      const res = await server
        .patch(`/api/food/update/${updateFoodId}`)
        .set("Authorization", "Bearer " + token)
        .send(updateFoodJson);

      assert.equal(res.status, 200);
      assert.isTrue(res.body.success);
      assert.equal(
        res.body.data.description,
        "Extra wrappings and Chilli Pepper."
      );
    });
  });
});
