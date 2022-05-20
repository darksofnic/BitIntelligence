import {useState} from "react";

const Comments = () => {
<<<<<<< HEAD

    const [value, setValue] = useState('Comments:');

    return (<textarea value={value} onChange={(e:any) => setValue(e.target.value) } />)
=======
    return (
        <>
        <textarea> Comments: </textarea>
        </>
    )
>>>>>>> d0042f81fc99a4b7c22e0faef8bf46dbaaca06c8
}
export default Comments
