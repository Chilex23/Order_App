import supertest from "supertest";
import { assert } from "chai";
import app from "../app.js";

const server = supertest.agent(app);

let token = process.env.JWT_TOKEN;

let newOrderId;

let newOrder = {
  items: [
    {
      name: "Taco",
      price: 2000,
      quantity: 2,
    },
  ],
};

const initialOrder = async function () {
  let data = await server
    .post("/api/orders/create")
    .set("Authorization", "Bearer " + token)
    .send(newOrder);
  return data;
};

describe("Orders Tests", function () {
  afterEach(async function () {
    await server
      .delete(`/api/orders/delete/${newOrderId}`)
      .set("Authorization", "Bearer " + token);
  });

  /*
   * CREATE NEW ORDER ENDPOINT TEST
   */

  it("should add a new order successfully", async function () {
    const res = await initialOrder();
    newOrderId = res.body.data.uuid;

    assert.equal(res.status, 201);
    assert.isTrue(res.body.success);
    assert.equal(res.body.ordered_by, "Chilex24");
    assert.equal(res.body.data.items[0].name, "Taco");
    assert.equal(res.body.data.total_price, 4000);
  });

  /*
   * GET AN ORDER FOR PROVIDED ID ENDPOINT TEST
   */

  it("should get an order for an id for admin privileges", async function () {
    const init = await initialOrder();
    newOrderId = init.body.data.uuid;

    const res = await server
      .get(`/api/orders?id=${newOrderId}`)
      .set("Authorization", "Bearer " + token);

    assert.equal(res.status, 200);
    assert.isTrue(res.body.success);
    assert.equal(res.body.data.ordered_by, "Chilex24");
    assert.equal(res.body.data.items[0].name, "Taco");
    assert.equal(res.body.data.total_price, 4000);
  });

  /*
   *LIST ALL ORDERS ENDPOINT TEST
   */

  it("should list all orders for admin privileges", async function () {
    const init = await initialOrder();
    newOrderId = init.body.data.uuid;

    const res = await server
      .get(`/api/orders/all?page=1`)
      .set("Authorization", "Bearer " + token);

    assert.equal(res.status, 200);
    assert.isTrue(res.body.success);
    assert.isArray(res.body.orders);
    assert.isAbove(res.body.orders.length, 0);
    assert.equal(res.body.currentPage, 1);
    assert.isAbove(res.body.totalPages, 0);
  });

  /*
   * LIST ALL ORDERS PLACED BY A USER ENDPOINT TEST
   */

  it("should get all orders placed by a user", async function () {
    const init = await initialOrder();
    newOrderId = init.body.data.uuid;

    const res = await server
      .get(`/api/orders/Chilex24?page=1`)
      .set("Authorization", "Bearer " + token);

    assert.equal(res.status, 200);
    assert.isTrue(res.body.success);
    assert.isArray(res.body.orders);
    assert.isAbove(res.body.orders.length, 0);
    assert.equal(res.body.currentPage, 1);
    assert.isAbove(res.body.totalPages, 0);
  });

  /*
   * CHANGE THE DELIVERY STATE OF AN ORDER ENDPOINT TEST
   */
  it("should change an order state to delivered for admin privileges", async function () {
    const init = await initialOrder();
    newOrderId = init.body.data.uuid;

    const res = await server
      .patch(`/api/orders/deliver/${newOrderId}`)
      .set("Authorization", "Bearer " + token)
      .send({
        state: 1,
      });

    assert.equal(res.status, 200);
    assert.isTrue(res.body.success);
    assert.equal(res.body.message, "Delivered");
  });
});
