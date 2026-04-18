import { useState, useEffect, useRef } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Search, 
  Send, 
  Image as ImageIcon, 
  MessageSquare, 
  FileText,
  CreditCard,
  Building2,
  Check,
  CheckCheck,
  Paperclip,
  RefreshCw,
} from 'lucide-react';
import { Conversation, ConversationType, Message as MessageType } from '../../types';
import { toast } from 'sonner';

export default function Mensajes() {
  const { user } = useAuth();
  const { 
    properties, 
    conversations,
    messages,
    fetchConversations,
    fetchMessages,
    sendMessage,
    getConversationsByUserId,
    getMessagesByConversationId,
    markMessagesAsRead,
    getUserById,
    isLoadingConversations,
    isLoadingMessages
  } = useData();

  const [userNames, setUserNames] = useState<Record<string, string>>({});

  const handleRefresh = async () => {
    if (user?.id) {
      try {
        await Promise.all([
          fetchConversations(user.id),
          fetchMessages(user.id)
        ]);
        toast.success('Mensajes actualizados');
      } catch (error) {
        toast.error('Error al actualizar');
      }
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchConversations(user.id);
      fetchMessages(user.id);
    }
  }, [user?.id, fetchConversations, fetchMessages]);

  // Cargar nombres de usuarios participantes
  useEffect(() => {
    const loadParticipantNames = async () => {
      const otherParticipantIds = Array.from(new Set(
        conversations.flatMap(c => c.participants).filter(id => id !== user?.id)
      ));

      console.log('Cargando nombres para participantes:', otherParticipantIds);

      for (const id of otherParticipantIds) {
        if (!userNames[id]) {
          try {
            const userData = await getUserById(id);
            if (userData?.nombre) {
              console.log(`Nombre recuperado para ${id}:`, userData.nombre);
              setUserNames(prev => ({ ...prev, [id]: userData.nombre }));
            } else {
              console.warn(`No se encontró nombre para el usuario ${id}`);
            }
          } catch (err) {
            console.error(`Error cargando nombre para ${id}:`, err);
          }
        }
      }
    };

    if (conversations.length > 0) {
      loadParticipantNames();
    }
  }, [conversations, user?.id, getUserById, userNames]);

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ConversationType | 'all'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);



  // Filter conversations
  const filteredConversations = conversations
    .filter(conv => {
      if (filterType !== 'all' && conv.type !== filterType) return false;
      
      if (searchQuery) {
        const title = getConversationTitle(conv);
        return title.toLowerCase().includes(searchQuery.toLowerCase());
      }
      
      return true;
    })
    .sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime;
    });

  const selectedConversation = selectedConversationId 
    ? conversations.find(c => c.id === selectedConversationId)
    : null;

  const conversationMessages = selectedConversationId
    ? getMessagesByConversationId(selectedConversationId).sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
    : [];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);


  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversationId || !user || !selectedConversation) return;

    const receiverId = selectedConversation.participants.find(p => p !== user.id);
    if (!receiverId) return;

    sendMessage({
      conversationId: selectedConversationId,
      senderId: user.id,
      receiverId,
      content: messageInput.trim(),
      type: 'text',
    });

    setMessageInput('');
    toast.success('Mensaje enviado');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (dateParam: Date | string) => {
    const date = new Date(dateParam);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Ayer';
    } else {
      return format(date, 'dd/MM/yyyy', { locale: es });
    }
  };

  const getConversationTitle = (conv: Conversation) => {
    const otherUserId = conv.participants.find((p: string) => p !== user?.id);
    
    if (otherUserId && userNames[otherUserId]) {
      return userNames[otherUserId];
    }
    
    return otherUserId ? `Usuario (${otherUserId})` : 'Conversación';
  };

  const getConversationTypeLabel = (type: ConversationType) => {
    const labels = {
      consulta_propiedad: 'Consulta',
      contrato_activo: 'Contrato',
      pago_comprobante: 'Pago',
      general: 'General',
    };
    return labels[type];
  };

  const getConversationTypeIcon = (type: ConversationType) => {
    const icons = {
      consulta_propiedad: Building2,
      contrato_activo: FileText,
      pago_comprobante: CreditCard,
      general: MessageSquare,
    };
    const Icon = icons[type] || MessageSquare;
    return <Icon className="size-4" />;
  };

  const getUnreadCount = (conv: Conversation) => {
    return user ? conv.unreadCount[user.id] || 0 : 0;
  };

  const getInitials = (userId: string) => {
    // Si somos nosotros mismos
    if (userId === user?.id && user?.nombre) {
      const names = user.nombre.split(' ');
      if (names.length >= 2) {
        return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    // Para otros usuarios mock, generar por ID o dar genérico
    return 'U';
  };

  const MessageStatusIcon = ({ status }: { status: MessageType['status'] }) => {
    if (status === 'read') {
      return <CheckCheck className="size-4 text-blue-500" />;
    } else if (status === 'delivered') {
      return <CheckCheck className="size-4 text-muted-foreground" />;
    } else {
      return <Check className="size-4 text-muted-foreground" />;
    }
  };

  // Empty state
  if (filteredConversations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
              <MessageSquare className="size-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold">No hay mensajes</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Cuando inicies una conversación con un inquilino o dueño, aparecerá aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mensajes</h1>
          <p className="text-muted-foreground">Comunícate con inquilinos y dueños</p>
        </div>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleRefresh} 
          disabled={isLoadingConversations || isLoadingMessages}
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`size-4 mr-2 ${isLoadingConversations || isLoadingMessages ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-[380px_1fr] h-[calc(100vh-240px)]">
          {/* Conversations List */}
          <div className="border-r flex flex-col">
            {/* Search and filters */}
            <div className="p-4 space-y-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar conversaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Tabs value={filterType} onValueChange={(v) => setFilterType(v as ConversationType | 'all')}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
                  <TabsTrigger value="consulta_propiedad" className="text-xs">Consultas</TabsTrigger>
                  <TabsTrigger value="contrato_activo" className="text-xs">Contratos</TabsTrigger>
                  <TabsTrigger value="pago_comprobante" className="text-xs">Pagos</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Conversations */}
            <ScrollArea className="flex-1">
              <div className="divide-y">
                {filteredConversations.map((conv) => {
                  const unreadCount = getUnreadCount(conv);
                  const otherUserId = conv.participants.find(p => p !== user?.id) || '';
                  const isSelected = selectedConversationId === conv.id;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setSelectedConversationId(conv.id);
                        if (user?.id) {
                          markMessagesAsRead(conv.id, user.id);
                        }
                      }}
                      className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                        isSelected ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <Avatar className="size-12 flex-shrink-0">
                          <AvatarFallback>{getInitials(otherUserId)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              {getConversationTypeIcon(conv.type)}
                              <span className="font-medium text-sm truncate">
                                {getConversationTitle(conv)}
                              </span>
                            </div>
                            {conv.lastMessageAt && (
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                {formatMessageTime(conv.lastMessageAt)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage || 'Sin mensajes'}
                            </p>
                            {unreadCount > 0 && (
                              <Badge variant="default" className="rounded-full px-2 py-0 text-xs">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>

                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getConversationTypeLabel(conv.type)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback>
                      {getInitials(selectedConversation.participants.find(p => p !== user?.id) || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{getConversationTitle(selectedConversation)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getConversationTypeLabel(selectedConversation.type)}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {conversationMessages.map((msg) => {
                      const isOwn = msg.senderId === user?.id;

                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                            <Avatar className="size-8 flex-shrink-0">
                              <AvatarFallback className="text-xs">
                                {getInitials(msg.senderId)}
                              </AvatarFallback>
                            </Avatar>

                            <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                              <div
                                className={`rounded-lg px-4 py-2 ${
                                  isOwn
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                {msg.type === 'image' ? (
                                  <div className="space-y-2">
                                    <img
                                      src={msg.content}
                                      alt="Adjunto"
                                      className="rounded max-w-full h-auto"
                                    />
                                  </div>
                                ) : (
                                  <p className="text-sm whitespace-pre-wrap break-words">
                                    {msg.content}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-1 mt-1 px-1">
                                <span className="text-xs text-muted-foreground">
                                  {formatMessageTime(msg.timestamp)}
                                </span>
                                {isOwn && <MessageStatusIcon status={msg.status} />}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => toast.info('Función de adjuntar archivos próximamente')}
                    >
                      <Paperclip className="size-4" />
                    </Button>
                    <Input
                      placeholder="Escribe un mensaje..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="flex-shrink-0"
                    >
                      <Send className="size-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                      <MessageSquare className="size-8 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">Selecciona una conversación</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Elige una conversación de la lista para comenzar a chatear.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}