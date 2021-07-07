import React, { useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

//SpecificComponent: LandingPage같은 페이지 Component
//option: null-아무나 출입 가능 / true-로그인한 유저만 출입 가능 / false-로그인한 유저는 출입 불가능 (App.js에서)
//adminRoute는 안쓰므로 adminRoute = null
export default function (SpecificComponent, option, adminRoute = null){
    //Back-end에 Request 요청
    function AuthenticationCheck(props){
        const dispatch=useDispatch();
        useEffect(()=>{
            

            //Redux 이용 [ Axios.get('/api/users/auth') ]
            dispatch(auth()).then(response=> { 
                console.log(response)

                //로그인하지 않은 상태
                if(!response.payload.isAuth){
                    if(option===true){
                        props.history.push('/login') //Login page로 보냄.
                    }
                }else{ //로그인한 상태
                    if(adminRoute===true && !response.payload.isAdmin){
                        props.history.push('/') //Landing page로 보냄.
                    }else{ //로그인한 유저가 출입 불가능한 페이지
                        if(option===false){
                            props.history.push('/') //Landing page로 보냄.
                        }
                    }
                }
            })
            
        }, [])
        return (
            <SpecificComponent/>
        )
    }

    return AuthenticationCheck
}