
In your subaccount you need to first do an initial deployment of the app. At the same time this creates the required service instances,
which are described in the _mta.yaml_ deployment descriptor file. We leverage the following command-line tools, which you need to install:

- Cloud MTA Build Tool ([MBT](https://sap.github.io/cloud-mta-build-tool/)) to build the application (app) and get it ready for deployment
- Cloud Foundry CLI ([CF CLI](https://github.com/cloudfoundry/cli/wiki/V8-CLI-Installation-Guide))

Last but not least you need to install Node. We built this sample with Node version 18, so this is the version we recommend here.

Now, to deploy the app, first login in to your subaccount via the command-line with: 
```
cf login
```

Second, issue the following command (while being at root level of your project directory) to build and deploy the whole app at once to your subaccount:

```
npm run deploy
```