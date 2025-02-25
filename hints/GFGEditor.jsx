import { useEffect } from "react"
import { Box } from '@mui/material';
import styled from '@emotion/styled';
import { useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useParams } from "react-router-dom";

const Component = styled.div`
    background: #F5F5F5;
`

//editor button for edit 
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],

    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']
];


const Editor = () => {
    const [quill, setQuill] = useState();
    const [socket, setSocket] = useState();
    const {id} = useParams();
    console.log('quill', quill)
    console.log('socket', socket)

    //initialization of quill server
    useEffect(() => {
        const quillServer = new Quill('#container', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions
            }
        })
        console.log('hello1')
        quillServer.disable();
        quillServer.setText('Loding the document.....')
        setQuill(quillServer)
    }, [])

    //connect the server 
    useEffect(() => {
        const socketServer = io('http://localhost:3000');
        setSocket(socketServer)
        console.log('hello2')


        //clean up function
        return () => {
            socketServer.disconnect()
        }

    }, [])

    //send text to server 
    useEffect(() => {
        if (socket === null || quill === null) return;

        const handleChange = (delta, oldData, source) => {
            if (source !== 'user') return;

            socket.emit('send-change', delta);
        }

        quill && quill.on('text-change', handleChange)
        console.log('hello3')

        return () => {
            quill && quill.of('text-change', handleChange)
        }
    }, [quill, socket])

    //update containt 
    useEffect(() => {
        if (socket === null || quill === null) return;

        const handleChange = (delta) => {
            quill.updateContents(delta);
        }

        socket && socket.on('receive-changes', handleChange);
        console.log('hello4')

        return () => {
            socket && socket.off('receive-changes', handleChange);
        }
    }, [quill, socket]);

    //load containt
    useEffect(() => {
        if (quill === null || socket === null) return;

        socket && socket.once('load-document', document => {
            quill.setContents(document);
            quill.enable();
        })
        console.log('hello5')

        socket && socket.emit('get-document', id);
    }, [quill, socket, id]);

    //save document 
    useEffect(() => {
        if (socket === null || quill === null) return;

        const interval = setInterval(() => {
            socket.emit('save-document', quill.getContents())
        }, 2000);
        console.log('hello6')

        return () => {
            clearInterval(interval);
        }
    }, [socket, quill]);


    return (
        <>
            <Component>
                <Box className='container' id='container'>
                </Box>
            </Component>
        </>
    )
}

export default Editor

//created by gfg referenced 
