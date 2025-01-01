## amazon lexのデプロイ方法


## UIのデプロイ

```
# デフォルト値(dev)でデプロイ
aws cloudformation create-stack \
  --stack-name react-app-stack \
  --template-body file://templates/cloudfront.yaml \
  --region us-east-1

# 環境を指定してデプロイ
aws cloudformation create-stack \
  --stack-name react-app-stack \
  --template-body file://template.yaml \
  --parameters ParameterKey=Environment,ParameterValue=prod
```

## デプロイ状況を確認

```
aws cloudformation describe-stacks \
  --stack-name react-app-stack \
  --region us-east-2
```

## distをs3に同期

```
aws s3 sync ui/chat-app/dist s3://your-bucket-name
```
