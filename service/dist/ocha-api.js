"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = void 0;
const axios = require("axios").default;
const getCartOrders = (authorization, cookie) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://live.ocha.in.th/api/cart/get/asc/";
    const headers = {
        authorization,
        cookie,
    };
    const data = {
        cart_version: 0,
        order_types: [1, 2],
    };
    const res = yield axios({
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
});
const getOrderDetail = (authorization, cookie, cart_ids) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://live.ocha.in.th/api/cart/details/";
    const headers = {
        authorization,
        cookie,
    };
    const data = {
        cart_ids,
    };
    const res = yield axios({
        method: "POST",
        headers,
        data,
        url,
    });
    if (res && res.data && res.data.cart_packs) {
        return res.data.cart_packs;
    }
    return [];
});
exports.getOrders = (authorization, cookie) => __awaiter(void 0, void 0, void 0, function* () {
    const cartList = yield getCartOrders(authorization, cookie);
    if (cartList === [])
        return [];
    const result = yield getOrderDetail(authorization, cookie, cartList);
    return result;
});
//# sourceMappingURL=ocha-api.js.map