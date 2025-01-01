FROM ubuntu:22.04
WORKDIR /workspace

# AWS CLIとgitのインストール (ARM版)
RUN apt-get update && \
    apt-get install -y curl unzip git && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf aws awscliv2.zip

COPY . .