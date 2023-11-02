const express = require("express");
const router = express.Router();

// temp data: before use DB
const goods = [
  {
    goodsId: 4,
    name: "상품 4",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
    category: "drink",
    price: 0.1,
  },
  {
    goodsId: 3,
    name: "상품 3",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
    category: "drink",
    price: 2.2,
  },
  {
    goodsId: 5,
    name: "상품 5",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
    category: "drink",
    price: 0.11,
  },
  {
    goodsId: 1,
    name: "상품 1",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
    category: "drink",
    price: 6.2,
  },
];

const Goods = require("../schemas/goods.js");
const Cart = require("../schemas/cart.js");

/**
 * uri: /api
 */

router.get("/", (req, res) => {
  res.send("default url for goods.js GET Method");
});

router.get("/about", (req, res) => {
  // add all goods into db
  goods.forEach((item) => {
    Goods.create(item);
  });

  res.send("goods.js about PATH");
});

/**
 * 상품 API
 */

router.get("/goods", async (req, res) => {
  const goods = await Goods.find({});
  if (goods.length) {
    res.status(404).json({ message: "goods not found" });
  }

  res.json({ goods: goods });
});

router.post("/goods", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });
  if (goods.length) {
    return res.status(409).json({ message: "already goodsId exists" });
  }

  try {
    const newGoods = await Goods.create({
      goodsId,
      name,
      thumbnailUrl,
      category,
      price,
    });
    res.json({ goods: newGoods });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/goods/:goodsId", (req, res) => {
  // return that goodsId == req.params.goodsId
  res.json({
    goods: goods.find((goods) => goods.goodsId == req.params.goodsId),
  });
});

/**
 * 장바구니 API
 */

router.get("/goods/carts", async (req, res) => {
  const carts = await Cart.find({});
  const goodsIds = carts.map((cart) => cart.goodsId);

  const goods = await Goods.find({ goodsId: goodsIds });

  const results = carts.map((cart) => {
    return {
      quantity: cart.quantity,
      goods: goods.find((item) => item.goodsId === cart.goodsId)
    };
  });

  res.json({
    carts: results,
  });
});

router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  console.log("quantity: ", quantity, "goodsId: ", goodsId);

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (existsCarts.length) {
    return res.json({
      success: false,
      errorMessage: "이미 장바구니에 존재하는 상품입니다.",
    });
  }

  if (quantity <= 0) {
    return res.json({
      success: false,
      errorMessage: "상품의 개수는 1개 이상이어야 합니다.",
    });
  }

  await Cart.create({ goodsId: Number(goodsId), quantity: quantity });

  res.json({ result: "success" });
});

router.put("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (!existCarts.length) {
    return res.json({
      success: false,
      errorMessage: "장바구니에 존재하지 않는 상품입니다.",
    });
  }

  if (quantity <= 0) {
    return res.json({
      success: false,
      errorMessage: "상품의 개수는 1개 이상이어야 합니다.",
    });
  }

  await Cart.updateOne({ goodsId: Number(goodsId) }, { quantity: quantity });
  res.json({ success: true });
});

router.delete("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  
  const existCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (existCarts.length) {
    await Cart.deleteOne({ goodsId: Number(goodsId) });
  }

  res.json({ success: true });
});

module.exports = router;
