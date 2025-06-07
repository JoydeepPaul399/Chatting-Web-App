import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { FaRegImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import uploadFile from '../helpers/uploadFile';
import { MdSend } from "react-icons/md";
import backgroundImage from '../assets/wallapaper.jpeg'
import { IoSend } from "react-icons/io5";
// moment js to display dat and time
import moment from 'moment/moment';




const MessagePage = () => {
  // As we are navigating to /userId from userSearchCard component. useParams getting this userId key as we have defined :userId in Routes/index.js file 
  const params= useParams()
  // console.log(params.userId)

  const user= useSelector(state=>state?.user)

  // This will be filled by the data which will come from my backend server. (The Socket connection we created in useEffect)
  const [dataUser, setDataUser]= useState({
    name:"",
    email: "",
    profile_pic:"",
    _id: "",
    online: false
  })
  // using socket connection to emit event
  const socketConnection= useSelector(state=>state?.user?.socketConnection)

  // To show and hide image and video upload input box 
  const [openImageVideoUpload, setOpenImageVideoUpload]= useState(false)
  const [imageVideoUpload, setImageVideoUpload]= useState(false)

  // State to store the messages 
  const [message, setMessage]= useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  })

  // Store the messages, user sends and receives
  const [allMessages, setAllMessages]= useState([])
  //This is attached to message section to scroll the message to the bottom when new message comes or user sends a new message
  const currentMessage= useRef()

  // This will scroll the message to the bottom when new message comes or user sends a new message
  useEffect(()=>{
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({behavior : "smooth", block: "end" })
    }
  }, [allMessages])

  const handleImageVideoUploadOpen= ()=>[
    setOpenImageVideoUpload(!openImageVideoUpload)
  ]
  
  useEffect(()=>{
    if(socketConnection){
      socketConnection.emit("message-page", params.userId)

      socketConnection.on("seen", params.userId)

      // Listening for message-user event 
      socketConnection.on("message-user", (data)=>{
        setDataUser(data)
      })

      socketConnection.on("message", (data)=>{
        // console.log("The message data is ", data)
        setAllMessages(data)
      })

      // socketConnection.on("conversation-with-user", (data)=>{
      //   console.log("The conversation data is ", data)
      // })
    }

  }, [socketConnection, params?.userId, user])


  // Function to upload Image 
  const handleUploadImage= async (e)=>{
    try {
      e.preventDefault()
      e.stopPropagation()
      setImageVideoUpload(true)

      const file= e.target.files[0]
      const uploadedImage= await uploadFile(file)
      setOpenImageVideoUpload(false)

      setMessage((prev)=>{
        return {
          ...prev, imageUrl: uploadedImage.url
        }
      })

      
    } catch (error) {
      
    }
    finally{
      setImageVideoUpload(false)
    }
  }

  // Function to upload Video 
  const handleUploadVideo= async (e)=>{
    try {
      e.preventDefault()
      e.stopPropagation()
      setImageVideoUpload(true)

      const file= e.target.files[0]
      const uploadVideo= await uploadFile(file)

      setMessage((prev)=>{
        return {
          ...prev, videoUrl: uploadVideo.url
        }
      })

      
    } catch (error) {
      
    }
    finally{
      setImageVideoUpload(false)
    }
  }

  const handleClearImageUpload= ()=>{
    setMessage((prev)=>{
      return {
        ...prev,
        imageUrl: ""
      }
    })
  }

  const handleClearVideoUpload= ()=>{
    setMessage((prev)=>{
      return {
        ...prev,
        videoUrl: ""
      }
    })
  }

  // Function to change the value of Send message input box 
  const handleOnChange= (e)=>{
    setMessage((prev)=>{
      return {
        ...prev, text:e.target.value
      }
    })
  }

  // send message function 
  const handleSendMessage= async (e)=>{
    try {
      e.preventDefault()
      e.stopPropagation()

      if(message.text || message.imageUrl || message.videoUrl){
        if(socketConnection){
          socketConnection.emit("new-message", {
            sender: user?._id,
            receiver: params?.userId,
            text: message.text,
            imageUrl: message.imageUrl,
            videoUrl: message.videoUrl,
            msgByUserId: user?._id

          })
          setMessage({ 
            text: "", 
            imageUrl: "", 
            videoUrl: "" 
          });
        }
      }
      
    } catch (error) {
      
    }
  }

  

  return (
    <div className='relative bg-no-repeat bg-cover' style={{backgroundImage: `url(${backgroundImage})`}} >
      <header className='sticky top-0 h-16 bg-white px-5 flex items-center justify-between '>
        <div className='flex items-center gap-4'>
          <Link to={"/"}>
            <IoArrowBack size={20} />
          </Link>
          <div>
            <Avatar userId={dataUser._id} imageUrl={dataUser?.profile_pic} name={dataUser?.name}  />
          </div>
          <div>
            <h3 className='font-semibold text-lg text-ellipsis line-clamp-1 '>{dataUser?.name}</h3>
            <p className='-my-1 text-sm '>
              {
                dataUser?.online ? (<span className="text-blue-400" >Online</span>) : (<span className='text-slate-500' >Offline</span>)
              }
            </p>
          </div>
        </div>

        {/* Three dot button  */}
        <div>
          <button className='text-[#504f4f] cursor-pointer hover:text-black'><BsThreeDotsVertical size={20} /></button>
        </div>

      </header>

      {/* show all messages  */}
      {/* 64+64= 128px, 64px allocated for header and another 64px is allocated for send message section */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar bg-slate-200 bg-opacity-50">
        
        

        {/* show all messages here  */}
        <div className='flex flex-col py-2' ref={currentMessage}>
          {
            allMessages?.map((message, index)=>{
              return (
                <div ref={currentMessage} key={index} className={`bg-white mx-2 my-2 p-1  w-fit max-w-[200px] md:max-w-sm lg:max-w-[350px] rounded ${user._id === message?.msgByUserId ? "ml-auto bg-teal-500" : "bg-white"}`}>
                  <div className=''>
                    {message.imageUrl && (
                      <img src={message.imageUrl} alt="Uploaded Image" className=' w-full h-full object-scale-down ' />)
                    }
                  </div>

                  {
                      message.videoUrl && (
                        <video src={message.videoUrl} controls className=' ww-full h-full object-scale-down ' ></video>
                      )
                    }
                    
                  <p className='px-3 text-ellipsis line-clamp-1'>{message.text}</p>
                  {/* momentjs to display the time and date of the message  */}
                  <p className='text-xs w-fit ml-auto' >{moment(message.createdAt).format('hh:mm')}</p>
                </div>
              )
            })
          }
        </div>


        {/* Upload Image display */}
        {
          message.imageUrl && (
          <div className='w-full h-full bg-slate-700 bg-opacity-40 flex justify-center items-center rounded overflow-hidden sticky bottom-0' >
            <button onClick={handleClearImageUpload} className='absolute top-1 right-1 hover:text-white'><IoClose size={25} /></button>
            <div className='bg-white p-3'>
              <img src={message.imageUrl} alt="Uploaded Image" className='aspect-video w-full h-full max-w-sm m-2 object-scale-down ' />
            </div>
          </div>
          )
        }

        {/* Video display  */}
        {
          message.videoUrl && (
          <div className='w-full h-full bg-slate-700 bg-opacity-40 flex justify-center items-center rounded overflow-hidden sticky bottom-0' >
            <button onClick={handleClearVideoUpload} className='absolute top-1 right-1 hover:text-white'><IoClose size={25} /></button>
            <div className='bg-white p-3'>
              <video src={message.videoUrl} controls className='aspect-video w-full h-full max-w-sm m-2 object-scale-down ' ></video>
            </div>
          </div>
          )
        }
          

      </section>


      {/* send message section */}
      <section className='h-16 bg-white flex items-center px-4'>
        {/* Image and video upload button  */}
        <div className=' relative '>

          <button onClick={handleImageVideoUploadOpen} className='flex justify-center items-center w-12 h-12 cursor-pointer rounded-full  hover:bg-blue-300 hover:text-white'>
            {
              openImageVideoUpload ? <IoClose size={20} /> : <FaPlus size={20} />
            }
            
          </button>

          {/* video and image popup when user click on + button then it will be appeared */}
          {
            openImageVideoUpload && (

              <div className='bg-white shadow rounded absolute bottom-12 w-36 p-2 '>
                <form>
                  {/* To upload the image */}
                  <label htmlFor='uploadImage' className='flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-slate-200'>
                    <div className='text-primary '>
                    <FaRegImage size={18} />
                    </div>
                    <p>Image</p>
                  </label>

                  {/* To upload video */}
                  <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-slate-200'>
                    <div className='text-purple-500'>
                      <FaVideo size={18} />
                    </div>
                    <p>Video</p>
                  </label>

                  <input type="file" id="uploadImage" onChange={handleUploadImage} className='hidden'  />
                  <input type="file" id="uploadVideo" onChange={handleUploadVideo} className='hidden'   />


                </form>
              </div>

            )
          }

        </div>

        {/* Input box to send messages  */}
        <form className='w-full h-full flex justify-center items-center gap-2' onSubmit={handleSendMessage} >
          <input type="text" placeholder='Enter Your Message' className='py-1 px-4 outline-none w-full h-full' value={message.text} onChange={handleOnChange} />
          <button type='submit' className='text-primary hover:text-secondary'><IoSend size={25} /></button>
        </form>
      </section>

      {/* Spinner Overlay while uploading a video or an image*/}
      {
        imageVideoUpload && (
          <div className="bg-white bg-opacity-70 flex items-center justify-center w-full h-full absolute z-50 top-0 left-0">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        )
        }
    </div>
  )
}

export default MessagePage
