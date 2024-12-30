FROM node:20-bullseye

# 開発用ツールのインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリの設定
WORKDIR /app

# Node.jsの開発ツールをグローバルにインストール
RUN npm install -g \
    create-react-app \
    typescript \
    eslint \
    prettier \
    nodemon

# 開発用パッケージをインストール
RUN npm install --save-dev \
    eslint \
    prettier \
    typescript \
    @types/react \
    @types/react-dom

# プロジェクト作成用の作業ディレクトリを作成
RUN mkdir -p /app

# 作業ディレクトリに移動
WORKDIR /app

# コンテナ起動時のデフォルトコマンド
CMD ["/bin/bash"]