const { createProxyMiddleware } = require("http-proxy-middleware");

const proxyMiddleware = (target) => createProxyMiddleware({
  target,
  changeOrigin: true,

  onProxyReq(proxyReq, req) {
      console.log(
        `[GATEWAY] ${req.method} ${req.originalUrl} → ${target}${req.originalUrl}`
      );
    },
});

module.exports = proxyMiddleware;