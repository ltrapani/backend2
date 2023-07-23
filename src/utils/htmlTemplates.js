import config from "../config/config.js";

export const purchaseHtml = (user, cart) => {
  let productsList = "";
  for (const p of cart.products) {
    productsList += `
    <tr>
      <td style="padding-rigth: 70px;">${p.product.title}</td>
      <td style="text-align: center;">${p.quantity}</td>
      <td>$${p.product.price}</td>
    </tr>`;
  }

  return ` 
  <div>
    <h1>${user.first_name} ${user.last_name} thank you very much for your purchase.</h1>
    <p>Details:</p>
    <p>Purchase Code: ${cart.ticket.code}</p>
    <table>
      <thead>
        <tr style="text-align: justify;">
          <th>Title</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${productsList}
      </tbody>
      <tfoot>
        <tr>
          <th style="text-align: start;" colspan="2">Total</th>
          <th>$${cart.ticket.amount}</th>
        </tr>
      </tfoot>
    </table>
    <p>Kind regards. Ecommerce team</p>
  </div>`;
};

export const resetPasswordHtml = (uid) => {
  return `
  <h1>Reset password</h1>
  <p>To reset your password, go to the following <a href="${config.host_url}/reset-password?id=${uid}">link</a></p>
  <p>This link is valid for 1 hour</p>
  `;
};

export const userInactive = (user) => {
  return `
  <h2>Hello ${user.first_name} ${user.last_name}.</h2>
  <p>Your acount was delete for inactivity</p>
  <p>If you want to register again, please go to the next link</p>
  <a href="${config.host_url}/register">Register</a>
    `;
};

export const productDelete = (product) => {
  return `
  <h2>A product you created was deleted.</h2>
  <p>Product detail:</p>
  <ul>
    <li>ID: ${product._id}</li>
    <li>Title: ${product.title}</li>
    <li>Description: ${product.description}</li>
  </ul>`;
};
