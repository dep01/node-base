// const axios = require("axios");
import axios from "axios";

async function get(uri = "") {
  const response = await axios.get(uri);
  let html = "";
  if (response.status === 200) {
    html = response.data;
  }
  return html;
}
export{
    get
}

