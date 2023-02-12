ARG NODE_VERSION

FROM node:${NODE_VERSION}

ARG APPNAME
ARG SHARED_WORKSPACE_HOST
ARG SHARED_WORKSPACE_CONTAINER
ARG DOCKER_TOOLS_HOST

COPY ./${DOCKER_TOOLS_HOST} /opt/docker/tools

RUN apt-get update \
    && apt-get install -y \
        vim \
        wget \
        curl \
        git \
    && echo ${NODE_VERSION} \
    && node --version \
    && npm --version \
    && npx --version \
    # npmが古い場合があるので再インストール
    && npm install -g npm \
    && npm --version

WORKDIR ${SHARED_WORKSPACE_CONTAINER}
