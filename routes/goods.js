const express = require('express');
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
    goodsId: 2,
    name: "상품 2",
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

/**
 * uri: /api 
 */

const Goods = require("../schemas/goods.js");
const Cart = require("../schemas/cart.js");

router.get("/", (req, res) => {
  res.send("default url for goods.js GET Method");
});

router.get("/about", (req, res) => {
  res.send("goods.js about PATH");
});

// get all goods
router.get("/goods", (req, res) => {
  // FIXME: return all goods from DB
  res.json({ goods: goods});
});

// create new goods
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

// get specific goods
router.get("/goods/:goodsId", (req, res) => {
  // return that goodsId == req.params.goodsId
  res.json({ goods: goods.find((goods) => goods.goodsId == req.params.goodsId) });
});

// add goods to cart
router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  console.log("quantity: ", quantity, "goodsId: ", goodsId);

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (existsCarts.length) {
    return res.json({ success: false, errorMessage: "이미 장바구니에 존재하는 상품입니다." });
  }

  await Cart.create({ goodsId: Number(goodsId), quantity: quantity });

  res.json({ result: "success" });
});

module.exports = router;