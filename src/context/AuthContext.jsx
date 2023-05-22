import { createContext, useState, useCallback, useEffect } from "react";
import { baseURL } from "../utilityfunction/service";
import { postRequest } from "../utilityfunction/service";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        email: "",
        password: "",
    });
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });


    useEffect(() => {
        const user = localStorage.getItem("User");

        setUser(JSON.parse(user));
    },[])

    //Signup
    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info);
    }, []);

    const registerUser = useCallback(async(e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);

        const response = await postRequest(`${baseURL}/users/signup`, JSON.stringify(registerInfo));

        setIsRegisterLoading(false);

        if(response.error) {
            return setRegisterError(response);
        }
        localStorage.setItem("User", JSON.stringify(response));
        setUser(null);
        location.reload();
    }, [registerInfo]);

    //Signin
    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info);
    }, []);

    const loginUser = useCallback(async(e) => {
        e.preventDefault();

        setIsLoginLoading(true);
        setLoginError(null);

        const response = await  postRequest(
            `${baseURL}/users/signin`,JSON.stringify(loginInfo)
        );

        setIsLoginLoading(false);
        if(response.error) {
            return setLoginError(response);
        }

        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);

        
        
    }, [loginInfo]);

    //Signin
    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    }, []);

    return <AuthContext.Provider 
        value = {
            {
                user,
                registerInfo,
                updateRegisterInfo,
                registerUser,
                registerError,
                isRegisterLoading,
                logoutUser,
                updateLoginInfo,
                loginUser,
                loginError,
                loginInfo,
                isLoginLoading

                
            }
        }
        >
        {children}
    </AuthContext.Provider>
}