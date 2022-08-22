import {useMemo} from "react";
import {ApolloClient, InMemoryCache, HttpLink, from} from '@apollo/client';
import merge from 'lodash/merge';
import {GetServerSidePropsResult} from "next/types";

let cashedClient: null | ApolloClient<unknown>

function createClient() {
    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        cache: new InMemoryCache(),
        link: from([
            new HttpLink({
                uri: process.env.URI
            })
        ])
    })
}

export function initializeApollo(initialState: unknown = null) {
    const apolloClient = cashedClient ?? createClient();

    if (initialState) {
        const existingCache = apolloClient.extract();

        const data = merge(existingCache, initialState);

        apolloClient.cache.restore(data);
    }

    if (typeof window === 'undefined') {
        return apolloClient;
    }

    cashedClient = apolloClient;

    return apolloClient;
}

type WithApolloState<P extends object> = P & {
    APOLLO_STATE: unknown
}

export function addApolloState<T, P extends object>(client: ApolloClient<T>, pageProps: P): GetServerSidePropsResult<WithApolloState<P>> {
    return {
        props: {
            ...pageProps,
            APOLLO_STATE: client.cache.extract()
        }
    }
}

export function useApollo(pageProps: { props?: WithApolloState<{}> }) {
    const state = pageProps.props?.APOLLO_STATE;
    return useMemo(() => initializeApollo(state), [state])
}