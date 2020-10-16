import React , {Fragment, useEffect} from 'react';
import { ApolloClient,ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import { SocketIOProvider, useSocket } from "use-socketio";


import Routing from './components/routing/Routes';
import './styles/tailwind.css';
import 'antd/dist/antd.css';

const socketUrl = process.env.SOCKET_URL ||
"https://kopihub-api-ura2vr67wa-as.a.run.app";

const link = createHttpLink({
  //uri: 'http://localhost:4000/graphql',
  uri:
    process.env.API_URL ||
    "https://kopihub-api-ura2vr67wa-as.a.run.app/graphql",
});
const cache = new InMemoryCache();
const outerClient = new ApolloClient({
  cache: cache,
  link: link,
})

const Inner = ()=>{
  const { subscribe, unsubscribe } = useSocket("broadCastMessege", (dataFromServer) =>
    console.log(dataFromServer)
  );
  useEffect(()=>{
    subscribe()
    return ()=>{
      unsubscribe()
    }
  },[])

  // const {data,loading} = useQuery(gql`
  // {users{
  //   id
  // }}`)
  // return <div>{JSON.stringify(data)}</div>
  return <>
    <Router>
    <Fragment>      
      <Switch>
        <Route component={Routing} />
      </Switch>
    </Fragment>
    </Router>
  </>
}

const App = () => {
  // {data,loading} = useQuery
  // [load,{data,loading}] = useLazyQuery 
  const opt:any = {
  path:'/socket',  
  withCredentials:false,
  transports:['websocket']
}
  return (
    //<SocketIOProvider url="http://localhost:4000" opts={opt}>
     <SocketIOProvider url={socketUrl} opts={opt}>
      <ApolloProvider client={outerClient}>
          {/* <button onClick={load()} */}
          <Inner />
      </ApolloProvider>
    </SocketIOProvider>

  )
}

export default App
