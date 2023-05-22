import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const FutureChat = () => {
    const { user } = useContext(AuthContext);
    const { futureChat, createChat, onlineUsers } = useContext(ChatContext);
    return (<>
    { futureChat && futureChat.map((futureUser, index) => {
        return (
            <button
                onClick={() => createChat(user._id, futureUser._id)}
                key={index}
                className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                >
                    <div
                        className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"
                    >
                        H
                    </div>
                    <span className={
                        onlineUsers?.some((users) => users.userId === futureUser?._id )
                        ? "flex w-3 h-3 bg-green-500 rounded-full"
                        : "flex w-3 h-3 bg-gray-200 rounded-full"
                    }>
                        
                    </span>
                    <div className="ml-2 text-sm font-semibold">{ futureUser.name}</div>
            </button>
        )
    })}
        
    </>);
}
 
export default FutureChat;