import { useCallback } from "react"
import Quill from 'quill'
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router";

const SAVE_INTERVAL_MS = 2000
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];

const TextEditor = () => {
    //storing the state of socket and quill both server instace 
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState();
    const { url } = useParams()

    console.log(url.toString())

    //handle the socket connection of users
    useEffect(() => {
        const socketServer = io('http://localhost:3000/', {
            transports: ['websocket'],
        })
        setSocket(socketServer);
        return () => {
            socket.disconnect();
        }

    }, []);

    //get documents 
    useEffect(() => {
        if (socket == null || quill == null) return

        socket.once("load-document", document => {
            quill.setContents(document)
            quill.enable()
        })

        socket.emit("get-document", url)
    }, [socket, quill, url])

    //save documents 
    useEffect(() => {
        if (socket == null || quill == null) return
    
        const interval = setInterval(() => {
          socket.emit("save-document", quill.getContents())
        }, SAVE_INTERVAL_MS)
    
        return () => {
          clearInterval(interval)
        }
      }, [socket, quill])
      
    //update the text 
    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler = delta => {
            quill.updateContents(delta)
        }

        socket.on("receive-changes", handler)

        return () => {
            socket.off("receive-changes", handler)
        }
    }, [socket, quill])

    //text change 
    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler = (delta, oldDelta, source) => {

            if (source !== 'user') return;

            socket.emit('send-changes', delta)

        }
        quill.on('text-change', handler)

        return () => {
            quill.off('text-change', handler)
        }
    }, [socket, quill])





    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return;

        wrapper.innerHTML = ""
        const editor = document.createElement("div")

        wrapper.append(editor)

        const quill = new Quill(editor, {
            theme: "snow",
            modules: {
                toolbar: toolbarOptions
            }
        })
        setQuill(quill);


    }, [])


    return (
        <>

            <h1 className="text-center font-bold text-xl m-4">Google Docs</h1>

            <div id="container" ref={wrapperRef}>

            </div>
        </>
    )
}

export default TextEditor
