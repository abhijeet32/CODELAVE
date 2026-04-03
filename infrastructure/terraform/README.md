# Terraform Infrastructure — Codelave

Terraform configuration to provision the Codelave AWS infrastructure. Organized using a **modular, multi-environment** structure.

---

## Folder Structure

```
terraform/
├── environments/
│   ├── dev/          # Development environment
│   ├── staging/      # Staging environment
│   └── prod/         # Production environment
│
└── modules/
    ├── networking/       # VPC, Subnets, NAT Gateways
    ├── security-groups/  # Firewall rules for each service
    ├── secrets/          # AWS Secrets Manager setup
    ├── security/         # IAM roles, MFA policy, CI/CD, Billing alerts
    └── compute/          # EC2 / Sandbox hosts (planned)
```

---

## How It Works

Each environment (`dev`, `staging`, `prod`) is an isolated Terraform root. It calls the shared modules with environment-specific values defined in `terraform.tfvars`.

```
environments/dev/
├── Provider.tf       # AWS provider config + auto-tagging
├── backend.tf        # Remote S3 state config
├── main.tf           # Calls the modules
├── variables.tf      # Variable declarations
└── terraform.tfvars  # Actual values (CIDRs, AZs, etc.)
```

---

## Remote State

State is stored remotely in S3 — never committed locally.

| Setting    | Value                                  |
|------------|----------------------------------------|
| Bucket     | `codelave-tf-state-backend-4815162342` |
| Region     | `us-east-1`                            |
| Encryption | Enabled (AES-256)                      |

---

## Modules

### `networking/`
Sets up the core AWS network — a multi-AZ VPC with public and private subnets.

- 1 VPC (`10.0.0.0/16` in dev)
- 2 Public Subnets + 2 Private Subnets (across `us-east-1a` and `us-east-1b`)
- 1 Internet Gateway + 2 NAT Gateways (one per AZ for high availability)
- Separate route tables per AZ to avoid cross-AZ charges

---

### `security-groups/`
Creates least-privilege network access rules for each service role.

| Group          | Allowed Inbound                              |
|----------------|----------------------------------------------|
| `api_server`   | HTTP :80, HTTPS :443 (public), SSH :22 (VPC only) |
| `sandbox_host` | All TCP from `api_server` SG only            |
| `database`     | PostgreSQL :5432 from `api_server` + `sandbox_host` |
| `redis`        | Redis :6379 from `api_server` only           |

> Database and Redis never allow public internet access (`0.0.0.0/0`).

---

### `secrets/`
Creates placeholder secret containers in AWS Secrets Manager.

| Secret                            | Contains                                    |
|-----------------------------------|---------------------------------------------|
| `codelave/<env>/db-credentials`   | `username`, `password`, `host`, `port`, `dbname` |
| `codelave/<env>/api-keys`         | `stripe_key`, `sendgrid_key`, `jwt_secret`  |

> Secret values are **not** set by Terraform. Populate them manually after `apply`:
> ```bash
> aws secretsmanager put-secret-value \
>   --secret-id "codelave/dev/db-credentials" \
>   --secret-string '{"username":"admin","password":"yourpassword",...}'
> ```

---

### `security/`
Account-level security, IAM, and cost guardrails. Applied once as a bootstrap.

- **S3 State Bucket** — versioned, encrypted, public access blocked
- **MFA Enforcement** — IAM policy that denies all actions without active MFA
- **Admin IAM User** — non-root human operator (`codelave-admin`)
- **Service Roles** — least-privilege roles for `api_server`, `sandbox_host`, and CI/CD pipeline
- **GitHub OIDC** — GitHub Actions authenticates via OIDC (no static AWS keys needed)
- **Billing Alert** — email notification at 80% and 100% of monthly budget

---

## Usage

```bash
# Step into the environment you want to work with
cd environments/dev

# Initialize Terraform (downloads providers, connects to S3 backend)
terraform init

# Preview what will change
terraform plan -var-file="terraform.tfvars"

# Apply the changes
terraform apply -var-file="terraform.tfvars"
```

> ⚠️ Always work from inside an `environments/<name>/` directory. Never apply from inside a `modules/` folder.

---

## Requirements

- Terraform `>= 1.5`
- AWS CLI configured with appropriate credentials
- The `security/` module must be applied **once first** — it creates the S3 bucket used by all environment backends
