# Codelave
**Managed Code Execution Infrastructure for AI Agents**

Codelave is a secure, heavy-duty execution engine designed to give AI agents (and human developers) an isolated sandbox environment to run arbitrary Python and Node.js code safely in the cloud.

---

## Architecture

Codelave operates on a decoupled, scalable architecture designed for absolute security and rapid execution:
*   **The Brain (API Server):** A fast, robust backend built with **NestJS**. It orchestrates the creation and destruction of sandboxes and streams code output via WebSockets.
*   **The Engine (Sandbox Host):** A hardened, dedicated EC2 instance running the Docker Daemon. It executes minimal, heavily restricted, non-root Alpine Linux containers.
*   **The Dashboard (Client):** A beautiful web application built with **Next.js** where users manage their accounts, view analytics, and generate SDK API keys.
*   **The Bridge (SDKs):** Installable libraries for Python and Node.js that wrap the REST and WebSocket APIs, enabling developers to trigger sandboxes with a single line of code.

---

## Repository Structure

The project is structured as a monorepo containing all discrete application boundaries:

```text
Codelave/
├── client/           # Front-end user dashboard (Next.js)
├── server/           # Core API & WebSocket server (NestJS + PostgreSQL)
├── sdk/              # Client SDKs 
│   ├── python/       # installable via PyPI (planned)
│   └── node/         # installable via npm (planned)
└── infrastructure/   # Cloud provisioning & Sandbox configurations
    ├── sandbox-dockerfiles/  # Hardened Alpine images for Python/Node
    └── terraform/            # AWS IaC (VPCs, EC2, ALBs, etc.)
```

---

## Branching Strategy

Our team uses a structured Git workflow to ensure infrastructure and application code can be developed in parallel without collision:

*   `main`: The production-ready source of truth. Merges to this branch automatically trigger CI/CD pipelines.
*   `devops`: Used by the DevOps Engineer to build container configurations, write GitHub Actions, and harden the execution environments inside the `infrastructure/` folder.
*   `terra-infra`: Used by the Cloud Engineer to write Infrastructure-as-Code (Terraform) scripts that provision the raw AWS resources.

---

## Security Posture

Running arbitrary, untrusted code requires extreme isolation. Codelave achieves this via:
- **Distroless Emulation:** Sandbox base images do not contain OS package managers (`apk`), compilers, or shell access (`/bin/sh`).
- **Resource Constraints:** Containers are strictly limited on CPU and memory via Docker constraints.
- **Network Isolation:** (Planned) Containers run in dedicated namespaces without access to internal VPC resources.
- **Ephemeral Lifecycles:** Sandboxes are automatically garbage collected and destroyed immediately after a timeout threshold or successful execution.
