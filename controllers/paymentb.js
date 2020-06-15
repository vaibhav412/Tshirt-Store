var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "merchantId",
  publicKey: "publicKey",
  privateKey: "privateKey"
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.payment_method_nonce;

  let amountFromTheClient = req.body.amount;
  gateway.transaction.sale({
    amount: amountFromTheClient,
    payment_method_nonce: nonceFromTheClient,

    options: {
      submitForSettlement: true
    }
  },
    function (err, result) {
      if (err) {
        res.status(500).send(error);
      } else {
        res.send(result);
      }
    }
  );
};