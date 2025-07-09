const getCookies = (cookieStr) =>
  cookieStr.split(";")
    .map(str => str.trim().split(/=(.+)/))
    .reduce((acc, curr) => {
        acc[curr[0]] = curr[1];
        return acc;
    }, {})

function checkIfSignedUp() {
    var cookies = getCookies(document.cookie);
    var cookiesKeys = Object.keys(cookies);
    if (cookiesKeys.includes("username") && cookiesKeys.includes("password")) {
        window.location = "chat.html";
    } else {
        window.location = "signup.html";
    }
}
