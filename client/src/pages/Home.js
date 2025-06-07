import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setUser, setOnlineUser, setSocketConnection } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo.png'
import io from 'socket.io-client' //This module helps to create websocket connection 

const Home = () => {
  const dispatch= useDispatch()
  const user= useSelector(state=> state.user)
  // console.log("user is ", user)
  const navigate = useNavigate()
  const location= useLocation()

  // console.log("user ", user)

  // useEffect(()=>{
  //   if(user.name===""){
  //     navigate("/email")
  //   }
  // }, [user.name])
  
  const fetchUserDetails= async ()=>{
    try {
      const url= `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
      // const response= await axios({
      //   method: "GET",
      //   url: url,
      //   withCredentials: true
      // })

      const response = await axios.get(url, { withCredentials: true });
      // console.log()
      dispatch(setUser({...response.data.data}))
      

      if(response.data.logout){
        dispatch(logout())
        navigate("/email")
      }

      // console.log("current user details are ", response.data.data)

      
    } catch (error) {
      // console.log("Error while fetching the user data", error)
    }
  }

  useEffect(()=>{

    fetchUserDetails()
  }, [])
  // console.log("The user data is imp ", user)
  
  // console.log(location)
  // I will not show the Outlet if I am in / path

  // Now we will implement socket connection
  useEffect(()=>{
    const socketConnection= io(process.env.REACT_APP_BACKEND_URL, {
      // withCredentials: true that can be also done
      auth:{
        token: localStorage.getItem("token")
      }
    })

    // setting user online or not 
    socketConnection.on("onlineUser", (data)=>{
      dispatch(setOnlineUser(data))
    })

    // console.log("socket is ",  socketConnection)

    dispatch(setSocketConnection(socketConnection))

    return ()=>{
      socketConnection.disconnect()
    }
  }, [])

  
 


  const basePath= location.pathname === '/'

  return (
    <div className='grid lg:grid-cols-[320px,1fr] h-screen max-h-screen'>
      {/* in mobile version the sidebar will be hidden if the url is something else then /  */}
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar/>
      </section>

        {/* Message components */}
        {/* if path is / then Outlet component will be hidden  */}
      <section className={`${basePath && "hidden"}`}>
        {/* As we have nested component messagepage so using Outlet  */}
        <Outlet/>
      </section>
      {/* following div will be only visible in desktop version */}
      {/* <div className={`justify-center items-center flex-col gap-2 hidden lg:flex`}> */}
      <div className={`justify-center items-center flex-col gap-2 hidden ${basePath ? "lg:flex" : 'hidden'}`}>
        <div>
          <img src={logo} width={250} alt="logo" />
        </div>
        <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
      </div>
    </div>
  )
}

export default Home
