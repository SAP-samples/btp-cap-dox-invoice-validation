# BioNTech Invoice Validation

-   Cloud Foundry Environment
-   _Subaccount_ on Business Technology Platform (BTP): [Strategic Customer Engagement CF 2](https://emea.cockpit.btp.cloud.sap/cockpit/#/globalaccount/SA0101006280/subaccount/fe1f07bf-be62-4e4b-9513-20c5359d4ab1/subaccountoverview)
-   _Space_ inside the subaccount: [biontech](https://emea.cockpit.btp.cloud.sap/cockpit/#/globalaccount/SA0101006280/subaccount/fe1f07bf-be62-4e4b-9513-20c5359d4ab1/org/34a7c0a3-97bd-4ce9-bf6d-cbc43585fc09/space/de0a4d0b-a9c5-4d55-b5c7-c99a1fed83c6/applications)

You need to be a member of that space.

## Tech Stack

-   [@sap/approuter]() acts as central entry point for the rest of the application. It abstracts the
    authentication/authorization flow through the interaction with the
    [XSUAA](https://sap.github.io/cloud-sdk/docs/java/guides/cloud-foundry-xsuaa-service) service
-   [UI5 Webcomponents for React](https://sap.github.io/ui5-webcomponents-react/?path=/docs/getting-started--docs) (_might go back to standard UI5_) with _Typescript_
    -   Leverages [Vite](https://vitejs.dev/) as frontend-tooling for a development server and to build the UI assets for production
-   Cloud Programming Model ([CAP](https://cap.cloud.sap/docs/)) as the main backend API
-   HANA DB

## Set up the dev environment

1. Clone the git repository using the `http` protocol. For that, you will need a [Personal Access Token ](https://github.tools.sap/settings/tokens). Then change directory to
   the cloned project directory.

```
git clone https://github.tools.sap/PAA-SCE-EMEA/biontech-invoicing.git

cd biontech-invoicing
```

2. Install `Node` 18.x.x which is required. To manage multiple Node versions you can use [NVM](https://github.com/nvm-sh/nvm). To check your current Node version, do:

```
node --version
```

3. Install the following packages globally. Here `npm` (Node Package Manager) is used which is automatically installed with `Node` in the previous step.

```
npm install -g @sap/cds-dk typescript ts-node
```

4. Install the remaining, necessary `npm` packages locally while being at the root of your project directory. This also creates the entities types the CAP API needs to run:

```
npm run setup --legacy-peer-deps
```

5. Install the Cloud Foundry [CLI](https://github.com/cloudfoundry/cli#downloads). Version 8 will do. Then log in to the `biontech` space on BTP:

```
cf login
```

6. Change directory to `api/` and bind the used BTP services:

```
# bind xsuaa service
cds bind -2 biontech-invoicing-api-auth-dev:key

# destination service
cds bind -2 biontech-invoicing-api-dest

# HANA DB
cds bind -2 biontech-invoicing-api-db

# Amazon S3 used as Object Store
cds bind -2 biontech-invoicing-s3-object-store:bnt-s3-key
```

7. Change directory to `router/dev/` and copy content of `default-services.sample.json` to a new file `default-services.json`. Edit this file and add the missing client secret
   of the xsuaa service. To get the client secret, do:

```
cf service-key biontech-invoicing-api-auth-dev key
```

8. Start the UI, approuter and CAP API while being at root of the project directory:

```
npm run watch
```

Open your web browser at `http://localhost:5000`. There the approuter should be running and serve the UI. For the locally running CAP API to have access to the data in the HANA Database, you
need to be connected to the corporate network. The BIG-IP Edge Client (f5) VPN or equivalent will do. Note that the GlobalProtect VPN is not enough in this case.

## Deployment

In a fresh subaccount you will need to first do an initial deployment before you can proceed to setting up the dev environment. This is so that
the required services are already running in the BTP space.

First, log in to the `biontech` space:

```
cf login
```

To build the whole application and then deploy it to the `biontech` space, run at root level of the project directory:

```
npm run deploy
```
