import Quill from 'quill';
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useState } from 'react';
import { io } from "socket.io-client";

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


const QuillEditor = () => {
    const [sockets, setSockets] = useState()
    const [quills, setQuills] = useState()

    useEffect(() => {
        const socket = io('http://localhost:3000/', {
            transports: ['websocket'],
        });
        setSockets(socket);

        socket.on('send-changes', (delta) => {
            console.log('delta', delta);

        })

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        return () => {
            socket.disconnect();
        }
    }, [])

    //text change for quill and send on the socket
    useEffect(() => {
        if (sockets == null || quills == null) return;

        const handler = (delta) => {
            quills.updateContents(delta);
        }

        sockets.on('receive-changes', handler);
        return () => {
            sockets?.off('receive-changes', handler);
        }

    },[sockets, quills])

    //text change for quill and send on the socket
    useEffect(() => {
        if (sockets == null || quills == null) return;

        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return;
            sockets.emit('send-changes', delta);

        }

        quills?.on('text-change', handler);
        return () => {
            quills?.off('text-change', handler);
        }

    },[sockets, quills])

    const wraperRef = useCallback((wrapper) => {
        if (wrapper == null) return;

        wrapper.innerHTML = '';

        const editor = document.createElement('div');
        wrapper.appendChild(editor);

        const quill = new Quill(editor, {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions

            },
            history: {
                delay: 2000,
                maxStack: 500,
                userOnly: true
            },

        })

        setQuills(quill);

        console.log('quill', quill);
        quill.history.clear();
    }, [])


    return (
        <>
            <div className="">
                <h1 className='text-center font-bold p-2 text-xl'>Google Docs</h1>
                <div id="container" className="" ref={wraperRef}>

                </div>
            </div>

        </>
    )
}

export default QuillEditor
