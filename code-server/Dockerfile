FROM linuxserver/code-server:latest
ENV DEBIAN_FRONTEND=noninteractive
USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    git \
    python3 \
    python3-pip \
    curl \
    build-essential \
    gcc \
    g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

USER coder
WORKDIR /home/coder
RUN code-server --install-extension ms-python.python \
    && code-server --install-extension GitHub.vscode-pull-request-github \
    && code-server --install-extension dbaeumer.vscode-eslint \
    && code-server --install-extension esbenp.prettier-vscode \
    && code-server --install-extension redhat.vscode-yaml \
    && code-server --install-extension golang.go \
    && code-server --install-extension vscode.npm \
    && code-server --install-extension google.geminicodeassist
EXPOSE 8080
