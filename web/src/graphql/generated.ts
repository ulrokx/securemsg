import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type AddToChannelInput = {
  channelId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type Channel = {
  __typename?: 'Channel';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  members: Array<User>;
  messages: Array<Message>;
  name: Scalars['String'];
  typing: Array<User>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};


export type ChannelMessagesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type CreateChannelInput = {
  members: Array<Scalars['ID']>;
  name: Scalars['String'];
};

export type LoginInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  channel: Channel;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  text: Scalars['String'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  addToChannel: Channel;
  createChannel: Channel;
  login?: Maybe<User>;
  logout?: Maybe<Scalars['Boolean']>;
  register?: Maybe<User>;
  sendMessage: Message;
  typing: Channel;
  verify?: Maybe<User>;
};


export type MutationAddToChannelArgs = {
  data: AddToChannelInput;
};


export type MutationCreateChannelArgs = {
  data: CreateChannelInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationRegisterArgs = {
  data: RegisterInput;
};


export type MutationSendMessageArgs = {
  data: SendMessageInput;
};


export type MutationTypingArgs = {
  id: Scalars['ID'];
};


export type MutationVerifyArgs = {
  code: Scalars['Int'];
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  channel: Channel;
  me?: Maybe<User>;
  user?: Maybe<User>;
};


export type QueryChannelArgs = {
  id: Scalars['ID'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type SendMessageInput = {
  channelId: Scalars['ID'];
  text: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newMessage: Message;
};


export type SubscriptionNewMessageArgs = {
  id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  channels: Array<Channel>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  messages: Array<Message>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  username: Scalars['String'];
  verifiedEmail: Scalars['Boolean'];
};


export type UserChannelsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type UserMessagesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string, email: string, createdAt: any, updatedAt?: any | null } | null };


export const MeDocument = gql`
    query Me {
  me {
    id
    username
    email
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;