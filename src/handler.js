const fetch = require("node-fetch");
const { PATHS } = require("./config/paths");
var phones = [];
var response = [];

class handler {
  static async fetchApi(event) {
    var items = await fetch(PATHS.PHONE_SEARCH);
    phones = await items.json();

    do {
      await handler.check();
    } while (phones.length > 0);
    return response;
  }

  static async check() {
    return await Promise.all(
      phones.map(async (phone) => {
        var requestById = await fetch(PATHS.PHONE_CHECK + `${phone.id}`);
        if (requestById.status !== 429) {
          var phoneChecked = await requestById.json();
          if (phoneChecked !== "Not found") {
            response.push(phone);
          }
          phones = phones.filter(function (elm) {
            return elm.id !== phone.id;
          });
        }
      })
    );
  }
}
module.exports = handler;
