# sphinx-bridge

**library for applications embedded within Sphinx apps**

### API
```js
import * as sphinx from 'sphinx-bridge'
```
- `sphinx.enable()`: Enable the sphinx library. This function will postMessage to the Sphinx app, requesting authorization, a budget to spend, and the user's pubkey (hex encoded)
- `sphinx.keysend(pubkey, amount)`: Initiate a keysend (pubkey is hex encoded)
- `sphinx.sendPayment(paymentRequest)`: Pay a Lightning invoice
- `sphinx.makeInvoice(amount, memo)`: Create a Lightning invoice
- `sphinx.signMessage(message)`: Request that the Sphinx app signs a message with Lightning private key
- `sphinx.verifyMessage(signature, message)`: Verify a signed message
- `sphinx.topup()`: Show the authorization modal again, so the user can top up their budget for the app
- `sphinx.authorize(challenge)`: Request the Sphinx app to sign a challenge with their Lightning private key
- `sphinx.updated()`: Utility function to let Sphinx app know that something has happened out of band (like a payment has been received), so satoshi balance should be refreshed in app.
