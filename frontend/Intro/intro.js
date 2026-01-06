import { apiLogin } from "../js/api.js";

const btn = document.getElementById("loginBtn");
const msg = document.getElementById("message");

btn.onclick = async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if(!username || !password) {
        msg.innerText = "Please fill in all fields";
        return;
    }

    try {
        const res = await apiLogin(username, password);
        const text = await res.text();

        if(res.ok) {
            msg.style.color = "green";
            msg.innerText = text + ". Redirecting to home...";
            sessionStorage.setItem("username", username);
            setTimeout(() => {
                window.location.href = "../home/home.html";
            }, 1000);
        } else {
            msg.style.color = "red";
            msg.innerText = text;
        }
    } catch (e) {
        msg.style.color = "red";
        msg.innerText = "Error connecting to server";
    }
};
