import React, { useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaRegCircleUser } from "react-icons/fa6";
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';



const CheckPassword = () => {

  
  const location= useLocation()
  const [data, setData]= useState({
    userId: location?.state?._id,
    password: ""
  })
  const dispatch= useDispatch()

  // console.log("The Data is ", data)
  // console.log("location is ", location)

  const navigate= useNavigate()

  const handleOnChange= (e)=>{
    const {name, value}= e.target
    setData((prev)=>{
      return {...prev, [name]: value}
    })
  }



  
  

  const handleSubmit= async (e)=>{
    e.stopPropagation()
    e.preventDefault()

    // const URL= "http://localhost:8080/api/register"
    const URL= `${process.env.REACT_APP_BACKEND_URL}/api/password`
    try {
      const response= await axios.post(URL, data, {
        withCredentials: true
      })
      toast.success(response.data.message)
      if(response.data.success){
        setData({
          password: ""
        })

        dispatch(setToken(response?.data?.token))
        localStorage.setItem("token", response?.data?.token)
      }

      navigate("/")


    } 
    catch (error) {
      toast.error(error.response.data.message)
      
    }
  }

  useEffect(()=>{
    if(!location?.state?.name){
      navigate("/email")
    }
  }, [])


  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto'>
        <div className='w-fit mx-auto mb-2 rounded-full flex flex-col justify-center items-center'>
          <Avatar width={40} height={40} name={location?.state?.name} imageUrl={location?.state?.profile_pic}  />
          <h2>{location?.state?.name}</h2>
          {/* <Avatar width={40} height={40} name="Joydeep Paul"   /> */}
        </div>
        <h3>Welcome to ChatApp!</h3>

        <form className='grid gap-4 mt-3' onSubmit={handleSubmit} >

          

          <div className='flex flex-col gap-1'>
            <label htmlFor="password">Password: </label>
            <input type="password" name="password" id="password" placeholder='Enter Your Password' className='bg-slate-100 px-2 py-1 focus:outline-primary' value={data.password} onChange={handleOnChange} required />
          </div>

          

          
          <button type='submit' className='bg-primary text-lg px-4 py-1 text-white font-bold rounded mt-4 hover:bg-secondary' >Login</button>
        </form>
        <p className='py-3 text-center'><Link className='hover:text-primary hover:underline' to="/forgot-password" >Forgot Password</Link></p>
      </div>
    </div>
  )
}

export default CheckPassword
