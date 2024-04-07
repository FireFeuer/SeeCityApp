import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark, ObjectManager } from '@pbe/react-yandex-maps';
import Modal from 'react-modal';
import axios from 'axios';


const MainMap = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
  const [isModalProposalOpen, setIsModalProposalOpen] = useState(false);
  const [isModalAttentionOpen, setIsModalAttentionOpen] = useState(false);
  const [isPlacemarkSet, setIsPlacemarkSet] = useState(true);
  const [isEvaluation, setIsEvaluation] = useState(0);
  const [placemarks, setPlacemarks] = useState([]);
  const [comments, setComments] = useState([]);
  const [attention, setAttention] = useState('');
  const [is_staff, setIsStaff] = useState(false);
  const [entryText, setEntryText] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameM, setNameM] = useState([]);
  const [descriptionM, setDescriptionM] = useState([]);
  const [username, setUsername] = useState('');
  const [login, setLogin] = useState('');
  const [commentText, setCommentText] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameIndex, setNameIndex] = useState('');
  const [descriptionIndex, setDescriptionIndex] = useState('');
  const [access, setAccess] = useState('');
  const [indexProposal, setIndexProposal] = useState(0);
  const [indexes, setIndexes] = useState([]);
  const [maxIndex, setMaxIndex] = useState(0);
  const [relevances, setRelevances] = useState([]);
  const [commentsList, setCommentsList] = useState([]);
  const [relevanceText, setRelevanceText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const addNameToArray = (nameM) => {
    setNameM((currentNames) => {
      return [...currentNames, nameM];
    });};

    const addDescriptionToArray = (descriptionM) => {
      setDescriptionM((currentDescription) => {
        return [...currentDescription, descriptionM];
      });};

    const addIdToArray = (indexes) => {
      setIndexes((currentIndex) => {
        return [...currentIndex, indexes];
      });};

    const addRelevanceToArray = (relevances) => {
      setRelevances((currentRelevance) => {
        return [...currentRelevance, relevances];
      });};

  useEffect(() => { 
      async function fetchData() {
          try {
            setEntryText('Войти');
            const res = await axios.get('http://127.0.0.1:8000/proposal/get/');
              const proposalData = res.data.proposal;
              proposalData.forEach(item => {
                const coordinates = item.coordinates.split(',').map(Number);
                addNameToArray(item.name);
                addIdToArray(item.id);
                setMaxIndex(item.id);
                addDescriptionToArray(item.description);
                addRelevanceToArray(item.relevance);
                if(item.is_delete != 1){
                  setPlacemarks(placemarks => {
                    return [...placemarks, coordinates];
                  });
                }
                else{
                  const coordinates = '-85.05677665947692,20.51358261427779'.split(',').map(Number);
                  setPlacemarks(placemarks => {
                    return [...placemarks, coordinates];
                  });
                }
                
              });
          } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
          }
      }
      fetchData();
}, []); 

  
  async function registerUser(username, email, password) {
    const response = await fetch('http://127.0.0.1:8000/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) {
      throw new Error('Ошибка при регистрации пользователя');
    }
    return response.json();
  }

  


  async function getToken(username, password) {
    const response = await fetch('http://127.0.0.1:8000/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
 
    if (!response.ok) {
      throw new Error('Ошибка при получении токена');
    }
    else{
      setEntryText('Выйти');
      setUsername('');
      setPassword('');
    }
  
    return response.json();
  }

  async function getRole(username) {
    const response = await fetch(`http://127.0.0.1:8000/role/${username}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error('Ошибка при получении роли1');
    }
    else{
    }
  
    return response.json();
  }


  const handleLikeSubmit = (e) => {
    e.preventDefault();

  
    fetch('http://127.0.0.1:8000/evaluate-proposal/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: login,
        id_proposal: indexProposal,
        evaluation: 2,
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });


    setIsEvaluation(2);
  };

  const handleDislikeSubmit = (e) => {
    e.preventDefault();

  
    fetch('http://127.0.0.1:8000/evaluate-proposal/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: login,
        id_proposal: indexProposal,
        evaluation: 1,
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });



    setIsEvaluation(1);
  };

const handleRegisterSubmit = (e) => {
  e.preventDefault();
  setIsModalRegisterOpen(false);
  registerUser(username, email, password).then((data) => {
  isModalRegisterOpen(false);
  })
  .catch((error) => {
    console.error('Ошибка при регистрации пользователя', error);
  });
};



const handleCommentSubmit = async (e) => {
  e.preventDefault();
  if(access == ''){
    setAttention('Войдите в аккаунт, чтобы оставлять комментарии');
    setIsModalAttentionOpen(true);
  }
  else{
        const dataToSend = {
          login: login, 
          id_proposal: indexProposal,
          text: commentText,
      };
      console.log(dataToSend);
      axios.post('http://127.0.0.1:8000/comment/create/', dataToSend, {
          headers: {
              'Authorization': `JWT ${access}`,
          }
      }).then(response => {})
          .catch(error => {
              console.error('Ошибка при отправке запроса:', error);
          });
          try {
            const response = await fetch(`http://127.0.0.1:8000/comment/${indexProposal}/`);
            const data = await response.json();
            setCommentsList(data.comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }
  };

  const handleDeleteSubmit = (e) => {
    e.preventDefault();
    const response = fetch(`http://127.0.0.1:8000/proposal/delete/${indexProposal}/`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({is_delete: 1}),
    });
   
};

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    const selStatus = Number(selectedStatus);
    const response = fetch(`http://127.0.0.1:8000/proposal/put/${indexProposal}/`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({relevance: selStatus}),
    });
    if(selStatus == 1){
      setRelevanceText('В ожидании');
    }
    if(selStatus == 2){
      setRelevanceText('Выполнено');
    }
    if(selStatus == 3){
      setRelevanceText('Отклонено');
    }
    
};

