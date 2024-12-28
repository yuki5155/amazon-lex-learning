from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class IntentData:
    name: str
    state: str
    confirmation_state: str
    slots: Dict
    nlu_confidence: Optional[float] = None
    interpretation_source: Optional[str] = None

@dataclass
class BotData:
    name: str
    version: str
    locale_id: str
    id: str
    alias_id: str
    alias_name: str

class LexResponseProcessor:
    """
    Amazon Lexのレスポンスを処理するためのクラス
    """
    def __init__(self, response_dict: Dict):
        self.raw_response = response_dict
        self.session_id = response_dict["sessionId"]
        self.input_transcript = response_dict["inputTranscript"]
        self.message_version = response_dict["messageVersion"]
        self.invocation_source = response_dict["invocationSource"]
        self.response_content_type = response_dict["responseContentType"]
        self.input_mode = response_dict["inputMode"]
        
        # Botの情報を処理
        bot_data = response_dict["bot"]
        self.bot = BotData(
            name=bot_data["name"],
            version=bot_data["version"],
            locale_id=bot_data["localeId"],
            id=bot_data["id"],
            alias_id=bot_data["aliasId"],
            alias_name=bot_data["aliasName"]
        )
        
        # インテントの解釈を処理
        self.interpretations = self._process_interpretations(response_dict["interpretations"])
        
        # セッション状態を処理
        self.session_state = self._process_session_state(response_dict["sessionState"])

    def _process_interpretations(self, interpretations: List[Dict]) -> List[IntentData]:
        """インテントの解釈リストを処理"""
        processed_interpretations = []
        for interp in interpretations:
            intent = interp["intent"]
            intent_data = IntentData(
                name=intent["name"],
                state=intent["state"],
                confirmation_state=intent["confirmationState"],
                slots=intent.get("slots", {}),
                nlu_confidence=interp.get("nluConfidence"),
                interpretation_source=interp.get("interpretationSource")
            )
            processed_interpretations.append(intent_data)
        return processed_interpretations

    def _process_session_state(self, session_state: Dict) -> Dict:
        """セッション状態を処理"""
        return {
            "session_attributes": session_state.get("sessionAttributes", {}),
            "active_contexts": session_state.get("activeContexts", []),
            "intent": IntentData(
                name=session_state["intent"]["name"],
                state=session_state["intent"]["state"],
                confirmation_state=session_state["intent"]["confirmationState"],
                slots=session_state["intent"].get("slots", {})
            ),
            "originating_request_id": session_state["originatingRequestId"]
        }

    def get_highest_confidence_intent(self) -> Optional[IntentData]:
        """最も信頼度の高いインテントを取得"""
        if not self.interpretations:
            return None
        
        return max(
            self.interpretations,
            key=lambda x: x.nlu_confidence if x.nlu_confidence is not None else -1
        )

    def get_active_intent(self) -> IntentData:
        """現在アクティブなインテントを取得"""
        return self.session_state["intent"]

    def is_fulfillment_required(self) -> bool:
        """フルフィルメントが必要かどうかを判定"""
        return self.invocation_source == "FulfillmentCodeHook"

# 使用例
def example_usage():
    sample_response = {
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
    
    processor = LexResponseProcessor(sample_response)
    
    # 最も信頼度の高いインテントを取得
    highest_confidence_intent = processor.get_highest_confidence_intent()
    print(f"Highest confidence intent: {highest_confidence_intent.name}")
    
    # アクティブなインテントを取得
    active_intent = processor.get_active_intent()
    print(f"Active intent: {active_intent.name}")
    
    # フルフィルメントが必要かどうかを確認
    needs_fulfillment = processor.is_fulfillment_required()
    print(f"Needs fulfillment: {needs_fulfillment}")

    # inputTranscriptを取得
    print(f"Input transcript: {processor.input_transcript}")

if __name__ == "__main__":

    print("=== Usage example ===")
    example_usage()
