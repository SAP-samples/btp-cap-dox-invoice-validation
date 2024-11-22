## Extending the app
To extend/customize the app, you need to setup the app for local development.

1. Double check that all required packages are installed:

```
npm install -g @sap/cds-dk typescript ts-node
npm run setup
```

2. Create another xsuaa service instance to enforce the same authorization flow while developing locally. The configuration (see `xs-security-dev.json`)
allows the xsuaa to redirect to our locally running app after having authenticated.

```
cf create-service xsuaa application dox-invoice-validation-auth-dev -c xs-security-dev.json
```

3. Your CAP API, which is now going to be running locally, still relies on the same BTP services as when deployed on BTP. To make them accessable,
bind them by executing the following commands from within the `api/` folder:

```
# bind xsuaa service
cds bind -2 dox-invoice-validation-auth-dev

# destination service
cds bind -2  dox-invoice-validation-api-dest

# HANA DB
cds bind -2 dox-invoice-validation-db

# Amazon S3 used as Object Store
cds bind -2 dox-invoice-validation-s3-object-store
```

4. Configure the approuter to use the credentials of your new xsuaa service instance. To do just that, in your `router/dev/` folder
copy the content of `default-services.sample.json` to a new file `default-services.json`. Edit this file and insert the missing _client secret_
and _client id_ from your xsuaa's service key. The key was created with the `cds bind` command above.

5. Lastly, start the whole app (UI, approuter and CAP API) while being at root of the project directory:

```
npm run watch
```

Go to `http://localhost:5000` in your browser; there the approuter should be running and serving the UI.