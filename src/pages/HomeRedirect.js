import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const HomeRedirect = () => {

  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [])
  
  return (
    <div className='page' onClick={() => navigate('/')}>Click here to leave.</div>
  )
}

export default HomeRedirect