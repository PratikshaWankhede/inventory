const router = require("express").Router();
const { SERVICES } = require("../config/env");
const proxyMiddleware = require("../proxy/service.proxy");

router.use("/api", proxyMiddleware(SERVICES.AUTH));
router.use("/products", proxyMiddleware(SERVICES.PRODUCT));

module.exports = router;
