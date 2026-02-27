# Deployment notes

Required GitHub repository secrets:

- `EC2_HOST` — EC2 public IP or hostname
- `EC2_USER` — SSH user (e.g., `ubuntu`)
- `EC2_SSH_KEY` — private SSH key (PEM) content
- `EC2_SSH_PORT` — optional (default `22`)
- `REMOTE_DIR` — remote directory where `docker-compose.deploy.yml` will be copied (e.g. `/home/ubuntu/deploy`)
- `DOCKER_REGISTRY` — registry host (e.g., `ghcr.io` or `docker.io`)
- `DOCKER_USERNAME` — registry username
- `DOCKER_PASSWORD` — registry password or PAT

How CI works (summary):

- On push to `main` or `deploy`, the workflow builds Docker images for `api-gateway`, `auth-service`, `product-service`, and `client`, tags them with the commit SHA and `latest`, and pushes them to the registry.
- The workflow generates `docker-compose.deploy.yml`, copies it to the EC2 `REMOTE_DIR`, logs into the registry from EC2, pulls the new images, and runs `docker compose up -d`.

EC2 prerequisites:

- Docker and Docker Compose must be installed on the EC2 instance.
- The EC2 user must be able to write into `REMOTE_DIR` and run `docker` commands.

Verification steps (manual):

- SSH into EC2 and run `docker ps` to verify containers are running.
- Check logs: `docker compose -f docker-compose.deploy.yml logs -f`.
