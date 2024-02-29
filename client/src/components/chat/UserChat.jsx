import { Stack } from 'react-bootstrap';
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient';
import defaultAvt from '../../assets/default_avt.svg';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';

const UserChat = ({ chat, user }) => {
   const { recipientUser } = useFetchRecipientUser(chat, user);
   const { onlineUsers } = useContext(ChatContext);

   return (
      <Stack
         direction="horizontal"
         gap={3}
         className="user-card align-items-center p-2 justify-content-between"
         role="button">
         <div className="d-flex">
            <div className="me-2">
               <img src={defaultAvt} height="40px" />
            </div>
            <div className="text-content">
               <div className="name text-nowrap">{recipientUser?.name}</div>
               <div className="text">Text message</div>
            </div>
         </div>
         <div className="d-flex flex-column align-items-end">
            <div className="date">27/2/2024</div>
            <div className="this-user-notifications">2</div>
            <span
               className={
                  onlineUsers?.some((u) => u.userId === recipientUser?._id)
                     ? 'user-online'
                     : ''
               }></span>
         </div>
      </Stack>
   );
};

export default UserChat;
