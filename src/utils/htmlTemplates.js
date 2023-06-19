export const purchaseHtml = (code) => {
  return ` 
  <div>
    <h1>Muchas gracias por tu compra.</h1>
    <p>El codigo de tu compra es: ${code}</p>
    <strong>Saludos coordiales.</strong>
  </div>`;
};

export const resetPasswordHtml = (uid) => {
  return `
  <h1>Reset password</h1>
  <p>To reset your password, go to the following <a href="http://localhost:8080/reset-password?id=${uid}">link</a></p>
  <p>This link is valid for 1 hour</p>
  `;
};
