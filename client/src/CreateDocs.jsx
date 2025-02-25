import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

const CreateDocs = () => {
    const [data, setData] = useState(
        {
            name: "",
            url: ""
        }
    )
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault()

        navigate(`/docs/${data.url}`)
        console.log('data', data)

    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 w-1/2">
                <h1 className="text-3xl font-bold mb-4">
                    Create Docs Page
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col space-y-4"
                >
                    <label htmlFor="name" className="text-gray-700">
                        Name
                    </label>
                    <input
                        required
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => { setData({ ...data, name: e.target.value }) }}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                    />

                    <label htmlFor="url" className="text-gray-700">
                        Docs url
                    </label>
                    <input
                        required
                        id="url"
                        type="text"
                        value={data.url}
                        onChange={(e) => { setData({ ...data, url: e.target.value }) }}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                    />

                    <Button variant="contained" type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CreateDocs
