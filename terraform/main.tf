# Create new subaccount
resource "btp_subaccount" "subaccount_name" {
    name          = var.subaccount_name
    subdomain     = var.subdomain_name
    region        = var.region
## optional:
    beta_enabled  = true
    description   = "<DESCRIPTION>"
}

# Assignment of subaccount administrators
resource "btp_subaccount_role_collection_assignment" "subaccount_admins" {
    for_each             = toset(var.subaccount_admins)
    subaccount_id        = btp_subaccount.subaccount_name.id
    role_collection_name = "Subaccount Service Administrator"
    user_name            = each.value
}

# Cloudfoundry runtime entitlement
resource "btp_subaccount_entitlement" "cloudfoundry_runtime" {
    subaccount_id = btp_subaccount.subaccount_name.id
    service_name  = "APPLICATION_RUNTIME"
    plan_name     = "MEMORY"
    amount        = 32
}

# Create cloudfoundry instance
resource "btp_subaccount_environment_instance" "cloudfoundry" {
    subaccount_id     = btp_subaccount.subaccount_name.id
    name              = var.cf_name
    environment_type  = "cloudfoundry"
    service_name      = "cloudfoundry"
    landscape_label   = var.cf_landscape_label
    plan_name         = "standard"
    parameters        = jsonencode({
        instance_name = var.cf_instance_name
    })
}

# Create cloudfoundry space
resource "cloudfoundry_space" "space" {
    name       = var.cf_space_name
    org        = data.cloudfoundry_org.cf_org.id
    depends_on = [ data.cloudfoundry_org.cf_org ]
}

# Role collection for space users
resource "cloudfoundry_space_users" "space_users" {
    space      = cloudfoundry_space.space.id
    managers   = var.cloudfoundry_space_managers
    developers = var.cloudfoundry_space_developers
}

# Service entitlements for the subaccount
resource "btp_subaccount_entitlement" "destination_service" {
    subaccount_id = btp_subaccount.subaccount_name.id
    service_name  = "destination"
    plan_name     = "lite"
}

resource "btp_subaccount_entitlement" "xsuaa_service" {
    subaccount_id = btp_subaccount.subaccount_name.id
    service_name  = "xsuaa"
    plan_name     = "application"
}

resource "btp_subaccount_entitlement" "document_information_extraction" {
    subaccount_id = btp_subaccount.subaccount_name.id
    service_name  = "sap-document-information-extraction"
    plan_name     = "premium_edition"
    amount        = 1
}

resource "btp_subaccount_entitlement" "hana_cloud" {
    subaccount_id = btp_subaccount.subaccount_name.id
    service_name  = "hana-cloud"
    plan_name     = "hana"
}

resource "btp_subaccount_entitlement" "object_store" {
    subaccount_id = btp_subaccount.subaccount_name.id
    service_name  = "objectstore"
    plan_name     = "standard"
}

# Service plan ID's
data "btp_subaccount_service_plan" "destination_service_lite" {
    subaccount_id = btp_subaccount.subaccount_name.id
    name          = "lite"
    offering_name = "destination"
}

data "btp_subaccount_service_plan" "xsuaa_service_application" {
    subaccount_id = btp_subaccount.subaccount_name.id
    name          = "application"
    offering_name = "xsuaa"
}

data "btp_subaccount_service_plan" "hana_cloud_application" {
    subaccount_id = btp_subaccount.subaccount_name.id
    name          = "hana"
    offering_name = "hana-cloud"
    depends_on = [ btp_subaccount_entitlement.hana_cloud ]
}

data "btp_subaccount_service_plan" "document_information_extraction_service" {
    subaccount_id = btp_subaccount.subaccount_name.id
    name          = "premium_edition"
    offering_name = "sap-document-information-extraction"
}

data "cloudfoundry_service" "objectstore_service" {
    name       = "objectstore"
    depends_on = [ cloudfoundry_space.space ]
}

# Cloudfoundry org ID
data "cloudfoundry_org" "cf_org" {
    name = var.cf_instance_name
    depends_on = [ btp_subaccount_environment_instance.cloudfoundry ]
}

## Creating service instances
resource "btp_subaccount_service_instance" "destination_service" {
    serviceplan_id = data.btp_subaccount_service_plan.destination_service_lite.id
    name           = "destination-service"
    subaccount_id  = btp_subaccount.subaccount_name.id  
}

resource "btp_subaccount_service_instance" "xsuaa" {
    subaccount_id  = btp_subaccount.subaccount_name.id
    serviceplan_id = data.btp_subaccount_service_plan.xsuaa_service_application.id
    name           = "xsuaa-service"
}

resource "btp_subaccount_service_instance" "hana" {
    subaccount_id  = btp_subaccount.subaccount_name.id
    serviceplan_id = data.btp_subaccount_service_plan.hana_cloud_application.id
    name           = "hanadb-service"
    parameters     = jsonencode({
            data = {
            memory                 = 32
            generateSystemPassword = true
            edition                = "cloud"
        }
    })
}

resource "btp_subaccount_service_instance" "dox" {
    subaccount_id  = btp_subaccount.subaccount_name.id
    serviceplan_id = data.btp_subaccount_service_plan.document_information_extraction_service.id
    name           = "sap-document-information-extraction"
}

resource "cloudfoundry_service_instance" "objectstore" {
    name         = "s3-object-store"
    space        = cloudfoundry_space.space.id
    service_plan = data.cloudfoundry_service.objectstore_service.service_plans["standard"]
    depends_on   = [ cloudfoundry_space_users.space_users ]
}