const upload = document.querySelector("#upload");
const identification = document.querySelector("#identification");
const address = document.querySelector("#address");
const statusCount = document.querySelector("#statusCount");

const uploadFiles = async (id) => {
  const formData = new FormData();

  formData.append("identification", identification.files[0]);
  formData.append("address", address.files[0]);
  formData.append("statusCount", statusCount.files[0]);

  const data = await fetch(`/api/users/${id}/documents?storage=documents`, {
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
      text: `Uploaded files success!`,
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
