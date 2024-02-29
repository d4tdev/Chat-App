import { createContext, useCallback, useEffect, useState } from 'react';
import { baseUrl, postRequest } from '../utils/services';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [registerError, setRegisterError] = useState(null);
   const [isRegisterLoading, setIsRegisterLoading] = useState(false);
   const [loginError, setLoginError] = useState(null);
   const [isLoginLoading, setIsLoginLoading] = useState(false);
   const [registerInfo, setRegisterInfo] = useState({
      name: '',
      email: '',
      password: '',
      username: '',
   });
   const [loginInfo, setLoginInfo] = useState({
      email: '',
      password: '',
   });
   useEffect(() => {
      const user = localStorage.getItem('user');

      setUser(user ? JSON.parse(user) : null);
   }, []);

   const updateRegisterInfo = useCallback((info) => {
      setRegisterInfo(info);
   }, []);
   const registerUser = useCallback(
      async (e) => {
         e.preventDefault();
         setIsRegisterLoading(true);
         setRegisterError(null);

         const response = await postRequest(
            `${baseUrl}/users/register`,
            registerInfo
         );

         setIsRegisterLoading(false);
         if (response.error) return setRegisterError(response.message);

         localStorage.setItem('user', JSON.stringify(response.metadata));
         setUser(response.metadata);
      },
      [registerInfo]
   );

   const updateLoginInfo = useCallback((info) => {
      setLoginInfo(info);
   }, []);
   const loginUser = useCallback(
      async (e) => {
         e.preventDefault();
         setIsLoginLoading(true);
         setLoginError(null);

         const response = await postRequest(
            `${baseUrl}/users/login`,
            loginInfo
         );

         setIsLoginLoading(false);
         if (response.error) return setLoginError(response.message);

         localStorage.setItem('user', JSON.stringify(response.metadata));
         setUser(response.metadata);
      },
      [loginInfo]
   );

   const logoutUser = useCallback(() => {
      localStorage.removeItem('user');
      setUser(null);
   }, []);

   return (
      <AuthContext.Provider
         value={{
            user,
            registerInfo,
            updateRegisterInfo,
            registerUser,
            registerError,
            isRegisterLoading,
            loginInfo,
            updateLoginInfo,
            loginUser,
            loginError,
            isLoginLoading,
            logoutUser,
         }}>
         {children}
      </AuthContext.Provider>
   );
};
