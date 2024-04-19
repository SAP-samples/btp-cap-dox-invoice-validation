
To get the local development setup up and running, you will need to install a few more packages and bind the used BTP services
to the locally running Cloud Programming Model ([CAP](https://cap.cloud.sap/docs/)) backend.

Install the following packages globally.
```
npm install -g @sap/cds-dk typescript ts-node
```

Install the remaining, necessary npm packages locally while being at the root of your project directory. This also creates the entities types the CAP backend needs to run:
Explain legacy-peer-deps.
```
npm run setup --legacy-peer-deps
```

Change directory to _api/_ and bind the used BTP services. Each suffix after the colon (:) is the name of the respective service key, which you
need to create in your BTP cockpit.

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

7. Change directory to _router/dev/_ and copy content of _default-services.sample.json_ to a new file _default-services.json_. Edit this file and add the missing client secret
   of the xsuaa service from its service key. To display the contents of the service key, do:

```
cf service-key dox-invoice-validation-auth-dev dox-iv-auth-dev-key
```

8. Start the UI, approuter and CAP API while being at root of the project directory:

```
npm run watch
```

Open your web browser at `http://localhost:5000`. There the approuter should be running and serve the UI.