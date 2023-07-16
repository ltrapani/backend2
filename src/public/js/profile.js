const imgProfile = document.querySelector("#imgProfile");
const profile = document.querySelector("#profile");
const lastConnection = document.querySelector("#lastConnection");

lastConnection.innerHTML = moment(lastConnection.innerHTML).format(
  "DD MM YYYY - h:mm:ss a"
);

imgProfile.addEventListener("error", (e) => {
  e.target.src = "https://cdn-icons-png.flaticon.com/512/21/21104.png";
  e.onerror = null;
});

const updateProfile = async (id) => {
  const formData = new FormData();

  formData.append("profile", profile.files[0]);

  const data = await fetch(`/api/users/${id}/documents?storage=profile`, {
    method: "POST",
    body: formData,
  });
  const json = await data.json();
  if (json.status === "success") {
    await Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      text: `Uploaded profile file success!`,
      icon: "success",
      willClose: () => {
        window.location.reload();
      },
    });
  }
  if (json.status === "error") {
    await Swal.fire({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      title: `Error`,
      text: `${json?.message}`,
      icon: "error",
    });
  }
};
