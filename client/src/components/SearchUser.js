import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IoClose } from "react-icons/io5";


const SearchUser = ({onClose}) => {
    const [searchUser, setSearchUser]= useState([])
    const [loading, setLoading]= useState(false)
    const [search, setSearch]= useState("")
    
    const handleSearchUser= async ()=>{
        const URL= `${process.env.REACT_APP_BACKEND_URL}/api/search-user`
        try {
            setLoading(true)
            const response= await axios.post(URL, {
                search: search
            })

            setSearchUser(response.data.data)
            // console.log(response)
            // toast.success(response.data.message)

        } catch (error) {
            toast.error(error?.response?.data?.message)
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }

    // useEffect(()=>{
    //     handleSearchUser()
    // }, [search])

    // debounce function that will call the api after 2 seconds if users stop to type. 
    useEffect(() => {
        if (search.trim() === "") {
            setSearchUser([]); // Clear result if search is empty
            setLoading(false);
            return;
        }
    
        setLoading(true);
        const delayDebounce = setTimeout(() => {
            handleSearchUser();
        }, 1000); 
    
        return () => clearTimeout(delayDebounce); // Clear previous timer
    }, [search]);
    

    // console.log(search)
    // const cancelBtn= (e)=>{
    //     e.preventDefault()
        
    //     onClose()
    // }

  return (
    <div  className='fixed top-0 right-0 left-0 bottom-0 bg-slate-700 bg-opacity-40 p-2 '>
      <div className='w-full max-w-md mx-auto mt-10'>
        {/* input search  */}
        <div className='bg-white rounded h-14 overflow-hidden flex '>
            <input type="text" placeholder='Search user by name, email...' className='w-full outline-none py-1 h-full px-2 rounded' value={search} onChange={(e)=>setSearch(e.target.value)} />
            <div className='w-14 h-14 flex justify-center items-center cursor-pointer'>
                <IoSearchOutline size={25} />
            </div>
        </div>

        {/* display search result  */}
        <div className='bg-white w-full p-4 rounded mt-3'>
            {/* No user found  */}
            {
                searchUser.length===0 && !loading && (
                    <p className='text-center text-slate-500'>No User Found!</p>
                )
            }

            {
                loading && (
                    <div className='w-full h-full flex items-center justify-center'>
                        <div className='w-8 h-8 rounded-full  border-4 border-gray-300 border-t-amber-500 animate-spin'></div>
                    </div>
                )
            }

            {
                searchUser.length > 0 && !loading && (
                    searchUser.map((user, index)=>{
                        return (
                            <UserSearchCard onClose={onClose} key={user._id} user={user} />
                        )
                    })
                )
            }
        </div>
      </div>
      <div>
        <button className='absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white' onClick={onClose}>
            <IoClose size={25} />
        </button>
      </div>
    </div>
  )
}

export default SearchUser
