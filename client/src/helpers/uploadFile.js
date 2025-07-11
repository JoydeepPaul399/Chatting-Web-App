const url= `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`

const uploadFile= async (file)=>{
    const formData= new FormData()
    formData.append("file", file)
    // upload_preset is the predefined configuration 
    formData.append("upload_preset", "chat-app-file")

    const response= await fetch(url, {
        method: "POST",
        body: formData,
    })

    const responseData= await response.json()
    console.log(responseData)

    return responseData
}

export default uploadFile