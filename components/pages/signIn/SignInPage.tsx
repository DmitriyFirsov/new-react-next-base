import {useState, ChangeEvent, MouseEvent} from "react";
import {useMutation, gql} from "@apollo/client";
import useSignIn from "../../../apollo/mutations/useSignIn";

type FormState = {
    email: string;
    password: string;
}

export default function SignInPage() {
    const [formState, setFormState] = useState<FormState>({email: '', password: ''});


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        const eventIsBlur = event.type === 'blur';

        setFormState((prevState) => {
            return {
                ...prevState,
                [name]: eventIsBlur ? value.trim() : value
            }
        })
    }

    const [signIn, {data, loading, error}] = useSignIn();

    const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        await signIn(formState)
    }

    return <div>
        <form>
            <input type={"email"} name={'email'} value={formState.email} onChange={handleChange} onBlur={handleChange}/>
            <input type={"text"} name={'password'} value={formState.password} onChange={handleChange}
                   onBlur={handleChange}/>
            <button onClick={handleClick}>
                Sign In
            </button>
        </form>
    </div>
}





