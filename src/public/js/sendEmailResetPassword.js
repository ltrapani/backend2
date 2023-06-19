const form = document.querySelector("#resetPasswordForm");
const email = document.querySelector("#email");
const btnRestPasswordEmail = document.querySelector("#btnRestPasswordEmail");
const spinner = document.querySelector("#spinner");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  btnRestPasswordEmail.classList.add("disabled");
  spinner.classList.remove("visually-hidden");

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  fetch("/api/users/send-email-reset-password", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    spinner.classList.add("visually-hidden");
    result.json().then((json) => {
      if (json.status === "success") {
        email.value = "";
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          text: `${json.message}`,
          icon: "success",
          willClose: () => {
            window.location.replace("/login");
          },
        });
      }
      if (json.status === "error") {
        Swal.fire({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          title: `Error`,
          text: `${json?.message}`,
          icon: "error",
        });
      }
      btnRestPasswordEmail.classList.remove("disabled");
    });
  });
});
