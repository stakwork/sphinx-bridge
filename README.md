# sphinx-bridge

**library for application embedded withing Sphinx apps**

### API
```js
import * as sphinx from 'sphinx-bridge'
```
- `sphinx.enable()`: enable the sphinx library. This function will postMessage to the Sphinx app, requesting authorization, a budget to spend, and the user's pubkey (hex encoded)
- `sphinx.keysend(pubkey, amount)`: initiate a keysend
- `sphinx.updated()`: utility function to let Sphinx app know that something has happened out of band (like a payment has been received), so satoshi balance should be refreshed in app.
