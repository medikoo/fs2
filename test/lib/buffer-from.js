"use strict";

module.exports = function (t, a) { a(Buffer.isBuffer(t("data")), true); };
