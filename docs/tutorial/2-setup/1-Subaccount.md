## Overview

This section illustrates setting up the landscape as the first step before deploying your application to BTP. To automate the setup we would suggest using the provided Terraform scripts. The setup can also be done manually using the BTP cockpit aswell.

## Prerequisites

- [Create a Global Account](https://help.sap.com/docs/btp/sap-business-technology-platform/getting-global-account)
- [Install Terraform](https://developer.hashicorp.com/terraform/install#darwin)
- If you prefer to setup the subaccount and services manually through BTP Cockpit follow these
  [steps](https://help.sap.com/docs/btp/sap-business-technology-platform/getting-started-with-trial-account-in-cloud-foundry-environment?q=subaccount%20setup)

## Content of setup using Terraform

The setup comprises the following resources:

- Creation of the SAP BTP subaccount
- Entitlements of services
- Creating service instance in Subaccount
- Creation of CF environment and CF space
- Role collection for CF space

It adds the following entitlements, in addition to the ones which are enabled by default, for the required services:

| Service Name                          | Service Plan     |
|---------------------------------------|------------------|
| SAP HANA Cloud                        | hana             |
| SAP HANA Schemas & HDI Containers     | hdi-shared       |
| Object Store                          | s3-standard      |
| Document Information Extraction       | premium_edition  |
| Cloud Foundry Runtime                 | MEMORY           |

Your BTP space will need at least 4 GB of memory to run the apps which you will deploy later.

## Deploying the resources

To deploy the resources you must:

1. Change the variables in the `samples.auto.tfvars` file to meet your requirements

   > ⚠️ You should pay attention **specifically** to the users defined in the samples.auto.tfvars whether they already exist in your SAP BTP accounts. Otherwise you might get error messages like e.g. `Error: The user could not be found: john.doe@test.com`.

2. Initialize your workspace:

   ```
   terraform init
   ```

3. You can check what Terraform plans to apply based on your configuration:

   ```
   terraform plan
   ```

4. Apply your configuration to provision the resources:

   ```
   terraform apply
   ```

## In the end

You probably want to remove the assets after trying them out to avoid unnecessary costs. To do so execute the following command:

```
terraform destroy
```
