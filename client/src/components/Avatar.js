import React from 'react'
import { FaRegCircleUser } from "react-icons/fa6";
import { useSelector } from 'react-redux';

const Avatar = ({userId, name, imageUrl, width, height}) => {
    // getting the IDs of online users 
    const onlineUser= useSelector(state=>state?.user?.onlineUser)


    let avatarName= ""
    if(name){
        const splitName= name?.split(" ")
        
        if(splitName.length > 1){
            avatarName= (splitName[0][0] + splitName[1][0]).toUpperCase()
            
        }
        else{
            avatarName= splitName[0][0].toUpperCase()
        }
    }

    // Checking whether the id is available in online user list 
    const isOnline= onlineUser.includes(userId)
    
  return (
    <div className='text-slate-800 w-10 h-10 rounded-full border  shadow flex relative'>
      {
        imageUrl ? (
            <img src={imageUrl}  alt={name} className='overflow-hidden rounded-full object-cover w-full h-full' />
        ) : (
            name ? (
                <div  className='overflow-hidden rounded-full text-center flex justify-center items-center w-full h-full bg-slate-200 font-bold'>
                    {
                        avatarName
                    }
                </div>
            ) : (
                    <FaRegCircleUser  className='w-full h-full'  />
                
            )
        )
      }
        {
            isOnline && (

                <div className='bg-green-500 p-1 absolute bottom-2 -right-1 rounded-full'></div>
            )
        }
    </div>
  )
}

export default Avatar
