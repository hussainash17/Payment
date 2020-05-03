const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const stripe = require('stripe')('Secret_key');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, './views')));

app.post("/charge", (req, res) => {
    try {
        stripe.customers
            .create({
                name: req.body.name,
                email: req.body.email,
                source: req.body.stripeToken
            })
            .then(customer =>
                stripe.charges.create({
                    amount: req.body.amount * 100,
                    currency: "usd",
                    customer: customer.id
                })
            )
            .then(() => res.render("completed.html"))
            .catch(err => console.log(err));
    } catch (err) {
        res.send(err);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is running...'));