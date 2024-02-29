import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import defaultAvt from '../../assets/default_avt.svg';

const PotentialChats = () => {
   const { user } = useContext(AuthContext);
   const { potentialChats, createChat } = useContext(ChatContext);

   return (
      <>
         <div className="all-users">
            {potentialChats &&
               potentialChats?.map((u, index) => {
                  return (
                     <div
                        className="single-user"
                        key={index}
                        onClick={() => createChat(user?._id, u?._id)}>
                        <div></div>
                        <div className="mx-1 d-flex align-items-center flex-column">
                           <img src={defaultAvt} height="40px" />
                           <div
                              className="text-content text-center "
                              style={{
                                 marginTop: '2px',
                              }}>
                              {u.name}
                           </div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                           <span className="potential-online"></span>
                        </div>
                     </div>
                  );
               })}
         </div>
      </>
   );
};

export default PotentialChats;
