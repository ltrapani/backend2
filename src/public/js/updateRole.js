const form = document.querySelector("#updateRoleForm");
const idUser = document.querySelector("#idUser");
const role = document.querySelector("#role");
const listUsers = document.querySelector("#listUsers");
const selectUser = document.querySelector("#selectUser");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const idUser = selectUser.value;

  fetch(`/api/users/premium/${idUser}`, {
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
          willClose: () => {
            location.reload();
          },
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

const getUser = async () => {
  const data = await fetch(`/api/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { users } = await data.json();
  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user._id}</td>
      <td>${user.first_name}</td>
      <td>${user.last_name}</td>
      <td>${user.email}</td>
      <td>
        ${user.role}
      </td>
    `;
    listUsers.append(tr);

    const option = document.createElement("option");
    option.value = user._id;
    option.innerText = user.email;
    selectUser.append(option);
  });
};

getUser();
