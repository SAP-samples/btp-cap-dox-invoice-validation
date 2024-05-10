# BTP and Cloudfoundry provider

terraform {
    required_providers {
        btp = {
            source  = "SAP/btp"
            version = "1.3.0"
        }
        cloudfoundry = {
            source  = "cloudfoundry-community/cloudfoundry"
            version = "0.53.1"
        }
    }
}

# --- BTP environment

provider "btp" {
# Required parameters
    globalaccount  = var.globalaccount
# Optional parameters
    cli_server_url = var.btp_cli_url
    username       = var.btp_username
    password       = var.btp_password
}

provider "cloudfoundry" {
# Required parameters
    api_url  = var.cf_api_url
    user     = var.cf_username
    password = var.cf_password
}