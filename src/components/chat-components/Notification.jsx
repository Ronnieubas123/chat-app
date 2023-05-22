import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unreadNotification } from "../../utilityfunction/unreadNotification";


const Notification = () => {

    const [isOpen , setIsOpen] = useState(false);
    const {user} = useContext(AuthContext);
    const {notification, userChats, allUsers, markAllNotificationAsRead} = useContext(ChatContext);
    const unreadNotifications = unreadNotification(notification);
    const modifiedNotification = notification.map((n) => {
        const sender = allUsers.find((user) => user._id == n.senderId);

        return {
            ...n,
            senderName: sender?.name
        }
    });

    console.log("un", unreadNotifications);
    console.log("mn", modifiedNotification);

    return ( <>
        <div>
            <div className="flex justify-center item-center">
                <span className="text-sm mr-2">Message Notification</span>  
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" onClick={() => setIsOpen(!isOpen)}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                
                    {unreadNotifications?.length === 0 ? null: (
                        <div className="flex items-center justify-center relative right-2 text-xs text-white bg-red-500 h-3 w-3 rounded leading-none">
                        <span>
                            {unreadNotifications?.length}
                        </span>
                        </div>
                    )}
                
            </div>
            { isOpen ? (
                <div className=" bg-stone-300">
                    <div className="flex justify-center items-center">
                        <span className="text-sm font-semibold float-left">Notification</span>
                        <span className="w-12"></span>
                        <span className="text-xs font-norma hover:bg-red-700 hover:text-white " onClick={() => markAllNotificationAsRead(notification)} > 
                            Mark all as read
                        </span>
                    </div>
                    <div className="p-2 text-xs">
                    {modifiedNotification?.length === 0 ? <span>No Notification</span> : null}
                    {modifiedNotification && modifiedNotification.map((n, index) => {
                        return <div key={index} className={n.isRead ? 'pt-3 pb-3' : 'pt-3 pb-3 text-red-500'}>
                            <span className="pt-3 pb-3">
                                {`${n.senderName} sent you a new message`}
                            </span>
                        </div>
                    })}
                    </div>
                </div>
            ) : null}
            
        </div> 
    </> );
}
 
export default Notification;