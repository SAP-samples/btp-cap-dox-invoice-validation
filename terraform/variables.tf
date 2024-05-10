# Provider setup
## BTP Credentials
variable "btp_cli_url" {
    type        = string
    description = "BTP CLI server url"
    default     = "<BTP_CLI_URL>"
}

variable "btp_username" {
    type        = string
    description = "Your BTP username"
    sensitive   = false
    default     = "<BTP_USERNAME>"
}

variable "btp_password" {
    type        = string
    description = "Your BTP password"
    sensitive   = true
    default     = "<BTP_PASSWORD>"
}

## Cloudfoundry credentials
variable "cf_username" {
    type        = string
    description = "Your Cloudfoundry username"
    sensitive   = false
    default     = "<CF_USERNAME>"
}

variable "cf_password" {
    type        = string
    description = "Your Cloudfoundry password"
    sensitive   = true
    default     = "<CF_PASSWORD>"
}

variable "cf_api_url" {
    type        = string
    description = "Your Cloudfoundry api url"
    default     = "<CF_API_URL>"
}


# Global account
variable "globalaccount" {
    type        = string
    description = "The globalaccount subdomain ID"
    default     = "<GLOBALACCOUNT_ID>"
}

# Subaccount  
variable "subaccount_name" {
    type        = string
    description = "The subaccount name"
    default     = "<SUBACCOUNT_NAME>"
}

# Subdomain
variable "subdomain_name" {
    type        = string
    description = "Subdomain name"
    default     = "<SUBDOMIAN_NAME>"
}

# Region
variable "region" {
    type        = string
    description = "The region where the project account shall be created in"
    default     = "<REGION>"
}

# Role collection for subaccount
variable "subaccount_admins" {
    type        = list(string)
    description = "Defines the colleagues who are added to each subaccount as subaccount administrators"
    default     = ["john.doe@example.com", "jane.smith@example.com"]
}

variable "subaccount_service_admins" {
    type        = list(string)
    description = "Defines the colleagues who are added to each subaccount as subaccount service administrators"
    default     = ["john.doe@example.com", "jane.smith@example.com"]
}


# Cloudfoundry setup
## Cloudfoundry name
variable "cf_name" {
    type        = string
    description = "The Cloudfoundry environment label"
    default     = "<CLOUDFOUNDRY_NAME>"
}

## Cloudfoundry landscape label
variable "cf_landscape_label" {
    type        = string
    description = "The Cloudfoundry environment label"
    default     = "<CLOUDFOUNDRY_ENV_LABEL>"
}

## Cloudfoundry instance name
variable "cf_instance_name" {
    type        = string
    description = "The Cloudfoundry environment label"
    default     = "<CLOUDFOUNDRY_INSTANCE_NAME>"
}

## Cloudfoundry space name
variable "cf_space_name" {
    type        = string
    description = "Cloudfoundry space name"
    default     = "<CLOUDFOUNDRY_SPACE_NAME>"
}

## Role collection for cloudfoundry space
variable "cloudfoundry_space_managers" {
    type        = list(string)
    description = "Defines the users added to the space as space managers"
    default     = ["john.doe@example.com", "jane.smith@example.com"]
}

variable "cloudfoundry_space_developers" {
    type        = list(string)
    description = "Defines the users added to the space as space developers"
    default     = ["john.doe@example.com", "jane.smith@example.com"]
}