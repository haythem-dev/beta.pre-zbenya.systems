import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from './ui/button';

const FAQ_RESPONSES = {
  "prix": "Nos tarifs varient selon vos besoins. Demandez un devis gratuit et personnalisé !",
  "délai": "Le délai moyen est de 2-4 semaines selon la complexité. Nous respectons toujours les échéances convenues.",
  "services": "Nous offrons:\n- Développement web sur mesure\n- Applications mobiles iOS/Android\n- Solutions d'entreprise\n- Intégration API & Cloud",
  "contact": "Appelez-nous au +1234567890 ou écrivez à contact@zbenyasystems.com",
  "support": "Notre support est disponible 24/7. Nous répondons sous 24h maximum.",
  "technologie": "Nous utilisons les dernières technologies: React, Node.js, Cloud Native",
  "méthodologie": "Nous suivons une approche agile avec des points réguliers",
  "garantie": "Nous offrons 3 mois de garantie et support après livraison"
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{
    type: 'bot',
    text: 'Bonjour ! Comment puis-je vous aider ?'
  }]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ role: string; content: string }>>([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages([...messages, userMessage]);

    // Update conversation history
    const newHistory = [...history, { role: 'user', content: input }];
    setHistory(newHistory);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          history: newHistory
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { type: 'assistant', text: data.response }]);
      setHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        text: "Désolé, je n'ai pas pu traiter votre demande." 
      }]);
    }

    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button onClick={() => setIsOpen(true)} className="rounded-full p-4">
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Assistant virtuel</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg p-2 max-w-[80%] ${msg.type === 'user' ? 'bg-primary text-white' : 'bg-gray-100'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 rounded-md border p-2"
                placeholder="Votre message..."
              />
              <Button onClick={handleSend}>Envoyer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}