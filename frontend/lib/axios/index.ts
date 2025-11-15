import Axios from "axios";

export function create() {
  //getCookieXsrfToken();
  const instance = Axios.create({
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      /*
      "X-CSRF-TOKEN": csrfToken,
      Referer: document.location.href,
      */
    },
    //xsrfHeaderName: "X-CSRF-TOKEN",
    //withCredentials: true,
    //withXSRFToken: true,
    timeout: 60000,
    maxRedirects: 5,
  });

  return instance;
}
