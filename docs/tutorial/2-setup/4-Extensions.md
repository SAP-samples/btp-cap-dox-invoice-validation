## Extending the app
To extend/customize the app, you need to setup the app for local development.

1. Double check that all required packages are installed:

```
npm install -g @sap/cds-dk typescript ts-node
npm run setup
```

2. Your CAP API, which is now going to be running locally, still relies on the same BTP services as during deployment. Therefore, you need to bind them. The suffixes after the
colons (:) represent the service keys of the service instances. You can create them in your BTP cockpit, when you click on a service instance and then on 'Create'. Execute the binding commands
from within the `api/` folder.
```
# bind xsuaa service
cds bind -2 dox-invoice-validation-auth-dev:dox-iv-auth-dev-key

# destination service
cds bind -2  dox-invoice-validation-api-dest:dox-iv-api-dest-key

# HANA DB
cds bind -2 dox-invoice-validation-db:dox-invoice-validation-db-key

# Amazon S3 used as Object Store
cds bind -2 dox-invoice-validation-s3-object-store:dox-invoice-validation-s3-key
```

3. Configure the approuter to use the credentials of your XSUAA service instance (which was created during deployment). To do just that, cd into the `router/dev/` folder
and copy content of `default-services.sample.json` to a new file `default-services.json`. Edit this file and insert the missing _client secret_ and _client id_
from your XSUAA's service key. To display the contents of the service key, do:

```
cf service-key dox-invoice-validation-auth-dev dox-iv-auth-dev-key
```

4. Lastly, start the whole app (UI, approuter and CAP API) while being at root of the project directory:

```
npm run watch
```

Go to `http://localhost:5000` in your browser; there the approuter should be running and serving the UI.