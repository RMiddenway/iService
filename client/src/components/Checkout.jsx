import StripeCheckout from "react-stripe-checkout";

const Checkout = ({ cost, title }) => {
  const makePayment = (token) => {
    const body = { token, cost: cost, title: title };
    const headers = { "Content-Type": "application/json" };

    return fetch("http://localhost/5100/payment", {
      method: "post",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log("[RESPONSE", response);
        const { status } = response;
        console.log("[STATUS]", status);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <StripeCheckout
        stripeKey="pk_test_51JZxHLITf9d2Jqkr39f00ldJJ3Mp6ID95W3BcRBnhHTugXhaXDVjYghwDcERnPkeo8ZbXGiK2oCceTetqpALEcCG00t43P0MLg"
        token={makePayment}
        name={`Pay your expert for ${title}`}
        amount={cost * 100}
      />
    </>
  );
};

export default Checkout;
