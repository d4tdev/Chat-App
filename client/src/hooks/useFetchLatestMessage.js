import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { baseUrl, getRequest } from '../utils/services';

export const useFetchLatestMessage = (chat) => {
   const { newMessage, notifications } = useContext(ChatContext);
   const [latestMessage, setLatestMessage] = useState(null);

   useEffect(() => {
      const getMessages = async () => {
         const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

         if (response.error) return console.error(response.message);

         const latestMessage =
            response?.metadata[response?.metadata.length - 1];
         setLatestMessage(latestMessage);
      };
      getMessages();
   }, [newMessage, notifications]);
   return { latestMessage };
};
