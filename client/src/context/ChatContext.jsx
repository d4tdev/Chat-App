import { createContext, useState, useEffect, useCallback } from 'react';
import { baseUrl, getRequest, postRequest } from '../utils/services';
import { io } from 'socket.io-client';

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
   const [socket, setSocket] = useState(null);
   const [onlineUsers, setOnlineUsers] = useState([]); // [userId, socketId]
   const [notifications, setNotifications] = useState([]);
   const [allUsers, setAllUsers] = useState([]);

   // Initial socket
   useEffect(() => {
      const newSocket = io('http://localhost:4090');
      setSocket(newSocket);

      return () => {
         newSocket.disconnect();
      };
   }, [user]);

   // Emit to server when user logs in (online)
   useEffect(() => {
      if (socket === null) return;
      socket.emit('addNewUser', user?._id);
      socket.on('getOnlineUsers', (onlineUsers) => {
         setOnlineUsers(onlineUsers);
      });

      return () => {
         socket.off('getOnlineUsers');
      };
   }, [socket]);
   // Emit send message
   useEffect(() => {
      if (socket === null) return;

      const recipientId = currentChat?.members?.find((id) => id !== user?._id);
      socket.emit('sendMessage', { ...newMessage, recipientId });
   }, [newMessage]);
   // Emit receive message and notification
   useEffect(() => {
      if (socket === null) return;

      socket.on(
         'getMessage',
         (
            data = {
               chatId: '',
               createdAt: '',
               recipientId: '',
               senderId: '',
               text: '',
               updatedAt: '',
            }
         ) => {
            if (currentChat?._id !== data.chatId) return;
            setMessages((prev) => [...prev, data]);
         }
      );

      socket.on('getNotification', (data) => {
         const isChatOpen = currentChat?.members?.some(
            (id) => id === data.senderId
         );
         if (isChatOpen)
            setNotifications((prev) => [...prev, { ...data, isRead: true }]);
         else setNotifications((prev) => [...prev, data]);
      });

      // Clean up event
      return () => {
         socket.off('getMessage');
         socket.off('getNotification');
      };
   }, [socket, currentChat]);

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
         setAllUsers(response.metadata);
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
   }, [user, notifications]);

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

   const markAllNotificationsAsRead = useCallback((notifications) => {
      const mNotifications = notifications.map((n) => {
         return {
            ...n,
            isRead: true,
         };
      });

      setNotifications(mNotifications);
   }, []);

   // Mark notification as read in notifications table and open chat
   const markNotificationAsRead = useCallback(
      (notification, userChats, user, notifications) => {
         // Find chat to open
         const desiredChat = userChats?.find((chat) => {
            const chatMembers = [user._id, notification.senderId];
            const isDesiredChat = chat?.members?.every((member) => {
               return chatMembers?.includes(member);
            });

            return isDesiredChat;
         });
         updateCurrentChat(desiredChat);

         // Mark notification as read
         const mNotifications = notifications.map((n) => {
            if (n.senderId === notification.senderId) {
               return {
                  ...notification,
                  isRead: true,
               };
            } else return n;
         });
         setNotifications(mNotifications);
      },
      []
   );

   // Mark notification when click open chat
   const markThisUserNotificationAsRead = useCallback(
      (thisUserNotifications, notifications) => {
         // Mark notification as read
         const mNotifications = notifications.map((n) => {
            let notification;
            thisUserNotifications?.forEach((el) => {
               if (el.senderId === n.senderId) {
                  notification = { ...el, isRead: true };
               } else notification = n;
            });
            return notification;
         });

         setNotifications(mNotifications);
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
            onlineUsers,
            notifications,
            allUsers,
            markAllNotificationsAsRead,
            markNotificationAsRead,
            markThisUserNotificationAsRead,
         }}>
         {children}
      </ChatContext.Provider>
   );
};
