const form = document.querySelector("#updateRoleForm");
const idUser = document.querySelector("#idUser");
const role = document.querySelector("#role");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  fetch(`/api/users/premium/${idUser.value}`, {
    method: "POST",
    body: JSON.stringify({ role: role.value }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => {
    data.json().then((result) => {
      if (result.status === "success") {
        idUser.value = "";
        role.value = "";
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          text: `${result.message}`,
          icon: "success",
        });
      }
      if (result.status === "error") {
        Swal.fire({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          title: `Error`,
          text: `${result?.message}`,
          icon: "error",
        });
      }
    });
  });
});
