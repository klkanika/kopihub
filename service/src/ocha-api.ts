const axios = require("axios").default;

const getCartOrders = async (authorization, cookie) => {
  const url = "https://live.ocha.in.th/api/cart/get/asc/";
  const headers = {
    authorization,
    cookie,
  };
  const data = {
    cart_version: 0,
    order_types: [1, 2],
  };

  const res = await axios({
    method: "POST",
    headers,
    data,
    url,
  });

  if (res && res.data && res.data.cart_list) {
    const cartList = res.data.cart_list.map((c) => c.server_id);
    return cartList;
  }
  return [];
};

const getOrderDetail = async (authorization, cookie, cart_ids) => {
  const url = "https://live.ocha.in.th/api/cart/details/";
  const headers = {
    authorization,
    cookie,
  };
  const data = {
    cart_ids,
  };
  const res = await axios({
    method: "POST",
    headers,
    data,
    url,
  });

  if (res && res.data && res.data.cart_packs) {
    return res.data.cart_packs;
  }
  return [];
};

export const getOrders = async (authorization, cookie) => {
  const cartList = await getCartOrders(authorization, cookie);
  if (cartList === []) return [];
  const result = await getOrderDetail(authorization, cookie, cartList);
  return result;
};