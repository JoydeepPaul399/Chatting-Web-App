import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { RiLogoutBoxLine } from "react-icons/ri";
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import Divider from './Divider';
import { CgArrowTopLeft } from "react-icons/cg";
import SearchUser from './SearchUser';
import { FaImage } from "react-icons/fa6";
import { GoVideo } from "react-icons/go";
import { logout } from '../redux/userSlice';
import axios from 'axios';



const Sidebar = () => {
  // Getting user data from store
  const user= useSelector(state=>state?.user)
  const [editUserOpen, setEditUserOpen]= useState(false)
  const [allUser, setAllUser]= useState([])
  const [openSearchUser, setOpenSearchUser]= useState(false)
  const socketConnection= useSelector(state=>state?.user?.socketConnection)
  const dispatch= useDispatch()
  const navigate= useNavigate()

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user?._id);
  
      socketConnection.on("conversation", (data) => {
        const conversationUserData = data.map((conversationUser) => {
          if (conversationUser.sender._id === conversationUser.receiver._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          } else if (conversationUser.receiver._id !== user._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });
  
        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  const handleLogout= async()=>{
    try{
      
      let response= await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {}, {withCredentials: true})
      if(response.data.success){
        alert(response.data.message)
        dispatch(logout())
        localStorage.clear()
        navigate("/email")
      }
    }
    catch(err){
      console.log(err)
    }
  }
  
    useEffect(() => {
      if (!user._id) {
        navigate("/email");
      }
    }, [user]);


  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr]'>
      <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 flex flex-col justify-between items-center'>

        <div>
          {/* chatLogo */}
          <NavLink className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer rounded hover:bg-slate-200 text-slate-600 hover:text-black ${isActive && "bg-slate-200"}`} title='Chat'>
              <IoChatbubbleEllipsesSharp size={25} />
          </NavLink>

          {/* Add user logo  */}
          <div onClick={()=>setOpenSearchUser(true)} className='w-12 h-12 flex justify-center items-center cursor-pointer rounded hover:bg-slate-200 text-slate-600 hover:text-black' title='Add Friend'>
              <FaUserPlus  size={25} />
          </div>
        </div>

        <div className='flex flex-col items-center'>

          <button title={user?.name} onClick={()=>setEditUserOpen(true)} >
            <Avatar width={40} height={40} name={user?.name} imageUrl={user?.profile_pic} userId={user?._id} />
          </button>

          <button className='w-12 h-12 flex justify-center items-center cursor-pointer rounded hover:bg-slate-200 text-slate-600 hover:text-black' title='Logout' onClick={handleLogout}>
            <span className='-ml-2'>
              <RiLogoutBoxLine size={25} />
            </span>
          </button>

        </div>


      </div>

      <div className='w-full'>
        <div className='h-16 flex items-center'>
          <h1 className='text-lg font-bold p-4 text-slate-800'>Message</h1>
        </div>
        {/* The divider line  */}
        <div className='bg-slate-200 p-[0.5px]'></div>
        {/* message box  */}
        {/* Created custom scrollbar, the css code is there in app.css file. we are using scrollbar class */}
        <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
          {
            allUser.length === 0 && (
              <div className='mt-12'>
                <div className='flex justify-center items-center cursor-pointer text-slate-500'><CgArrowTopLeft size={50} /></div>
                <p className='text-lg text-center text-slate-600'>Browse users to start a conversation.</p>
              </div>
            )
          }

          {
            allUser.map((conv, index)=>{
              return (
                <NavLink to={"/"+conv?.userDetails?._id} key={index} className='flex items-center gap-2 cursor-pointer hover:bg-slate-200 p-2 '>
                  <div>
                    <Avatar width={50} height={50} name={conv.userDetails.name} imageUrl={conv.userDetails.profile_pic} userId={conv.userDetails._id} />
                  </div>
                  <div className='w-full'>
                    <h3 className='text-ellipsis line-clamp-1'>{conv.userDetails.name}</h3>
                    <div className='flex items-center justify-between w-full' >
                      <div className='flex items-center gap-1  overflow-x-hidden'>
                        <div>
                          {
                            conv.lastMsg.imageUrl && (
                              <span className='flex items-center gap-1 text-sm'><FaImage /> <span className='font-semibold'>Photo</span></span>
                            )
                          }
                          {
                            conv.lastMsg.videoUrl && (
                              <span className='flex items-center gap-1 text-sm'><GoVideo /> <span className='font-semibold'>Video</span></span>
                            )
                          }
                        </div>
                        <p className='text-sm text-ellipsis whitespace-nowrap overflow-hidden'>{conv.lastMsg.text}</p>
                      </div>
                      {
                        Boolean(conv.unseenMsg) && (
                          <p className='text-sm text-white font-semibold bg-green-500 rounded-full w-5 h-5 text-center'>{conv.unseenMsg}</p>
                        )
                      }
                      
                    </div>
                  </div>
                </NavLink>
              )
            })
          }
        </div>
      </div>


      {/* Place to show the edit user component */}
      {
        editUserOpen && <EditUserDetails onClose={()=>setEditUserOpen(false)} data={user}  />
      }

      {/* Search User  */}
      {
        openSearchUser && (
          <SearchUser onClose= {()=>setOpenSearchUser(false)} />
        )
      }


    </div>
  )
}

export default Sidebar
