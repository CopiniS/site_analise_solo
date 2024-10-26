export const testAPI = () => {
  event.preventDefault();

  axios({
      method: "post",
      url: `http://localhost:8080/study/auth/login`,
      data: {
          username: "mavifreitas",
          password: "1234567",
          email: "mariavitoria.freitas023@gmail.com"
      },
  })
  .then(function(response) {
      console.log(response);
  })
  .catch(function(error) {
      console.log(error);
  });
}
