生成AIと最初から紐付ける前提のモードがあるが最初にナレッジベースかOpenSearch、kendraが必要になる。

<image src="./images/Screenshot 2024-12-28 at 12.16.38.png">


## 使えるかの結論
今の所不要

## いらない理由
- function_callと機能がバッティングする
- 結局function_callみたいに使ってもlambda関数を使う
- 会話のログデータの保持期間が長くないし、収集するならDynamoDBの方が楽なのでLangChainの方がいい


## アイディア
セッションidをjsonにするれば会話のログデータを保持できる（非同期で）
もしくはDynamoDB


lambda呼び出しの時のevent
```json
{
    "sessionId": "395283877816774",
    "inputTranscript": "lambda",
    "interpretations": [
        {
            "intent": {
                "name": "LambdaIntent",
                "state": "ReadyForFulfillment",
                "slots": {},
                "confirmationState": "None"
            },
            "interpretationSource": "Lex",
            "nluConfidence": 1
        },
        {
            "intent": {
                "name": "FallbackIntent",
                "state": "ReadyForFulfillment",
                "slots": {},
                "confirmationState": "None"
            },
            "interpretationSource": "Lex"
        },
        {
            "intent": {
                "name": "HelloIntent",
                "state": "ReadyForFulfillment",
                "slots": {},
                "confirmationState": "None"
            },
            "interpretationSource": "Lex",
            "nluConfidence": 0.34
        }
    ],
    "bot": {
        "name": "SimpleChatBot",
        "version": "DRAFT",
        "localeId": "ja_JP",
        "id": "D58...",
        "aliasId": "TSTAL....",
        "aliasName": "TestBotAlias"
    },
    "messageVersion": "1.0",
    "invocationSource": "FulfillmentCodeHook",
    "sessionState": {
        "sessionAttributes": {},
        "activeContexts": [],
        "intent": {
            "name": "LambdaIntent",
            "state": "ReadyForFulfillment",
            "slots": {},
            "confirmationState": "None"
        },
        "originatingRequestId": "02fdc......"
    },
    "responseContentType": "text/plain; charset=utf-8",
    "inputMode": "Text"
}
```