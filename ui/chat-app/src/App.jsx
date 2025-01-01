import { useState, useEffect, useRef } from 'react';
import { User, Bot, Send, Loader } from 'lucide-react';

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const messagesEndRef = useRef(null);

  // レコメンドメッセージ
  const recommendations = [
    "今日の天気について教えてください",
    "おすすめのレストランを教えてください",
    "最近のニュースを要約してください",
    "私は最近技術の進歩に興味を持っています。特にAIの発展については目を見張るものがあります。新しい技術が私たちの生活をどのように変えていくのか、その可能性と課題について深く考えさせられます。この分野について、あなたの見解を聞かせていただけますか？"
  ];

  // スクロール処理
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // メッセージ送信時の処理
  const handleSendMessage = async (text) => {
    if (!text.trim() || isDisabled) return;
    
    setIsDisabled(true);
    setIsLoading(true);

    // ユーザーメッセージを追加
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText(''); // 入力フィールドをクリア

    try {
      // 擬似的な待機時間（5秒）
      await new Promise(resolve => setTimeout(resolve, 5000));

      // アシスタントの応答を追加
      const assistantMessage = {
        id: Date.now() + 1,
        text: `「${text}」について承知しました。どのようにお手伝いできますか？`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      // 1秒間入力を無効化
      setTimeout(() => {
        setIsDisabled(false);
      }, 1000);
    }
  };

  // レコメンドメッセージ選択時の処理
  const handleRecommendationClick = (text) => {
    if (isDisabled) return;
    handleSendMessage(text);
  };

  // 送信ボタンクリック時の処理
  const handleClickSend = () => {
    if (inputText.trim() && !isDisabled) {
      handleSendMessage(inputText);
    }
  };

  // フォーム送信時の処理
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClickSend();
  };

  // ローディングアニメーション
  const LoadingEffect = () => (
    <div className="flex items-center space-x-2 p-4">
      <div className="animate-spin">
        <Loader className="w-6 h-6 text-blue-500" />
      </div>
      <div className="animate-pulse flex space-x-1">
        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-gray-100">
      {/* メッセージ表示エリア */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className="flex items-start max-w-[70%] space-x-2">
              {message.sender === 'assistant' && (
                <div className="flex-shrink-0">
                  <Bot className="w-8 h-8 text-blue-500" />
                </div>
              )}
              <div>
                <div
                  className={`rounded-lg p-3 break-words ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp}
                </div>
              </div>
              {message.sender === 'user' && (
                <div className="flex-shrink-0">
                  <User className="w-8 h-8 text-blue-500" />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && <LoadingEffect />}
        <div ref={messagesEndRef} />
      </div>

      {/* レコメンドメッセージ */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {recommendations.map((text, index) => (
          <button
            key={index}
            onClick={() => handleRecommendationClick(text)}
            disabled={isDisabled}
            className={`p-2 text-sm text-left border rounded-lg 
              ${
                isDisabled
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 active:bg-gray-100'
              }
              transition-colors duration-200
              overflow-hidden text-ellipsis`}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: '3',
              WebkitBoxOrient: 'vertical'
            }}
          >
            {text}
          </button>
        ))}
      </div>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isDisabled}
          className={`flex-1 p-2 border rounded-lg 
            ${
              isDisabled
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white'
            }`}
          placeholder="メッセージを入力..."
        />
        <button
          type="button"
          onClick={handleClickSend}
          disabled={isDisabled || !inputText.trim()}
          className={`p-2 rounded-lg 
            ${
              isDisabled || !inputText.trim()
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
            }
            transition-colors duration-200`}
        >
          <Send className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default ChatUI;