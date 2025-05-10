import React, { useRef, useState } from 'react'
import Avatar from './Avatar'
import uploadFile from '../helpers/uploadFile'
import Divider from './Divider'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { updateUserDetails } from '../redux/userSlice'

const EditUserDetails = ({onClose, data}) => {
    // setTimeout(()=>{
    //     onClose()
    // }, 5000)
    // This is to show loading while uploading photo to cloudinary 
    const [uploading, setUploading]= useState(false)
    
    const [editData, setEditData]= useState({
        name: data?.name,
        profile_pic: data?.profile_pic
    })

    // This ref I have attached with input since I have to click it programaticlly
    const uploadPhotoRef= useRef()
    const dispatch= useDispatch()

    const handleOnChange= (e)=>{
        const {name, value}= e.target
        setEditData({...editData, [name]: value})
    }

    // Uploading photo to cloudinary 
    const handleUploadPhoto= async (e)=>{

        try{
            e.preventDefault()
            e.stopPropagation()
            const file= e.target.files[0]
            setUploading(true)
            const uploadPhoto= await uploadFile(file)
            setEditData((prev)=>{
                return {
                    ...prev, profile_pic: uploadPhoto?.url
                }
            })

            toast.success("Image Updated successfully")
            console.log(uploadPhoto)
            
        }
        catch(error){
            toast.error("Error while uploading image")
            console.log("Error is ", error)
        }
        finally{
            setUploading(false)
        }
        
    }

    

    // using click method I am just clicking the input box programatically
    const handleOpenUploadPhoto= (e)=>{
        e.preventDefault()
        e.stopPropagation()
        uploadPhotoRef.current.click()
    }

    const handleSubmit= async (e)=>{
        e.preventDefault()
        e.stopPropagation()
        try{
            const URL= `${process.env.REACT_APP_BACKEND_URL}/api/update-user`
            const response= await axios.post(URL, editData, {
                withCredentials: true
            })

            toast.success(response?.data?.message)
            console.log(response)

            dispatch(updateUserDetails(editData))
            onClose()
        }
        catch(error){
            toast.error(error?.response?.data?.message)
        }

    }


  return (
    <div className='fixed left-0 right-0 top-0 bottom-0 z-10 bg-gray-200 bg-opacity-40 flex justify-center items-center'>
      <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
        <h2 className='font-semibold'>Profile Details</h2>
        <p className='text-sm'>Edit User Details</p>

        <form className='grid gap-3 mt-3' onSubmit={handleSubmit} >
            <div className='flex flex-col gap-1'>
                <label htmlFor="name">Name</label>
                <input type="text" name='name' id='name' value={editData.name} onChange={handleOnChange} className='w-full py-1 px-2 outline-none border border-amber-300 rounded' />
            </div>
            <div>
                <label htmlFor="profile_pic">Photo
                    <div className='my-1 flex items-center gap-3'>
                        <Avatar width={40} height={40} imageUrl= {editData.profile_pic} name={editData.name} />
                        <button onClick={handleOpenUploadPhoto} className='font-semibold'>Change Photo</button>
                        {
                            uploading && (
                                <p className='text-green-500'>Uploading! Please wait... </p>
                            )
                        }
                        <input type="file" name="profile_pic" id="profile_pic" className='hidden' onChange={handleUploadPhoto} ref={uploadPhotoRef} />
                    </div>
                </label>
            </div>
            
            <Divider/>
            <div className='flex gap-3 justify-end '>
                <button onClick={onClose} className='border border-red-600 px-4 bg-red-600 text-white font-semibold py-1 rounded hover:bg-red-700 transition-all duration-1000 ease-in-out'>Cancel</button>
                <button type='submit' className='border border-primary bg-primary text-white px-4 py-1 font-semibold rounded hover:bg-secondary'>Save</button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserDetails
