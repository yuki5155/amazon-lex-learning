# 環境変数
REGION ?= us-east-1
ENV ?= dev
STACK_NAME ?= react-app-stack
TEMPLATE_PATH ?= templates/cloudfront.yaml
DIST_PATH ?= ui/chat-app/dist

# バケット名を取得するヘルパー関数
define get_bucket_name
$(shell aws cloudformation describe-stacks \
    --stack-name $(STACK_NAME) \
    --region $(REGION) \
    --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
    --output text)
endef

# UIデプロイ
.PHONY: ui-deploy
ui-deploy:
	aws cloudformation create-stack \
		--stack-name $(STACK_NAME) \
		--template-body file://$(TEMPLATE_PATH) \
		--region $(REGION) \
		--parameters ParameterKey=Environment,ParameterValue=$(ENV)

# UIスタック更新
.PHONY: ui-update
ui-update:
	aws cloudformation update-stack \
		--stack-name $(STACK_NAME) \
		--template-body file://$(TEMPLATE_PATH) \
		--region $(REGION) \
		--parameters ParameterKey=Environment,ParameterValue=$(ENV)

# UIスタック削除
.PHONY: ui-delete
ui-delete:
	aws cloudformation delete-stack \
		--stack-name $(STACK_NAME) \
		--region $(REGION)

# UIスタック状態確認
.PHONY: ui-status
ui-status:
	aws cloudformation describe-stacks \
		--stack-name $(STACK_NAME) \
		--region $(REGION)

# UIバケット名を取得
.PHONY: ui-get-bucket
ui-get-bucket:
	@echo "Retrieving bucket name..."
	@echo "Bucket name: $(call get_bucket_name)"

# UIS3同期
.PHONY: ui-sync
ui-sync:
	@echo "Syncing UI files to bucket..."
	aws s3 sync $(DIST_PATH) s3://$(call get_bucket_name)

# UIキャッシュ無効化
.PHONY: ui-invalidate
ui-invalidate:
	@echo "Invalidating CloudFront cache..."
	aws cloudfront create-invalidation \
		--distribution-id $$(aws cloudformation describe-stacks \
			--stack-name $(STACK_NAME) \
			--region $(REGION) \
			--query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
			--output text) \
		--paths "/*"

# ヘルプ
.PHONY: help
help:
	@echo "UI関連コマンド:"
	@echo "  make ui-deploy            - UIのCloudFormationスタックをデプロイ"
	@echo "  make ui-deploy ENV=prod   - UI本番環境にデプロイ"
	@echo "  make ui-update           - UIスタックを更新"
	@echo "  make ui-delete           - UIスタックを削除"
	@echo "  make ui-status           - UIスタックの状態を確認"
	@echo "  make ui-sync             - UIビルドファイルをS3に同期"
	@echo "  make ui-invalidate       - CloudFrontのキャッシュを無効化"
	@echo ""
	@echo "環境変数:"
	@echo "  REGION         - AWSリージョン (デフォルト: us-east-1)"
	@echo "  ENV            - 環境名 (デフォルト: dev)"
	@echo "  STACK_NAME     - スタック名 (デフォルト: react-app-stack)"
	@echo "  TEMPLATE_PATH  - テンプレートパス (デフォルト: templates/cloudfront.yaml)"
	@echo "  DIST_PATH      - ビルドファイルパス (デフォルト: ui/chat-app/dist)"