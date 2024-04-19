
In your subaccount you need to first do an initial deployment of the app. At the same time this creates the required service instances,
which are described in the _mta.yaml_ deployment descriptor file. We leverage the following command-line tools, which you need to install:

- Cloud MTA Build Tool ([MBT](https://sap.github.io/cloud-mta-build-tool/)) to build the application (app) and get it ready for deployment
- Cloud Foundry CLI ([CF CLI](https://github.com/cloudfoundry/cli/wiki/V8-CLI-Installation-Guide))

Next, make sure you have [Node](https://nodejs.org/en) installed. We built this sample with Node version 18, so this is the version we recommend here.
To manage multiple Node versions you can use [NVM](https://github.com/nvm-sh/nvm). To check your current Node version, do:
```
node --version
```

First, clone the git repository, and change directory to the cloned project directory.
```
git clone https://github.com/SAP-samples/btp-cap-dox-invoice-validation.git

cd btp-cap-dox-invoice-validation 
```

Now, to deploy the app, first login in to your subaccount via the command-line with: 
```
cf login
```

Second, issue the following command (while being at root level of your project directory) to build and deploy the whole app at once to your subaccount:
The _npm_ (Node Package Manager) command was automatically installed alongside Node previously.
```
npm run deploy
```

Last but not least the destination has to be created (manually in this case), which our app uses to connect to the DOX service.
For that first create a service key for the destination service, and call it _dox-iv-api-dest-key_. You can find the credentials to enter for the placeholders in this service key.

To create it, log in to your SAP BTP cockpit and navigate to your subaccount. In the navigation area therein, go to Connectivity -> Destinations and select _Create Destination_.
Note that the name of the destination needs to be precisely _DOX_PREMIUM_INVOICE_VALIDATION_. This is what the app is going to look for later on.
```
Name: DOX_PREMIUM_INVOICE_VALIDATION
Description: Connection to Document Information Extraction (DOX) service
URL: <URL-PROPERTY-IN-DOX-SERVICE-KEY>/document-information-extraction/v1 # make sure to add /v1!
Type: HTTP
ProxyType: Internet
Authentication: OAuth2ClientCredentials
tokenServiceURL: <AUTH-URL-IN-DOX-SERVICE-KEY>/oauth/token
clientId: <CLIENT-ID-IN-DOX-SERVICE-KEY>
clientSecret: <CLIENT-SECRET-IN-DOX-SERVICE-KEY>
# Additional Properties:
URL.headers.Content-Type: application/json
HTML5.DynamicDestination: true
```

To open now the frontend part of the app, open the link shown under the dox-invoice-validation under applications in your BTP space.
You should then see the app running in your browser.