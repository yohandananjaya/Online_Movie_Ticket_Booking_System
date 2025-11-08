FROM jenkins/jenkins:lts-jdk17

USER root
# Install docker client & compose plugin
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl gnupg lsb-release git && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list && \
    apt-get update && apt-get install -y docker-ce-cli && \
    rm -rf /var/lib/apt/lists/*

# Preinstall plugins (adjust as needed)
RUN jenkins-plugin-cli --plugins "workflow-aggregator blueocean docker-workflow credentials-binding"

USER jenkins

# Expose ports 8080 (web) and 50000 (JNLP agents)
EXPOSE 8080 50000
