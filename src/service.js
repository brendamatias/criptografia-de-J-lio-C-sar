const axios = require("axios");
const fs = require("fs");

var FormData = require("form-data");

const getData = `https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${process.env.TOKEN}`;
const saveData = `https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${process.env.TOKEN}`;

exports.getEncrypt = () => axios.get(getData).then(response => response);

exports.postDecrypt = file => {
  const form = new FormData();
  form.append('answer', fs.createReadStream(file));

  return axios
    .post(saveData, form, { headers: form.getHeaders() })
    .then(response => response);
};
