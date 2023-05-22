import { createContext, useEffect, useState, useCallback } from "react";
import { getRequest, baseURL, postRequest } from "../utilityfunction/service";
import { io } from "socket.io-client";


export const ChatContext = createContext();
 
export const ChatContextProvider = ({children, user}) =>  {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [futureChat, setFutureChat] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notification, setNotification] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    

    console.log("allUsers", allUsers);
    console.log("notification", notification);

    //initialize socket
    useEffect(() => {
        const newSocket = io("http://localhost:3001");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [user]);
    // online user
    useEffect(() => {
        if(socket === null) return;
        socket.emit("addNewUser", user?._id);
        socket.on("getOnlineUsers", (res)=> {
            setOnlineUsers(res);
        })

        return () => {
            socket.off("getOnlineUsers");
        }
    }, [socket]);

    //send message
    useEffect(() => {
        if(socket === null) return;

        const recipientId = currentChat?.members?.find((id) => id !== user?._id);
        
        socket.emit("sendMessage", {...newMessage, recipientId});
    }, [newMessage]);

    // receive message and notification
    useEffect(() => {
        if(socket === null) return;

        socket.on("getMessage", (res) => {
            if(currentChat?._id !== res.chatId) return;

            setMessages((prev) => [...prev, res]);
        });

        socket.on("getNotification", (res) => {
            const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

            if (isChatOpen) {
                setNotification((prev) => [{...res, isRead:true}, ...prev])
            } else {
                setNotification((prev) => [res, ...prev]);
            }
        })
        
        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        }
    }, [socket, currentChat]);

    useEffect(() => {
        const getUsers = async () => {
            const response = await getRequest(`${baseURL}/users/allusers`);
            
            if(response.error) {
                return console.log(" futureChat Error")
            }

            const fChat = response.filter((u) => { 
                let isChatCreated = false;
                if(user?._id === u._id) return false;

                if(userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    })
                }

                return !isChatCreated;

            });
            setFutureChat(fChat);
            setAllUsers(response);
        }
        getUsers();
    }, [userChats]);
    

    useEffect(() => {
        const getUserChats = async () =>{
            if(user?._id) {

                setIsUserChatsLoading(true);
                setUserChatsError(null);

                const response = await getRequest(`${baseURL}/chats/${user?._id}`);

                setIsUserChatsLoading(false);

                if(response.error) {
                    return setUserChatsError(response);
                }

                setUserChats(response);
            }
        }
        getUserChats()
    }, [user]);

    useEffect(() => {
        const getMessages = async () => {
            setIsMessagesLoading(true);
            setMessagesError(null);

            const response = await getRequest(`${baseURL}/messages/${currentChat?._id}`);

            setIsMessagesLoading(false);

            if(response.error) {
                return setMessagesError(response);
            }

            setMessages(response);
        }
        getMessages();
    }, [currentChat]);

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);

    const createChat = useCallback(async(firstId, secondId) => {
        const response = await postRequest(
            `${baseURL}/chats`, JSON.stringify({
                firstId, secondId
            }) 
        );
        
        if (response.error) {
            return console.log("Create chat error")
        }

        setUserChats((prev) => [...prev, response]);

    });

    const sendMessage = useCallback(async(textMessage, sender, currentChatId, setTextMessage) => {
        if(!textMessage) return console.log("You must type something");

        const response = await postRequest(`${baseURL}/messages`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage
        }));
        
        if (response.error) {
            return setSendTextError(response);
        }

        setNewMessage(response);
        setMessages((prev) => [...prev, response]);
        setTextMessage("");
    }, []);

    const markAllNotificationAsRead = useCallback((notification) => {
        const mNotification = notification.map((n) => {
            return {...n, isRead: true}
        });
        setNotification(mNotification);
    }, [])
    return <ChatContext.Provider
        value={{
            userChats,
            isUserChatsLoading,
            userChatsError,
            futureChat,
            createChat,
            currentChat,
            updateCurrentChat,
            messages,
            isMessagesLoading,
            messagesError,
            sendMessage,
            onlineUsers,
            notification,
            allUsers,
            markAllNotificationAsRead

        }}
    >
        { children}
    </ChatContext.Provider>

}