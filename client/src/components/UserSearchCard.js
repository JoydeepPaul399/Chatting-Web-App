import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'



const UserSearchCard = ({user, onClose}) => {
  return (
    <Link to={"/"+user?._id} onClick={()=>onClose()} className='flex items-center gap-4 p-2 lg:p-4 cursor-pointer border border-transparent border-b-slate-200 hover:border-primary rounded'>
      <div>
        <Avatar name={user?.name} userId={user?._id} imageUrl={user?.profile_pic} />
      </div>
      <div>
        <div className='font-semibold text-ellipsis line-clamp-1'>{user?.name}</div>
        <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
      </div>
    </Link>
  )
}

export default UserSearchCard
