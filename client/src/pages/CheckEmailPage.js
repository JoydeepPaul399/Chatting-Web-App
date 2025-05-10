import React, { useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaRegCircleUser } from "react-icons/fa6";



const CheckEmailPage = () => {

  const [data, setData]= useState({
    email: ""
  })

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
    const URL= `${process.env.REACT_APP_BACKEND_URL}/api/email`
    try {
      const response= await axios.post(URL, data)
      toast.success(response.data.message)
      if(response.data.success){
        setData({
          email: ""
        })
      }

      navigate("/password", {
        state: response?.data.data
      })


    } 
    catch (error) {
      toast.error(error.response.data.message)
      
    }
  }


  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto'>
        <div className='w-fit mx-auto mb-2'>
          <FaRegCircleUser size={80} />
        </div>
        <h3>Welcome to ChatApp!</h3>

        <form className='grid gap-4 mt-3' onSubmit={handleSubmit} >

          

          <div className='flex flex-col gap-1'>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" placeholder='Enter Your Email' className='bg-slate-100 px-2 py-1 focus:outline-primary' value={data.email} onChange={handleOnChange} required />
          </div>

          

          
          <button type='submit' className='bg-primary text-lg px-4 py-1 text-white font-bold rounded mt-4 hover:bg-secondary' >Let's Go</button>
        </form>
        <p className='py-3 text-center'>New User ? <Link className='hover:text-primary hover:underline' to="/register" >Register</Link></p>
      </div>
    </div>
  )
}

export default CheckEmailPage
