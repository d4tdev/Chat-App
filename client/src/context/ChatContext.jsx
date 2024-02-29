import { createContext, useState, useEffect, useCallback } from 'react';
import { baseUrl, getRequest, postRequest } from '../utils/services';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
   const [userChats, setUserChats] = useState([]);
   const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
   const [userChatsError, setUserChatsError] = useState('');
   const [potentialChats, setPotentialChats] = useState([]);
   const [currentChat, setCurrentChat] = useState(null);
   const [messages, setMessages] = useState(null);
   const [isMessagesLoading, setIsMessagesLoading] = useState(false);
   const [messagesError, setMessagesError] = useState('');
   const [newMessage, setNewMessage] = useState('');
   const [sendTextMessageError, setSendTextMessageError] = useState('');

   useEffect(() => {
      const getUsers = async () => {
         const response = await getRequest(`${baseUrl}/users`);
         if (response.error) return console.error(response.message);
         const pChats = response?.metadata?.filter((u) => {
            let isChatCreated = false;
            if (user?._id === u._id) return false;

            if (userChats) {
               isChatCreated = userChats?.some(
                  (chat) =>
                     chat?.members[0] === u._id || chat?.members[1] === u._id
               );
            }
            return !isChatCreated;
         });
         setPotentialChats(pChats);
      };
      getUsers();
   }, [userChats]);

   useEffect(() => {
      const getUserChats = async () => {
         if (user?._id) {
            setIsUserChatsLoading(true);
            setUserChatsError('');

            const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

            setIsUserChatsLoading(false);
            if (response.error) return setUserChatsError(response.message);

            setUserChats(response.metadata);
         }
      };
      getUserChats();
   }, [user]);

   useEffect(() => {
      const getMessages = async () => {
         setIsMessagesLoading(true);
         setMessagesError('');

         const response = await getRequest(
            `${baseUrl}/messages/${currentChat?._id}`
         );

         setIsMessagesLoading(false);
         if (response.error) return setMessagesError(response.message);

         setMessages(response.metadata);
      };

      getMessages();
   }, [currentChat]);

   const updateCurrentChat = useCallback((chat) => {
      console.log(chat);
      setCurrentChat(chat);
   }, []);

   const createChat = useCallback(async (firstId, secondId) => {
      const response = await postRequest(`${baseUrl}/chats`, {
         firstId,
         secondId,
      });

      if (response.error) return console.error(response.message);
      setUserChats((prev) => [...prev, response.metadata]);
   }, []);

   const sendTextMessage = useCallback(
      async (textMessage, sender, currentChatId, setTextMessage) => {
         if (!textMessage) return;
         const response = await postRequest(`${baseUrl}/messages`, {
            text: textMessage,
            chatId: currentChatId,
            senderId: sender?._id,
         });

         if (response.error) return setSendTextMessageError(response.message);

         setNewMessage(response.metadata);
         setTextMessage('');
         setMessages((prev) => [...prev, response.metadata]);
      },
      []
   );

   return (
      <ChatContext.Provider
         value={{
            userChats,
            isUserChatsLoading,
            userChatsError,
            potentialChats,
            createChat,
            currentChat,
            updateCurrentChat,
            messages,
            isMessagesLoading,
            messagesError,
            sendTextMessage,
         }}>
         {children}
      </ChatContext.Provider>
   );
};
