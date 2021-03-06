import React, { useEffect } from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom';

function LandingPage(props) {

    useEffect(() => {
        axios.get('/api/hello')
            .then(response => { console.log(response) })
    }, [])

    const onClickHandler=()=>{ //request를 body없이 주면 됨!
        axios.get('/api/users/logout')
        .then(response=> { 
            console.log(response.data)

            if(response.data.success){
                props.history.push('/login')
            }else{
                alert('로그아웃 실패')
            }
        })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', 
            flexDirection: 'column', width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>
            <button onClick={onClickHandler}> Logout</button>
        </div>
    )
}
export default withRouter(LandingPage)