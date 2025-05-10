import React, { useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';



const RegisterPage = () => {
  const [data, setData]= useState({
    name:"",
    email: "",
    password: "",
    profile_pic: ""
  })
  // for photoUpload loading spinner 
  const [uploading, setUploading]= useState(false)
  // for user register loading spinner 
  const [uploadUser, setUploadUser]= useState(false)

  const navigate= useNavigate()

  const [uploadPhoto, setUploadPhoto]= useState("")
  let [imgUrl, setImgUrl]= useState("")

  const handleOnChange= (e)=>{
    const {name, value}= e.target
    setData((prev)=>{
      return {...prev, [name]: value}
    })
  }

  const handleUploadPhoto= async (e)=>{
    try{
      // e.stopPropagation()
    const file= e.target.files[0]


    setUploading(true)

    // creating image url to show the preview to the user
    setUploadPhoto(file)
    setImgUrl(URL.createObjectURL(file))
    // if(file){
    // }
    // uploadFile we have created using cloudinary api 
    const uploadPhotoCloudinary= await uploadFile(file)
    // console.log("uploadPhoto", uploadPhoto)
    console.log("uploadPhotoCloudinary is ", uploadPhotoCloudinary)

    setData((preve)=>{
      return{
        ...preve,
        profile_pic : uploadPhotoCloudinary.url
      }
    })

    console.log(data)
    }
    catch(error){
      console.log(error)
    }
    finally{
      setUploading(false)
    }
  }

  // State updates are asynchronous in the sense that React does not update the component immediately after you call setData(). It schedules a re-render and applies the new state at the appropriate time, which happens after the current event handler finishes.

  useEffect(() => {
    console.log("Updated data: ", data);
  }, [data]);

  const removePhoto= (e)=>{
    e.stopPropagation()
    e.preventDefault()
    setUploadPhoto("")
    setImgUrl("")
    
  }

  const handleSubmit= async (e)=>{
    e.stopPropagation()
    e.preventDefault()

    // const URL= "http://localhost:8080/api/register"
    const URL= `${process.env.REACT_APP_BACKEND_URL}/api/register`
    try {
      setUploadUser(true)
      const response= await axios.post(URL, data)
      console.log("response is ", response)
      toast.success(response.data.message)
      setData({
        name:"",
        email: "",
        password: "",
        profile_pic: ""
      })

      navigate("/email")


    } 
    catch (error) {
      console.log(error)  
      toast.error(error.response.data.message)
      
    }

    finally{
      setUploadUser(false)
    }
  }

  // console.log(uploadPhoto)
  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto'>
        <h3>Welcome to ChatApp!</h3>

        <form className='grid gap-4 mt-4' onSubmit={handleSubmit} >

          <div className='flex flex-col gap-1'>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" placeholder='Enter Your Name' className='bg-slate-100 px-2 py-1 focus:outline-primary' value={data.name} onChange={handleOnChange} required />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" placeholder='Enter Your Email' className='bg-slate-100 px-2 py-1 focus:outline-primary' value={data.email} onChange={handleOnChange} required />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" placeholder='Enter Your Password' className='bg-slate-100 px-2 py-1 focus:outline-primary' value={data.password} onChange={handleOnChange} required />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor="profile_pic">Photo:
              <div className='h-25 bg-slate-200 flex justify-center items-center border rounded cursor-pointer hover:border-primary'>
                <div className='text-sm flex flex-col justify-around items-center gap-10 relative w-full'>
                  <p className='absolute top-0 right-2 cursor-pointer'>
                    {
                      imgUrl && <button type='button' onClick={removePhoto}><IoClose size={20} /></button>
                    }
                  </p>
                  <p>
                    {
                      imgUrl && <img src={imgUrl} alt="Profile" className='w-10 h-10 rounded-full absolute top-0 left-[45%]' />
                    }
                  </p>
                  <p>
                    {
                      uploadPhoto.name ? uploadPhoto.name : "Upload profile photo"
                      
                    }
                  </p>
                  
                </div>
              </div>
            </label>
                <div className=''>
                  {
                    uploading && <div className='flex justify-center items-center mt-4'><div className='w-8 h-8 rounded-full  border-4 border-gray-300 border-t-amber-500 animate-spin'></div></div>
                  }
                </div>
            {/* This will be hidden by default user can upload image by clicking on the label */}
            <input type="file" name="profile_pic" id="profile_pic" className='bg-slate-100 px-2 py-1 focus:outline-primary hidden' onChange={handleUploadPhoto} />
          </div>
          <button type='submit' className='bg-primary text-lg px-4 py-1 text-white font-bold rounded mt-4 hover:bg-secondary' > {!uploadUser ? "Register" : "Adding User" } </button>
        </form>
        <p className='py-3 text-center'>Already have an account ? <Link className='hover:text-primary hover:underline' to="/email" >Login</Link></p>
      </div>
    </div>
  )
}

export default RegisterPage
