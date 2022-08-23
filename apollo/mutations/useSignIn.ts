import {FetchResult, gql, MutationResult, useMutation} from "@apollo/client";

const QUERY = gql`
    fragment UserInfo on CurrentUser {
        avatarUrl
        id
        email
        firstName
        lastName
    }

    mutation signin($input: SignInInput!) {
        signin(input: $input) {
            me {
                ...UserInfo
            }
            accessToken
            refreshToken
        }
    }
`

type Mutate = (props: { email: string; password: string }) => Promise<FetchResult>

export default function useSignIn(): [Mutate, MutationResult<unknown>] {
    const [mutation, mutationResult] = useMutation(QUERY)

    const mutate = async (props: { email: string; password: string }) => {
        return mutation({variables: {input: props}});
    }


    return [mutate, mutationResult];
}