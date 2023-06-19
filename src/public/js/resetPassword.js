const form = document.querySelector("#resetPasswordForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const urlParams = new URL(window.location.toLocaleString()).searchParams;
  const id = urlParams.get("id");

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));
  obj.id = id;

  fetch("/api/users/reset-password", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    result.json().then((json) => {
      if (json.status === "success") {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          text: `Password reset successfully`,
          icon: "success",
          willClose: () => {
            window.location.replace("/");
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
    });
  });
});
