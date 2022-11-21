import axios from "axios";

export const NewNotiUtil = async (
  username: string | string[],
  content: string,
  type?: string,
  img?: string
) => {
  let payload: any = {};

  payload = {
    content: content,
    type: type ?? null,
    image: img ?? null,
  };
  if (typeof username == "string") {
    return axios
      .post(`http://localhost:8080/noti/${username}`, payload)
      .then((r) => {
        return r.data;
      })
      .catch((e) => {
        console.log("err ", e);
        return false;
      });
  } else {
    for (let user of username) {
      axios
        .post(`http://localhost:8080/noti/${user}`, payload)
        .then((r) => {
          return r.data;
        })
        .catch((e) => {
          console.log("err ", e);
          return false;
        });
    }
  }
};