const handleLoginSubmit = async (e) => {

  e.preventDefault();
  try {
    const { access } = await getToken(username, password);
    const { is_staff } = await getRole(username);
    setIsStaff(is_staff);
    setLogin(username);
    setAccess(access);
    setIsModalLoginOpen(false);
  } catch (error) {
    console.error('Ошибка при получении токена', error);
  }
};





const handleMapClick = (e) => {
  if (!isPlacemarkSet) {
      setIsPlacemarkSet(true);
      addNameToArray(name);
      addDescriptionToArray(description);
      addIdToArray(maxIndex+1);
      addRelevanceToArray(1);
      const coords = e.get("coords");
      setPlacemarks([...placemarks, coords]);
      const dataToSend = {
          name: name, 
          description: description,
          coordinates: coords.toString(),
          login: login,
          relevance: 1,
          is_delete: 0,
      };
      axios.post('http://127.0.0.1:8000/proposal/create/', dataToSend, {
          headers: {
              'Authorization': `JWT ${access}`,
          }
      }).then(response => {})
          .catch(error => {
              console.error('Ошибка при отправке запроса:', error);
          });    
        
  }
};


  const handleCreatePlacemark = (e) => {
    if(access == ''){
      setAttention('Войдите в аккаунт, чтобы оставлять свои пожелания');
      setIsModalAttentionOpen(true);
    }
    else{
      setIsPlacemarkSet(false);
      setIsModalLoginOpen(false);
      setIsModalRegisterOpen(false);
      setIsModalProposalOpen(false);
      setIsModalOpen(true);
    }
   
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if(entryText == 'Войти'){
      setIsModalRegisterOpen(false);
      setIsModalOpen(false);
      setIsModalProposalOpen(false);
      setIsModalLoginOpen(true);
    }
    else{
      setAccess('');
      setLogin('');
      setIsStaff(false);
      setEntryText('Войти');
    }
  };

  const handleAttention = (e) => {
    e.preventDefault();
    setIsModalAttentionOpen(false);
  };

  const handleRegister = (e) => {
    setIsModalLoginOpen(false);
    setIsModalOpen(false);
    setIsModalProposalOpen(false);
    setIsModalRegisterOpen(true);
    
  };

  const handleClick =  async (index) => {
    setIsModalLoginOpen(false);
    setIsModalOpen(false);
    setIsModalRegisterOpen(false);
    setIsModalProposalOpen(true);
    setNameIndex(nameM[index]);
    setDescriptionIndex(descriptionM[index]);
    setIndexProposal(indexes[index]);
    setIsEvaluation(0);
      try {
        const res = await axios.get(`http://127.0.0.1:8000/evaluate-proposal/${indexes[index]}/${login}/`);
        const proposalData = res.data; 
        setIsEvaluation(proposalData.evaluation);
    } catch (error) {
        console.error('Произошла ошибка при получении данных:', error);
     console.log(indexes[index]);
    }
   

    const fetchComments = async () => {
      try {
          const response = await fetch(`http://127.0.0.1:8000/comment/${indexes[index]}/`);
          const data = await response.json();
          setCommentsList(data.comments);
      } catch (error) {
          console.error('Error fetching comments:', error);
      }
  };
  fetchComments();


    if(relevances[index]==1){
      setRelevanceText('В ожидании');
    }
    if(relevances[index]==2){
      setRelevanceText('Выполнено');
    }
    if(relevances[index]==3){
      setRelevanceText('Отклонено');
    }
  };


  function getColorClass(relevanceText) {
    switch (relevanceText) {
      case 'В ожидании':
        return 'waiting';
      case 'Выполнено':
        return 'done';
      case 'Отклонено':
        return 'declined';
      default:
        return ''; 
    }
  }

  function getEvaluationDislikeClass(isEvaluation) {
    switch (isEvaluation) {
      case 0:
        return 'grey';
      case 1:
        return 'red';
      case 2:
        return 'grey';
      default:
        return ''; 
    }
  }

  function getEvaluationLikeClass(isEvaluation) {
    switch (isEvaluation) {
      case 0:
        return 'grey';
      case 1:
        return 'grey';
      case 2:
        return 'green';
      default:
        return ''; 
    }
  }

  const LoginButton = ({ handleLogin }) => {
    return (
      <button
        className="login-button"
        onClick={handleLogin}>
        {entryText}
      </button>
    );
  };


  const RoundButton = ({ handleCreatePlacemark }) => {
    return (
      <button
        className="round-button"
        onClick={handleCreatePlacemark}>
        Указать проблему
      </button>
    );
  };

  const Header = () => {
    return (
      <div className="header">
        <RoundButton handleCreatePlacemark={handleCreatePlacemark} />
        <LoginButton handleLogin={handleLogin} />
      </div>
    );
  };

  return (
    <div>
      <YMaps>
        <Map
          defaultState={{ center: [55.75, 37.57], zoom: 9 }}
          width='100%'
          height='100vh'
          onClick={handleMapClick}>
              {placemarks.map((geometry, index) =>  (
                <Placemark key={index} geometry={geometry} onMouseOver={() => setHovered(true)}
                onMouseOut={() => setHovered(false)} modules={['geoObject.addon.balloon', 'geoObject.addon.hint']} onClick={() => handleClick(index)}  properties={{
                  hintContent: nameM[index],  
                }} />
          ))}
          <Header/>
        </Map>
      </YMaps>


         {/* Модальное окно с формой регистрации */}
         <Modal isOpen={isModalRegisterOpen} className="modal-form" onRequestClose={() => setIsModalRegisterOpen(false)}>
          <div>
            <span className="entry-text-in-register" onMouseDown={handleLogin}>Вход</span>
            <span className="register-text-in-register" onMouseDown={() => { }}>Регистрация</span>
            <form onSubmit={handleRegisterSubmit}>
              <label>Логин</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              <label>Email</label>
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              <label>Пароль</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Зарегистрироваться</button>
            </form >
          </div>
      </Modal>


       {/* Модальное окно с формой авторизации */}
       <Modal isOpen={isModalLoginOpen} className="modal-form" onRequestClose={() => setIsModalLoginOpen(false)}>
        <div>
          <span className="register-text-in-entry" onMouseDown={handleRegister }>Регистрация</span>
          <span className="entry-text-in-entry" onMouseDown={() => { }}>Вход</span>
            <form onSubmit={handleLoginSubmit}>
              <label>Логин</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              <label>Пароль</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Войти</button>
            </form>
        </div>
      </Modal>

      {/* Модальное окно с информацией о предложении */}
        <Modal isOpen={isModalProposalOpen} className="proposal-modal-form" onRequestClose={() => setIsModalProposalOpen(false)}>
          <div>
              <label className="name-text">{nameIndex}</label>
              <label className="description-text">{descriptionIndex}</label>
              <label className={`relevance-text-${getColorClass(relevanceText)}`}>Статус: {relevanceText}</label>
              {is_staff ? (
              <form onSubmit={handleStatusSubmit}>
                <div className="horizontal">
                  <select value={selectedStatus} onChange={event => setSelectedStatus(event.target.value)}>
                    <option value="1">В ожидании</option>
                    <option value="2">Выполнено</option>
                    <option value="3">Отклонено</option>
                  </select>
                  <button type="submit">Поменять статус</button>
                </div>
              </form>
               
              ) : null  }
               {is_staff ? (
              <form onSubmit={handleDeleteSubmit}>
                <div className="horizontal">
                  <button type="submit">Удалить</button>
                </div>
              </form>

              ) : null  }
              <form onSubmit={handleCommentSubmit}>
                  <div className="horizontal"> 
                      <input type="text" placeholder="Напишите комментарий" value={commentText} onChange={(e) => setCommentText(e.target.value)}/>
                      <button type="submit">=&gt;</button>
                  </div>
              </form>
              <ul>
                    {commentsList.map(comment => (
                        <li key={comment.id}>
                            <p><strong>Логин:</strong> {comment.login}</p>
                            <p><strong></strong> {comment.text}</p>
                        </li>
                    ))}
                </ul>

                {login !== '' && (
                  <div className="horizontal"> 
                    <form onSubmit={handleLikeSubmit}>
                      <button className={`like-${getEvaluationLikeClass(isEvaluation)}`} type="submit">Нравится</button>
                    </form>
                    <form onSubmit={handleDislikeSubmit}>
                      <button className={`dislike-${getEvaluationDislikeClass(isEvaluation)}`} type="submit">Не нравится</button>
                    </form>               
                  </div>
                )}
          </div>
        </Modal>

              {/* Модальное окно с требованием авторизоваться */}
              <Modal isOpen={isModalAttentionOpen} className="attention-modal-form" onRequestClose={() => setIsModalAttentionOpen(false)}>
          <div>
              <label className="name-text">{attention}</label>
              
              <form onSubmit={handleAttention}>
                    <button type="submit">ОК</button>
              </form>
          </div>
        </Modal>


      <Modal isOpen={isModalOpen} className="main-modal-form" onRequestClose={() => setIsModalOpen(false)}>
        <form onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(false);
        }}>
          <label>
            Проблема
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            
          </label>
          <label>
          Описание
          <textarea type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          
            <button type="submit">Поставить метку на карте</button>
          </form> 
      </Modal>

    </div>
  );
};

Modal.setAppElement('#root'); 

export default MainMap;