// const url = 'http://localhost:3000/like/product/2'

const axios = require("axios");
const hostUrl = "http://localhost:3000/";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

async function insertFakerProductLikesToDB() {
  axios
    .post(hostUrl + `like/product/${getRandomInt(1, 300)}`, {
      userId: getRandomInt(1, 200),
    })
    .then(function (response) {
      console.log(response.status);
    })
    .catch(function (error) {
      console.log("!!", error.response.data);
    });
}

//  faker product_like 삽입 : 1000
// 600개는 상품 id가 1~1500. 400개는 상품 id를 1~300으로 제한

// for (let i = 0; i < 100; i++) {
//   insertFakerProductLikesToDB();
// }
