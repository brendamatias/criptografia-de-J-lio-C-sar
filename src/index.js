require("dotenv").config();
const fs = require("fs");
const sha1 = require("js-sha1");
const service = require("./service");

main();
async function main() {
  try {
    // 1 - Armazena os dados no arquivo answer.json
    const { data } = await service.getEncrypt();

    fs.writeFileSync("./answer.json", JSON.stringify(data));

    // 2 - Decifra o texto e atualizando o arquivo answer.json
    let encrypt = data.cifrado;
    let number = data.numero_casas;

    let index;
    let letter;
    let decrypt = "";

    for (let i = 0; i < encrypt.length; i++) {
      letter = encrypt[i].charCodeAt();

      if (letter >= 97 && letter <= 122) {
        index = (letter - 97 - number) % 26;

        if (index < 0) {
          decrypt += String.fromCharCode(123 + index);
        } else {
          decrypt += String.fromCharCode(index + 97);
        }
      } else {
        decrypt += String.fromCharCode(letter);
      }
    }

    // 3 - Encriptografa o texto decifrado para sha1 */
    const encryptMessage = sha1(decrypt);
    const updateJson = {
      ...data,
      decifrado: decrypt,
      resumo_criptografico: encryptMessage
    };

    fs.writeFileSync("answer.json", JSON.stringify(updateJson));

    // 4 - Envia os dados para a API */
    const response = await service.postDecrypt("./answer.json");
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}