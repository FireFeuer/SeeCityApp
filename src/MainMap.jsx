import React, { useState, useEffect, useCallback  } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import Modal from 'react-modal';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import { Font } from "@react-pdf/renderer"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 500 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 600 },
  ],
})
const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    backgroundColor: "#ffffff",
    padding: 24,
  }
})

function isValidISODate(dateString) {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return isoDateRegex.test(dateString);
}

const MainMap = () => {
  const [map, setMap] = useState();
  const [center, setCenter] = React.useState([54.82, 56.22]);
  const [zoom, setZoom] = React.useState(9);
  const mapState = React.useMemo(
    () => ({ center, zoom }),
    [zoom]
  );

  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalArchiveOpen, setIsModalArchiveOpen] = useState(false);
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
  const [isModalProposalOpen, setIsModalProposalOpen] = useState(false);
  const [isModalEmailOpen, setIsModalEmailOpen] = useState(false);
  const [isModalCodeOpen, setIsModalCodeOpen] = useState(false);
  const [isModalRecoveryOpen, setIsModalRecoveryOpen] = useState(false);
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);
  const [isModalComplaintOpen, setIsModalComplaintOpen] = useState(false);
  const [isModalConfirmationBlockUserOpen, setIsModalConfirmationBlockUserOpen] = useState(false);
  const [isModalConfirmationDeleteProposalOpen, setIsModalConfirmationDeleteProposalOpen] = useState(false);
  const [isModalConfirmationDeleteCommentOpen, setIsModalConfirmationDeleteCommentOpen] = useState(false);
  const [isModalAttentionOpen, setIsModalAttentionOpen] = useState(false);
  const [isModalSearchOpen, setIsModalSearchOpen] = useState(false);
  const [isPlacemarkSet, setIsPlacemarkSet] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isComment, setIsComment] = useState(false);

  const [placemarks, setPlacemarks] = useState([]);

  const [isEvaluation, setIsEvaluation] = useState(0);
  const [attention, setAttention] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [is_staff, setIsStaff] = useState(false);
  const [access, setAccess] = useState('');
  const [indexProposal, setIndexProposal] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [selectedOption, setSelectedOption] = React.useState(); 

  const [entryText, setEntryText] = useState('');
  const [name, setName] = useState('');
  const [dateFilterStart, setDateFilterStart] = useState(new Date());
  const [dateFilterEnd, setDateFilterEnd] = useState(new Date());
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [emailRecovery, setEmailRecovery] = useState('');
  const [code, setCode] = useState('');
  const [codeEnter, setCodeEnter] = useState('');
  const [login, setLogin] = useState('');
  const [commentText, setCommentText] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [search, setSearch] = useState('');
  const [searchIndex, setSearchIndex] = useState('');
  const [complaint, setComplaint] = useState('');
  const [deleteLogin, setDeleteLogin] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState(0);

  const [nameIndex, setNameIndex] = useState('');
  const [descriptionIndex, setDescriptionIndex] = useState('');
  const [dateIndex, setDateIndex] = useState('');
  const [loginIndex, setLoginIndex] = useState('');
  const [relevanceIndex, setRelevanceIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [relevanceText, setRelevanceText] = useState('');
  const [categoryText, setCategoryText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategoryUser, setSelectedCategoryUser] = useState('');

  const [descriptionTrueM, setDescriptionTrueM] = useState([]);
  const [dateTrueM, setDateTrueM] = useState([]);
  const [trueRelevances, setTrueRelevances] = useState([]);
  const [nameTrueM, setNameTrueM] = useState([]);
  const [nameM, setNameM] = useState([]);
  const [descriptionM, setDescriptionM] = useState([]);
  const [dateM, setDateM] = useState([]);
  const [loginM, setLoginM] = useState([]);
  const [relevances, setRelevances] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [commentsList, setCommentsList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [profileProposals, setProfileProposals] = useState([]);
  const [allProposals, setAllProposals] = useState([]);
  const [indexes, setIndexes] = useState([]);
  const [isEvaluationM, setEvaluations] = useState([]);
  const [likeCountM, setLikeCountM] = useState([]);
  const [dislikeCountM, setDislikeCountM] = useState([]);
  const [searchProposalList, setSearchProposalListM] = useState([]);

  const addNameToArray = (nameM) => {
    setNameM((currentNames) => {
      return [...currentNames, nameM];
    });};

  const addTrueNameToArray = (nameTrueM) => {
    setNameTrueM((currentNames) => {
      return [...currentNames, nameTrueM];
    });};

  const addTrueDescriptionToArray = (descriptionTrueM) => {
    setDescriptionTrueM((currentDescriptions) => {
      return [...currentDescriptions, descriptionTrueM];
    });};

  const addTrueDateToArray = (dateTrueM) => {
    setDateTrueM((currentDates) => {
      return [...currentDates, dateTrueM];
    });};

  const addDescriptionToArray = (descriptionM) => {
    setDescriptionM((currentDescription) => {
      return [...currentDescription, descriptionM];
    });};

    const addLoginToArray = (loginM) => {
      setLoginM((currentLogin) => {
        return [...currentLogin, loginM];
      });};
      
  const addDateToArray = (dateM) => {
    setDateM((currentDate) => {
      return [...currentDate, dateM];
    });};

  const addIdToArray = (indexes) => {
    setIndexes((currentIndex) => {
      return [...currentIndex, indexes];
    });};

  const addRelevanceToArray = (relevances) => {
    setRelevances((currentRelevance) => {
      return [...currentRelevance, relevances];
    });};

    const addCategoryToArray = (categorys) => {
      setCategorys((currentCategory) => {
        return [...currentCategory, categorys];
      });};

  const addTrueRelevanceToArray = (trueRelevances) => {
    setTrueRelevances((currentRelevance) => {
      return [...currentRelevance, trueRelevances];
    });};

    const addEvaluationToArray = (isEvaluationM) => {
      setEvaluations((currentEvaluation) => {
        return [...currentEvaluation, isEvaluationM];
      });};

    const addLikeCountMToArray = (likeCountM) => {
      setLikeCountM((currentLikeCount) => {
        return [...currentLikeCount, likeCountM];
      });};

    const addDislikeCountMToArray = (dislikeCountM) => {
      setDislikeCountM((currentDislikeCount) => {
        return [...currentDislikeCount, dislikeCountM];
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
              addLoginToArray(item.login);
              addRelevanceToArray(item.relevance);
              addCategoryToArray(item.category);
              addDateToArray(item.date_creation);
              if(item.is_delete != 1){
                addTrueNameToArray(item.name);
                addTrueDescriptionToArray(item.description);
                addTrueDateToArray(item.date_creation);
                if(item.relevance == 1){
                  addTrueRelevanceToArray('Статус: Рассмотрено');
                }
                if(item.relevance == 2){
                  addTrueRelevanceToArray('Статус: Выполнено');
                }
                if(item.relevance == 3){
                  addTrueRelevanceToArray('Статус: Отклонено');
                }
                if(item.relevance == 4){
                  addTrueRelevanceToArray('Статус: В ожидании рассмотрения');
                }
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


  
  async function registerUser(username, email, password, is_staff) {
    const response = await fetch('http://127.0.0.1:8000/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, is_staff }),
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
      throw new Error(response.detail);
    }
    else{
      setEntryText('Выйти');
      setUsername('');
      setPassword('');
    }
    return response.json();
  }


  const handleLikeSubmit = (e) => {
    e.preventDefault();
    if (login == ''){
      setAttention('Нужно зарегистрироваться, чтобы оставлять оценки');
      setIsModalAttentionOpen(true);
    }
    else{
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
      if(isEvaluation != 1 && isEvaluation != 2){
        setLikeCount(likeCount+1);
      }
      if(isEvaluation == 1){
        setLikeCount(likeCount+1);
        setDislikeCount(dislikeCount-1);
      }
      if(isEvaluation == 2){
        setLikeCount(likeCount);
      }
      setIsEvaluation(2);
    }
   
  };

  const handleLikeCommentSubmit = (commentId, index) => {
    event.preventDefault();
    if (login == ''){
      setAttention('Нужно зарегистрироваться, чтобы оставлять оценки');
      setIsModalAttentionOpen(true);
    }
    else{
      fetch('http://127.0.0.1:8000/evaluate-comment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: login,
          id_comment: commentId,
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
      if(isEvaluationM[index] != 1 && isEvaluationM[index] != 2){
        likeCountM[index] = (likeCountM[index] + 1);
      }
      if(isEvaluationM[index] == 1){
        likeCountM[index] = (likeCountM[index] + 1);
        dislikeCountM[index] = (dislikeCountM[index] - 1);
      }
      if(isEvaluationM[index] == 2){
        likeCountM[index] = (likeCountM[index]);
      }
      isEvaluationM[index] = 2;
      handleClick(indexProposal);
    }
   
  };

  const handleDislikeSubmit = (e) => {
    e.preventDefault();
    if (login == ''){
      setAttention('Нужно зарегистрироваться, чтобы оставлять оценки');
      setIsModalAttentionOpen(true);
    }
    else{
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
      })
      .catch((error) => {
      });
      if(isEvaluation != 1 && isEvaluation != 2){
        setDislikeCount(dislikeCount+1);
      }
      if(isEvaluation == 1){
        setDislikeCount(dislikeCount);
      }
      if(isEvaluation == 2){
        setLikeCount(likeCount-1);
        setDislikeCount(dislikeCount+1);
      }
      setIsEvaluation(1);
    }
  };

  const handleDislikeCommentSubmit = (commentId, index) => {
    event.preventDefault();
    if (login == ''){
      setAttention('Нужно зарегистрироваться, чтобы оставлять оценки');
      setIsModalAttentionOpen(true);
    }
    else{
      fetch('http://127.0.0.1:8000/evaluate-comment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: login,
          id_comment: commentId,
          evaluation: 1,
        }),
      })
      .then(response => response.json())
      .then(data => {
      })
      .catch((error) => {
      });
      if(isEvaluationM[index] != 1 && isEvaluationM[index] != 2){
        dislikeCountM[index] = dislikeCountM[index] + 1;
      }
      if(isEvaluationM[index] == 1){
        setDislikeCount(dislikeCount);
        dislikeCountM[index] = dislikeCountM[index];
      }
      if(isEvaluationM[index] == 2){
        likeCountM[index] = likeCountM[index] - 1;
        dislikeCountM[index] = dislikeCountM[index] + 1;
      }
      isEvaluationM[index] = 1;
      handleClick(indexProposal);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (/^\s*$/.test(username) || /^\s*$/.test(email) || /^\s*$/.test(password)) {
      setAttention('Заполните все поля без пробелов');
      setIsModalAttentionOpen(true);
      setIsModalRegisterOpen(false);
    } else {
      if(password == repeatPassword){
        if(username.length > 3 ){
          if(password.length > 3){
            setIsModalRegisterOpen(false);
            registerUser(username, email, password, is_staff).then((data) => {
              isModalRegisterOpen(false);
            }).catch((error) => {
              console.error('Ошибка при регистрации пользователя', error);
            });
          }
          else{        
            setAttention('Пароль должен быть более 3 символов');
            setIsModalAttentionOpen(true);
            setIsModalRegisterOpen(false);
          }
        }
        else{        
          setAttention('Логин должен быть более 3 символов');
          setIsModalAttentionOpen(true);
          setIsModalRegisterOpen(false);
        }
      }
      else{
        setAttention('Пароли не совпадают');
        setIsModalAttentionOpen(true);
        setIsModalRegisterOpen(false);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    let dataToSend = {};
    if(/^\s*$/.test(commentText)){
      setAttention('Текст комментария пуст');
      setIsModalAttentionOpen(true);
    }
    else{
      if(access === ''){
        dataToSend = {
          login: 'гость', 
          id_proposal: indexProposal,
          text: commentText,
          date: getCurrentDate(),
          availability: 0,
        };
      }
      else{
        dataToSend = {
          login: login, 
          id_proposal: indexProposal,
          text: commentText,
          date: getCurrentDate(),
          availability: 0,
        };
      }
      console.log(dataToSend);
      await axios.post('http://127.0.0.1:8000/comment/create/', dataToSend);
      try {
        const response = await fetch(`http://127.0.0.1:8000/comment/${indexProposal}/`);
        const data = await response.json();
        setCommentsList([...data.comments]);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
      setCommentText('');
    }
  };

  async function deleteProposal() {
    const response = await fetch(`http://127.0.0.1:8000/proposal/delete/${indexProposal}/`, {
      method: 'PUT', 
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({is_delete: 1}),
    });
    const responseNotification = await fetch('http://127.0.0.1:8000/notification/create/', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ login: loginIndex, text: 'Вашу заявку с номером - ' + indexProposal + ' удалил администратор', familiarity: 0, link: indexProposal }), 
    });
  }

  async function fetchData() {
    try {
      const res = await axios.get('http://127.0.0.1:8000/proposal/get/');
        const proposalData = res.data.proposal;
        proposalData.forEach(item => {
          const coordinates = item.coordinates.split(',').map(Number);
          addNameToArray(item.name);
          addIdToArray(item.id);
          setMaxIndex(item.id);
          addDescriptionToArray(item.description);
          addLoginToArray(item.login);
          addDateToArray(item.date_creation);
          addRelevanceToArray(item.relevance);
          addCategoryToArray(item.category);
          if(isValidISODate(dateFilterStart) && isValidISODate(dateFilterEnd)){
           
            if(item.is_delete != 1 && item.date_creation >= dateFilterStart && item.date_creation <= dateFilterEnd){
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
          }
          else{
        
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
          }
        
        });
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  async function fetchDataStatus(relevanceInt) {
    try {
      const res = await axios.get('http://127.0.0.1:8000/proposal/get/');
        const proposalData = res.data.proposal;
        proposalData.forEach(item => {
          const coordinates = item.coordinates.split(',').map(Number);
          addNameToArray(item.name);
          addIdToArray(item.id);
          setMaxIndex(item.id);
          addDescriptionToArray(item.description);
          addLoginToArray(item.login);
          addDateToArray(item.date_creation);
          addRelevanceToArray(item.relevance);
          addCategoryToArray(item.category);
          if(isValidISODate(dateFilterStart) && isValidISODate(dateFilterEnd)){
            if(item.is_delete != 1 && item.relevance == relevanceInt  && item.date_creation >= dateFilterStart && item.date_creation <= dateFilterEnd){
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
          }
          else{
            if(item.is_delete != 1 && item.relevance == relevanceInt){
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
          }
        });
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  const handleDeleteSubmit = (e) => {
    e.preventDefault();
    setIsModalProposalOpen(false);
    setPlacemarks([]);
    setNameM([]);
    setIndexes([]);
    setDescriptionM([]);
    setDateM([]);
    setRelevances([]);
    setCategorys([]);
    
    async function handleDeleteAndFetch() {
      await deleteProposal();
      fetchData();
    }
    handleDeleteAndFetch();
    setIsModalConfirmationDeleteProposalOpen(false);
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
      setRelevanceText('Рассмотрено');
    }
    if(selStatus == 2){
      setRelevanceText('Выполнено');
    }
    if(selStatus == 3){
      setRelevanceText('Отклонено');
    }
    if(selStatus == 4){
      setRelevanceText('В ожидании рассмотрения');
    }
    relevances[relevanceIndex] = selStatus; 
  };

  async function getUserData(username) {
    const response = await fetch(`http://127.0.0.1:8000/role/${username}/`);
    return response.json();
}

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
      const { access } = await getToken(username, password);
      const userData = await getUserData(username); 
      const { is_staff, is_active } = userData;

      setIsStaff(is_staff);
      setLogin(username);
      setAccess(access);
      setIsModalLoginOpen(false);
      if (!is_active) {
        throw new Error('Пользователь заблокирован');
    }
  } catch (error) {
    console.log(error.message);
      if (error instanceof Error && error.message === 'Пользователь заблокирован') {
          setAttention('Пользователь заблокирован');
          setIsModalAttentionOpen(true);
      } else {
          console.error('Ошибка при получении токена или данных пользователя', error);
          setAttention('Неверный логин или пароль');
          setIsModalAttentionOpen(true);
      }
  }
};

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/code/', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ email: emailRecovery }), 
      });
  
      if (!response.ok) {
        throw new Error('Ошибка при получении кода');
      }
      const data = await response.json();
      setCode(data.code);
    } catch (error) {
      console.error(error); 
    }
    setIsModalEmailOpen(false);
    setIsModalCodeOpen(true);
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if(code == codeEnter && code != ''){
      setIsModalRecoveryOpen(true);
      setIsModalCodeOpen(false);
    }
    else{
      setAttention('Код не подходит');
      setIsModalAttentionOpen(true);
    }
    setIsModalCodeOpen(false);
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      if(isComment === true){
        const response = await fetch('http://127.0.0.1:8000/notification/create/', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify({ login: 'fire', text: complaint + '. Жалобы на комментарий', familiarity: 1, link: indexProposal }), 
        });
      }
      if(isComment === false){
        const response = await fetch('http://127.0.0.1:8000/notification/create/', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify({ login: 'fire', text: complaint + '. Жалоба на заявку', familiarity: 1, link: indexProposal }), 
        });
      }

      if (!response.ok) {
        throw new Error('Ошибка');
      }
    } catch (error) {
      console.error(error); 
    }
    setIsModalComplaintOpen(false);
  };
  
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setSelectedOption(e.target.value);
    setIsModalProposalOpen(false);
    setPlacemarks([]);
    setNameM([]);
    setIndexes([]);
    setDescriptionM([]);
    setDateM([]);
    setRelevances([]);
    setCategorys([]);
    if(selectedOption == 'Все заявки' || selectedOption == undefined){
      fetchData();
    }
    if(selectedOption == 'Рассмотренные заявки'){
      fetchDataStatus(1);
    }
    if(selectedOption == 'Выполненные заявки'){
      fetchDataStatus(2);
    }
    if(selectedOption == 'Отклонённые заявки'){
      fetchDataStatus(3);
    }
    if(selectedOption == 'Ожидающие рассмотрения заявки'){
      fetchDataStatus(4);
    }
  };

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    setIsModalRecoveryOpen(false);
    if (/^\s*$/.test(newPassword)) {
      setAttention('Заполните все поля без пробелов');
      setIsModalAttentionOpen(true);
    }
    else{
      if(newPassword.length > 3){
        try {
          const response = await fetch('http://127.0.0.1:8000/change-password/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: emailRecovery, new_password: newPassword }),
          });
          if (!response.ok) {
              throw new Error('Ошибка при изменении пароля');
          }
          const data = await response.json();
          console.log(data); 
      } catch (error) {
          console.error(error); 
      }
      }
      else{
        setAttention('Пароль должен быть более 3 символов');
        setIsModalAttentionOpen(true);
      }
    }
      
  };

  function getCurrentDate(separator='-'){
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
  }

  const handleMapClick = async (e) => {
    if (!isPlacemarkSet) {
        setIsPlacemarkSet(true);
        addNameToArray(name);
        addDateToArray(getCurrentDate());
        addDescriptionToArray(description);
        addLoginToArray(login);
        addIdToArray(maxIndex+1);
        setMaxIndex(maxIndex + 1);
        addRelevanceToArray(1);
        let MaxMaxIndex = maxIndex + 1;
        addCategoryToArray(Number(selectedCategoryUser));
        const coords = e.get("coords");
        setPlacemarks([...placemarks, coords]);
        const dataToSend = {
            name: name, 
            description: description,
            coordinates: coords.toString(),
            login: login,
            relevance: 4,
            date_creation: getCurrentDate(),
            is_delete: 0,
            category: Number(selectedCategoryUser),
        };
        await axios.post('http://127.0.0.1:8000/proposal/create/', dataToSend, {
            headers: {
                'Authorization': `JWT ${access}`,
            }
        }).then(response => {})
            .catch(error => {
                console.error('Ошибка при отправке запроса:', error);
            });    
            const responseNotification = await fetch('http://127.0.0.1:8000/notification/create/', {
              method: 'POST', 
              headers: {
                'Content-Type': 'application/json', 
              },
              body: JSON.stringify({ login: 'fire', text: 'Заявка номер ' + MaxMaxIndex + ' ожидает вашего рассмотрения', familiarity: 1, link: maxIndex+1 }), 
            });
            setPlacemarks([]);
        setNameM([]);
        setIndexes([]);
        setDescriptionM([]);
        setDateM([]);
        setRelevances([]);
        setCategorys([]);
        setLoginM([]);
        fetchData();
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
      setIsModalCreateOpen(true);
      setName('');
      setDescription('');
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setIsModalFilterOpen(true);
    setIsModalArchiveOpen(false);
    setNotificationsOpen(false);
    setIsModalCreateOpen(false);
    setProfileOpen(false);
    setDateFilterStart(new Date());
    setDateFilterEnd(new Date());
  };

  const handleDeleteComment = (deleteCommentId) => {
    event.preventDefault();
    setDeleteCommentId(deleteCommentId);
    setIsModalConfirmationDeleteCommentOpen(true);
  };

  const handleBlockUser = (loginBlock) => {
    event.preventDefault();
    setDeleteLogin(loginBlock);
    setIsModalConfirmationBlockUserOpen(true);
  };

  const handleDeleteProposal = (e) => {
    e.preventDefault();
    setIsModalConfirmationDeleteProposalOpen(true);
  };

  const deleteComment = async ()  => {
    event.preventDefault();
    const response = await fetch(`http://127.0.0.1:8000/comment/delete/${deleteCommentId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ availability: 1, }),
        });
        if (!response.ok) {
            throw new Error('Ошибка при удалении комментария');
        }
        handleClick(indexProposal);
        setIsModalConfirmationDeleteCommentOpen(false);
  };

  const blockUser = async ()  => {
    event.preventDefault();
    const response = await fetch('http://127.0.0.1:8000/block/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: deleteLogin, }),
        });
        if (!response.ok) {
            throw new Error('Ошибка при блокировке пользователя');
        }
        setIsModalConfirmationBlockUserOpen(false);
  };


  const handleComplaintComment = (e) => {
    e.preventDefault();
    setIsComment(true);
    setIsModalComplaintOpen(true);
  };

  const handleComplaintProposal = (e) => {
    e.preventDefault();
    setIsComment(false);
    setIsModalComplaintOpen(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if(entryText == 'Войти'){
      setUsername('');
      setEmail('');
      setPassword('');
      setIsModalRegisterOpen(false);
      setIsModalCreateOpen(false);
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
    setUsername('');
    setEmail('');
    setPassword('');
    setRepeatPassword('');

    setIsModalLoginOpen(false);
    setIsModalCreateOpen(false);
    setIsModalProposalOpen(false);
    setIsModalRegisterOpen(true);
    setProfileOpen(false);
  };


  const handleClick =  async (index) => {
    setIsModalArchiveOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
    setIndexProposal(indexes[index]);
    setDislikeCountM([]);
    setLikeCountM([]);
    setEvaluations([]);
    setIsModalLoginOpen(false);
    setIsModalCreateOpen(false);
    setIsModalRegisterOpen(false);
    setIsModalProposalOpen(true);
    setCommentText('');
    setNameIndex(nameM[index]);
    setDescriptionIndex('\t' + descriptionM[index]);
    setDateIndex(dateM[index]);
    setLoginIndex(loginM[indexes[index]]);
    setIsEvaluation(0);

    const fetchCommentsData = async (commentId) => {
      if(login==""){
        const response = await fetch(`http://127.0.0.1:8000/evaluate-comment/${commentId}/гость/`);
        const data = await response.json();
        return data;
      }
      else{
        const response = await fetch(`http://127.0.0.1:8000/evaluate-comment/${commentId}/${login}/`);
        const data = await response.json();
        return data;
      }
    };

    async function fetchDataLike(commentId) {
      const response = await fetch(`http://127.0.0.1:8000/comment-count-like/${commentId}/`);
      const data = await response.json(); 
      return data;
    }

    async function fetchDataDislike(commentId) {
      const response = await fetch(`http://127.0.0.1:8000/comment-count-dislike/${commentId}/`);
      const data = await response.json(); 
      return data;
    }

    try {
        const res = await axios.get(`http://127.0.0.1:8000/evaluate-proposal/${indexes[index]}/${login}/`);
        const proposalData = res.data; 
        setIsEvaluation(proposalData.evaluation);
    } catch (error) {
        console.error('Произошла ошибка при получении данных:', error);
    
    }

      try {
        const response = await fetch(`http://127.0.0.1:8000/comment/${indexes[index]}/`);
        const data = await response.json();
        setCommentsList(data.comments);
        
        for (let i = 0; i < data.comments.length; i++) {
          const item = data.comments[i];
          const evaluationData = await fetchCommentsData(item.id);
          addEvaluationToArray(evaluationData.evaluation);
        
          const likeData = await fetchDataLike(item.id);
          addLikeCountMToArray(likeData.count);
        
          const dislikeData = await fetchDataDislike(item.id);
          addDislikeCountMToArray(dislikeData.count);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
  

    const fetchEvaluationLike = async () => {
      try {
          const response = await fetch(`http://127.0.0.1:8000/proposal-count-like/${indexes[index]}/`);
          const data = await response.json();
          setLikeCount(data.count);
      } catch (error) {
          console.error('Error fetching evaluations:', error);
      }
    }

    const fetchEvaluationDislike = async () => {
      try {
          const response = await fetch(`http://127.0.0.1:8000/proposal-count-dislike/${indexes[index]}/`);
          const data = await response.json();
          setDislikeCount(data.count);
      } catch (error) {
          console.error('Error fetching evaluations:', error);
      }
    }

    fetchEvaluationLike();
    fetchEvaluationDislike();

    if(relevances[index]==1){
      setRelevanceText('Рассмотрено');
    }
    if(relevances[index]==2){
      setRelevanceText('Выполнено');
    }
    if(relevances[index]==3){
      setRelevanceText('Отклонено');
    }
    if(relevances[index]==4){
      setRelevanceText('В ожидании рассмотрения');
    }
    setRelevanceIndex(index);

    if(categorys[index]==1){
      setCategoryText('Облагораживание территории');
    }
    if(categorys[index]==2){
      setCategoryText('Реконструкция ');
    }
    if(categorys[index]==3){
      setCategoryText('Застройка');
    }
    if(categorys[index]==4){
      setCategoryText('Очистка и уборка');
    }
    if(categorys[index]==5){
      setCategoryText('Другое');
    }
    setCategoryIndex(index);
};


function archiveItemClick(index, is_delete, coords) {
  setIsModalAttentionOpen(false);
  if(is_delete == 1){
    handleClick(index);
  }
  else{
    const coordinates = coords.split(',').map(Number);
    console.log(coordinates);
    map.setCenter(coordinates);
    map.setZoom(19);
    handleClick(index);
  }
  
}

  function getColorClass(relevanceText) {
    switch (relevanceText) {
      case 'Рассмотрено':
        return 'consideration';
      case 'Выполнено':
        return 'done';
      case 'Отклонено':
        return 'declined';
      case 'В ожидании рассмотрения':
        return 'waiting';
      default:
        return ''; 
    }
  }

  function getCategoryText(category) {
    switch (category) {
      case 1:
        return 'Облагораживание территории';
      case 2:
        return 'Реконструкция';
      case 3:
        return 'Застройка';
      case 4:
        return 'Очистка и уборка';
      case 5:
          return 'Другое';
      default:
        return '';
    }
  }

  function getStatusText(relevance) {
    switch (relevance) {
      case 1:
        return 'Рассмотрено';
      case 2:
        return 'Отклонено';
      case 3:
        return 'Выполнено';
      case 4:
        return 'В ожидании рассмотрения';
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

  const FilterButton = ({ handleFilter }) => {
    return (
      <button
        className="filter-button"
        onClick={handleFilter}>
        Фильтрация
      </button>
    );
  };

  const handleProfileClick = async () => {
    setIsModalArchiveOpen(false);
    setNotificationsOpen(false);
    setIsModalCreateOpen(false);
    setProfileOpen(true);
    const response = await fetch(`http://127.0.0.1:8000/proposal/get/${login}/`);
    const data = await response.json();
    setProfileProposals(data.proposal);
  };

  const ProfileButton = ({ handleProfileClick }) => {
    return (
      <button
        className="login-button"
        onClick={handleProfileClick}>
       <i class="fa-regular fa-user"></i> Профиль
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

  const halfLength = nameTrueM.length / 2;
  const halfNameTrueM = nameTrueM.slice(0, halfLength).map((search) => search);

  const combinedData = halfNameTrueM.map((name, index) => ({
    nameTrueM: name,
    descriptionTrueM: descriptionTrueM[index],
    trueRelevance: trueRelevances[index],
    dateTrueM: new Date(dateTrueM[index]).toLocaleDateString('ru', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) ,
  }));

  const options = [
    { value: 'Все заявки', label: 'Все заявки' },
    { value: 'Рассмотренные заявки', label: 'Рассмотренные заявки' },
    { value: 'Выполненные заявки', label: 'Выполненные заявки' },
    { value: 'Отклонённые заявки', label: 'Отклонённые заявки' },
    { value: 'Ожидающие рассмотрения заявки', label: 'Ожидающие рассмотрения заявки' },
  ];

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleArchiveClick = async () => {
    const response = await fetch(`http://127.0.0.1:8000/proposal/get/`);
    const data = await response.json();
    setAllProposals(data.proposal);
    setIsModalArchiveOpen(!isModalArchiveOpen);
    setNotificationsOpen(false);
    setIsModalCreateOpen(false);
    setProfileOpen(false);
  };

  const handleNotificationsClick = async () => {

    setNotificationsOpen(!notificationsOpen);
    setIsModalArchiveOpen(false);
    setIsModalCreateOpen(false);
    setProfileOpen(false);
    const response = await fetch(`http://127.0.0.1:8000/notification/get/`);
    const data = await response.json();
    let filteredNotificationsList = null;
    if(is_staff == true){
      filteredNotificationsList = data.notification
        .filter(notification => notification.login === login || notification.familiarity === 1)
        .reverse(); 
    }
    else{
      filteredNotificationsList = data.notification
        .filter(notification => notification.login === login)
        .reverse(); 
    }   
    setNotificationsList(filteredNotificationsList);
  };

  const BellIconButton = ({ handleNotificationsClick, icon }) => {
    return (
      <button onClick={handleNotificationsClick} className="bell" title="Уведомления">
        <i className={icon}></i>
      </button>
    );
  };

  const handleRegisterAdmin = (event) => {
    setIsModalRegisterOpen(true);
    setProfileOpen(false);
  };

  const handleForgotPassword = (event) => {
    setIsModalEmailOpen(true);
    setIsModalLoginOpen(false);
  };

  const setCoords = (coords) => {
    coords = coords.split(',').map(Number);
    map.setCenter(coords);
    map.setZoom(19);
    setIsModalSearchOpen(false);
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      fetch(`http://127.0.0.1:8000/proposal/coord/${search}/`)
      .then(response => response.json())
      .then(data => {
          if(data.proposal.length > 1){
            setSearchProposalListM(data.proposal);
            setIsModalSearchOpen(true);
          }
          else{
            const coordinates = data.proposal[0].coordinates.split(',').map(Number);
            map.setCenter(coordinates);
            map.setZoom(19);
          }   
      })
      .catch(error => console.error('Error fetching data:', error));
        }
  };

  const handleEnterArchive = (e) => {
    if (e.keyCode === 13) {
      fetch(`http://127.0.0.1:8000/proposal/${searchIndex}/`)
      .then(response => response.json())
      .then(data => {
            if(data.is_delete == 1){
              setIsModalAttentionOpen(true);
              setIsModalArchiveOpen(false);
              setAttention('Вы просматриваете удалённую заявку');
              handleClick(searchIndex);
              setSearchIndex('');
            }
            else{
              setIsModalArchiveOpen(false);
              const coordinates = data.coordinates.split(',').map(Number);
              map.setCenter(coordinates);
              map.setZoom(19);
              handleClick(searchIndex);
              setSearchIndex('');
            }
        
      })
      .catch(error => {
        setIsModalAttentionOpen(true);
        setIsModalArchiveOpen(false);
        setAttention('Заявки с таким номером не существует');
      });

        }
  };

  const Header = () => {
    return (
      <div className="header">
        <RoundButton handleCreatePlacemark={handleCreatePlacemark} />
        <FilterButton handleFilter={handleFilter} />
        <Autocomplete
        sx={{ width: 400 }}
          value={search}
          onChange={(event, newValue) => {
            setSearch(newValue);
          }}
          options={halfNameTrueM}
          renderInput={(params) => <TextField {...params} label="Поиск заявки по названию"  onKeyDown={handleEnter} />}
        />
        {login !== '' && (
          <button title="Архив" className="bell" onClick={(event) => handleArchiveClick()}>
              <i class="fa-solid fa-box-archive"></i></button >    
             ) }
        {login !== '' && (
          <BellIconButton handleNotificationsClick={handleNotificationsClick} icon='fa-regular fa-bell' />
        ) }
        {login !== '' && (
          <ProfileButton handleProfileClick={handleProfileClick} />
        ) }
          <LoginButton handleLogin={handleLogin}/>
    
      </div>
    );
  };

  const MyPDFDocumentOneProposal = ({ data }) => ( 
    <Document>  
      <Page style={styles.page}>  
      <Text style={{ fontSize: '29px' }}>            Запрос на благоустройство</Text>
      <Text style={{ fontSize: '19px' }}>{'Название: ' + nameIndex}</Text>
      <Text style={{ fontSize: '15px' }}>{'Описание: ' + descriptionIndex}</Text>
      <Text style={{ fontSize: '15px' }}>{'Статус: ' + relevanceText}</Text>
      <Text style={{ fontSize: '15px' }}>{'Категория: ' + categoryText}</Text>
      <Text style={{ fontSize: '15px' }}>{'Дата: ' + new Date(dateIndex).toLocaleDateString('ru', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })}</Text>
      <Text style={{ fontSize: '15px' }}>{'Положительных оценок: ' + likeCount.toString()}</Text>
      <Text style={{ fontSize: '15px' }}>{'Отрицательных оценок оценок: ' + dislikeCount.toString()}</Text>
      <Text>{' '}</Text>
      <Text style={{ fontSize: '24px' }}>{'Комментарии: '}</Text>
        {data.map(({ login, text }, index) => (  
          <React.Fragment key={index}>
            <Text style={{ fontWeight: 'bold' , fontSize: '14px'}}>{'Логин: ' + login}</Text>
            <Text style={{fontSize: '14px'}}>{'\t\t\t\Текст: ' + text }</Text>
            <Text>{' '}</Text>
          </React.Fragment>
        ))}  
      </Page>  
    </Document> 
  );

  const MyPDFDocument = ({ data }) => ( 
    <Document>  
      <Page style={styles.page}>  
      <Text style={{ fontSize: '29px' }}>            Реестр улучшений городской среды</Text>
        {data.map(({ nameTrueM, descriptionTrueM, trueRelevance, dateTrueM }, index) => (  
          <React.Fragment key={index}>
            <Text style={{ fontWeight: 'bold' }}>{'Проблема: ' + nameTrueM}</Text>
            <Text>{'\t\t\t\tОписание: ' + descriptionTrueM }</Text>
            <Text>{'\t\t\t\t' + trueRelevance }</Text>
            <Text>{'\t\t\t\tДата: ' + dateTrueM}</Text>
            <Text>{' '}</Text>
          </React.Fragment>
        ))}  
      </Page>  
    </Document> 
  );

  function handleTextFieldChange(event) {
    setSearchIndex(event.target.value);
  }

  return (

    <div>
      <YMaps>
        <Map 
          instanceRef={setMap}
          defaultState={mapState}
          width='100%'
          height='100vh'
          onClick={handleMapClick}>
              {placemarks.map((geometry, index) =>  (
                <Placemark key={index} geometry={geometry} onMouseOver={() => setHovered(true)}
                onMouseOut={() => setHovered(false)} modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}  onClick={() => handleClick(index)} iconColor='#0000' properties={{
                  hintContent: nameM[index],  
                }}/>
          ))}
          <Header/>
        </Map>
      </YMaps>

      {/* Модальное окно с формой регистрации */}
      <Modal isOpen={isModalRegisterOpen} className="modal-form" onRequestClose={() => setIsModalRegisterOpen(false)}>
        <div>
        {!is_staff ? (
          <span className="entry-text-in-register" onMouseDown={handleLogin}>Вход</span>
        ) : null }
        {!is_staff ? (
          <span className="register-text-in-register" onMouseDown={() => { }}>Регистрация</span>
        ) : null }
          <form onSubmit={handleRegisterSubmit}>
            <label>Логин</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label>Email</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Пароль</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label>Повторите пароль</label>
            <input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
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
            <div className='forgot-password'>
              <span onClick={handleForgotPassword}>Забыли пароль?</span>
            </div>
        </div>
      </Modal>

            {/* Модальное окно с формой ввода почты */}
            <Modal isOpen={isModalEmailOpen} className="modal-form" onRequestClose={() => setIsModalEmailOpen(false)}>
        <div>
            <form onSubmit={handleEmailSubmit}>
              <label>Введите почту</label>
              <input type="text" value={emailRecovery} onChange={(e) => setEmailRecovery(e.target.value)} />
              <button type="submit">Получить код</button>
            </form>
        </div>
      </Modal>

      {/* Модальное окно с формой ввода кода */}
      <Modal isOpen={isModalCodeOpen} className="modal-form" onRequestClose={() => setIsModalCodeOpen(false)}>
        <div>
            <form onSubmit={handleCodeSubmit}>
              <label>Введите код</label>
              <input type="text" value={codeEnter} onChange={(e) => setCodeEnter(e.target.value)} />
              <button type="submit">Отправить</button>
            </form>
        </div>
      </Modal>

      {/* Модальное окно с формой смены пароля */}
      <Modal isOpen={isModalRecoveryOpen} className="modal-form" onRequestClose={() => setIsModalRecoveryOpen(false)}>
        <div>
            <form onSubmit={handleRecoverySubmit}>
              <label>Введите новый пароль</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <button type="submit">Отправить</button>
            </form>
        </div>
      </Modal>

        {/* Модальное окно с информацией о предложении */}
        <Modal isOpen={isModalProposalOpen} className="proposal-modal-form" onRequestClose={() => setIsModalProposalOpen(false)}>
          <div>
            {is_staff ? (
              <PDFDownloadLink document={<MyPDFDocumentOneProposal data={commentsList} />} fileName="myProposal.pdf"> 
                  {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Скачать информацию об этой заявке')} 
              </PDFDownloadLink>
            ) : null  }
            <label className="name-text">{nameIndex}</label>
            <label className="description-text">{descriptionIndex}</label>
            <div className="horizontal">
              <label className={`relevance-text-${getColorClass(relevanceText)}`}>Статус: {relevanceText}</label>
            </div>     
            <div className="horizontal"> 
                {is_staff ? (
                <form onSubmit={handleStatusSubmit}>
                  <br />
                  <div className="horizontal">
                    <select value={selectedStatus} onChange={event => setSelectedStatus(event.target.value)}>
                      <option value="1">Рассмотрено</option>
                      <option value="2">Выполнено</option>
                      <option value="3">Отклонено</option>
                      <option value="4">В ожидании рассмотрения</option>
                    </select>
                    <button className="red-button-admin" type="submit">Поменять статус</button>
                  </div>
                </form>
                ) : null  }

                {is_staff ? (
                <form onSubmit={handleDeleteProposal}>
                    <br />
                  <div className="horizontal">
                    <button className="red-button" type="submit"><i class="fa-regular fa-trash-can"></i></button>
                  </div>
                </form>
                ) : null  }
              </div>

              <div className="horizontal">
                <label>Категория: {categoryText}</label>
              </div>    

                  <div className="horizontal"> 
                    <form onSubmit={handleLikeSubmit}>
                    <div className="horizontal"> 
                      <label className="description-text">{likeCount.toString()}</label>
                      <button className={`like-${getEvaluationLikeClass(isEvaluation)}`} type="submit"><i class="fa-regular fa-thumbs-up"></i></button>     
                    </div>       
                    </form>
                    <form onSubmit={handleDislikeSubmit}>
                    <div className="horizontal"> 
                      <label className="description-text">{dislikeCount.toString()}</label>
                      <button className={`dislike-${getEvaluationDislikeClass(isEvaluation)}`} type="submit"><i class="fa-regular fa-thumbs-down"></i></button>  
                    </div>           
                    </form>               
                  </div>
            
              <form onSubmit={handleCommentSubmit}>
                  <br />
                  <div className="horizontal"> 
                      <input type="text" placeholder="Напишите комментарий" value={commentText} onChange={(e) => setCommentText(e.target.value)}/>
                      <button type="submit"><i class="fa-solid fa-pen"></i></button>
                  </div>

           
                  <ul className="comment-list">
                  {commentsList.map((comment, index) => {
                      const isAvailable = comment.availability !== 1;
                      return isAvailable ? (
                          <li key={comment.id}>
                              <p><strong>{comment.login}</strong> {comment.text}</p> 
                      <div className="horizontal-comment">                    
                        <form >
                          <div className="horizontal"> 
                          <label className="description-text">{likeCountM[index] === undefined ? '0' : likeCountM[index].toString()}</label>
                            <button className={`like-comment-${getEvaluationLikeClass(isEvaluationM[index])}`} type="submit" onClick={(event) => handleLikeCommentSubmit(comment.id, index)}>
                              <i class="fa-regular fa-thumbs-up">
                                </i></button>                        
                        </div>
                        </form>
                        <form>
                            <div className="horizontal"> 
                            <label className="description-text">{dislikeCountM[index] === undefined ? '0' : dislikeCountM[index].toString()}</label>
                            <button className={`dislike-comment-${getEvaluationDislikeClass(isEvaluationM[index])}`} type="submit" onClick={(event) => handleDislikeCommentSubmit(comment.id, index)}>
                              <i class="fa-regular fa-thumbs-down"></i>
                            </button>
                            </div>
                        </form>  
                        <p class = 'date-comment'>{new Date(comment.date).toLocaleDateString('ru', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric'
                                    })} </p>
                       
                    
                     
                      </div>  
                      <div className='vertical'> 
                                {!is_staff ? (
                              <a className="complaint-text" href="#" onClick={(handleComplaintComment)}>Пожаловаться на комментарий</a>
                            ) : null  }
                              {is_staff ? (
                              <a className="complaint-text" href="#"  onClick={(event) => handleBlockUser(comment.login)}>Заблокировать пользователя</a>
                            ) : null  }
                                {is_staff ? (
                              <a className="complaint-text" href="#" onClick={(event) => handleDeleteComment(comment.id)}>Удалить комментарий</a>
                            ) : null  } 
                         </div> 
                      </li>
                        ) : null;
                      })}
                  </ul>
            
              </form>
              <div className='horizontal'> 
              {!is_staff ? (
                <a className="complaint-text" href="#" onClick={(handleComplaintProposal)}>Пожаловаться на заявку</a>
              ) : null  }
               {is_staff ? (
                <a className="complaint-text" href="#" onClick={(event) => handleBlockUser(loginIndex)}>Заблокировать пользователя</a>
              ) : null  }
                <label className="date-text">Заявка создана: {new Date(dateIndex).toLocaleDateString('ru', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric'
                                    })} | Пользователем - {loginIndex}</label>
                <label className="date-text">Номер заявки: {indexProposal}</label>
              </div>
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

        {/* Модальное окно с подтверждением действия блокировки пользователя */}
        <Modal isOpen={isModalConfirmationBlockUserOpen} className="attention-modal-form" onRequestClose={() => setIsModalConfirmationBlockUserOpen(false)}>
          <div>
              <label className="name-text">Вы точно хотите заблокировать этого пользователя?</label>            
              <form onSubmit={blockUser}>
                    <button type="submit">Подтвердить</button>
              </form>
          </div>
        </Modal>

             {/* Модальное окно с подтверждением действия удаления комментария */}
             <Modal isOpen={isModalConfirmationDeleteCommentOpen} className="attention-modal-form" onRequestClose={() => setIsModalConfirmationDeleteCommentOpen(false)}>
          <div>
              <label className="name-text">Вы точно хотите удалить этот комментарий?</label>            
              <form onSubmit={deleteComment}>
                    <button type="submit">Подтвердить</button>
              </form>
          </div>
        </Modal>

             {/* Модальное окно с подтверждением действия удаления заявки */}
             <Modal isOpen={isModalConfirmationDeleteProposalOpen} className="attention-modal-form" onRequestClose={() => setIsModalConfirmationDeleteProposalOpen(false)}>
          <div>
              <label className="name-text">Вы точно хотите удалить эту заявку?</label>
              
              <form onSubmit={handleDeleteSubmit}>
                  <button type="submit">Подтвердить</button>
              </form>
          </div>
        </Modal>

      {/* Модальное окно создания заявки */}
      <Modal isOpen={isModalCreateOpen} className="main-modal-form" onRequestClose={() => setIsModalCreateOpen(false)}>
        <form onSubmit={(e) => {
          e.preventDefault();

          if(/^\s*$/.test(name) || /^\s*$/.test(description)){
            setIsModalCreateOpen(false);
            setAttention('Заполните все поля');
            setIsModalAttentionOpen(true);
            setIsPlacemarkSet(true);
          }
          else{
            if(name.length > 100){
              setIsModalCreateOpen(false);
              setAttention('Текст проблемы больше 100 символов');
              setIsModalAttentionOpen(true);
              setIsPlacemarkSet(true);
            }
            else{
              if(description.length > 200){
                setIsModalCreateOpen(false);
                setAttention('Текст описания больше 200 символов');
                setIsModalAttentionOpen(true);
                setIsPlacemarkSet(true);
              }
              else{

                setIsModalCreateOpen(false);
              }        
            }    
          }
        }}>
          <label>
            Категория
            <select value={selectedCategoryUser} onChange={event => setSelectedCategoryUser(event.target.value)}>
              <option value="1">Облагораживание территории</option>
              <option value="2">Реконструкция</option>
              <option value="3">Застройка</option>
              <option value="4">Очистка и уборка</option>
              <option value="5">Другое</option>
            </select>
          </label>
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

      {/* Модальное окно с фильтрацией */}
      <Modal isOpen={isModalFilterOpen} className="main-modal-form" onRequestClose={() => setIsModalFilterOpen(false)}>
        <form onSubmit={handleFilterSubmit}>
        <label>
          От 
          <input type="date" onChange={(e) => {
          const newDate = new Date(e.target.value); 
          const formattedDate = newDate.toISOString().split('T')[0]; 
          setDateFilterStart(formattedDate);
        }} id="datePicker" name="datePicker" />
          </label>
          <label>
          До 
          <input type="date"  onChange={(e) => {
             const newDate = new Date(e.target.value); 
             const formattedDate = newDate.toISOString().split('T')[0]; 
             setDateFilterEnd(formattedDate);
        }} id="datePicker" name="datePicker" />
          </label>
          <select value={selectedOption} onChange={handleChange}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button type="submit">Применить</button>
        </form>
      </Modal>

      {/* Модальное окно с жалобой */}
      <Modal isOpen={isModalComplaintOpen} className="main-modal-form" onRequestClose={() => setIsModalComplaintOpen(false)}>
        <div>
        <label>
          Укажите жалобу
          <textarea type="text" value={complaint} onChange={(e) => setComplaint(e.target.value)} />
      </label>
        <form onSubmit={handleComplaintSubmit} >
          <button type="submit">Отправить</button>
        </form>
        </div>
      
      </Modal>


        {/* Модальное окно с архивом */}
        <Modal isOpen={isModalArchiveOpen} className="archive-modal-form" onRequestClose={() => setIsModalArchiveOpen(false)}>
        <div className="comments"> 
         
              <TextField
                  label="Поиск заявки по индексу"
                  value={searchIndex} 
                  onChange={handleTextFieldChange}
                  onKeyDown={handleEnterArchive} 
                />      
             
                    {allProposals.map((proposal, index) => {
                      const isAvailable = is_staff;
                      return isAvailable ? (
                    <li key={proposal.id} className="comment">
                  
                        <div><strong>{proposal.name}</strong></div>
                        <div>{'Статус: ' + getStatusText(proposal.relevance)}</div>
                        <div>{'Категория: ' + getCategoryText(proposal.category)}</div>
                        <div>{new Date(proposal.date_creation).toLocaleDateString('ru', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric'
                                    })}</div>
                        <div>Заявка номер: {proposal.id}</div>    
                          <div style={{color: proposal.is_delete ? 'red' : 'green'}}>{proposal.is_delete === 0 ? 'Доступно' : 'Удалено'}</div>           
                        <div>
                          <button
                            className="notification-item-button"
                            onClick={(event) => archiveItemClick(proposal.id, proposal.is_delete, proposal.coordinates)}>
                            Перейти
                          </button>
                        </div>
                    </li>
                         ) :    (
                          proposal.is_delete === 0 && (
                  
                         <li key={proposal.id} className="comment">
                  
                         <div><strong>{proposal.name}</strong></div>
                         <div>{'Статус: ' + getStatusText(proposal.relevance)}</div>
                         <div>{'Категория: ' + getCategoryText(proposal.category)}</div>
                         <div>{new Date(proposal.date_creation).toLocaleDateString('ru', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric'
                                    })}</div>
                         <div>Заявка номер: {proposal.id}</div>    
                           <div style={{color: proposal.is_delete ? 'red' : 'green'}}>{proposal.is_delete === 0 ? 'Доступно' : 'Удалено'}</div>           
                         <div>
                           <button
                             className="notification-item-button"
                             onClick={(event) => archiveItemClick(proposal.id, proposal.is_delete, proposal.coordinates)}>
                             Перейти
                           </button>
                         </div>
                      </li>
                  )
                  );
                  })}
                 
          </div>
        </Modal>

        {/* Модальное окно с заявками поиска */}
        <Modal isOpen={isModalSearchOpen} className="main-modal-form" onRequestClose={() => setIsModalSearchOpen(false)}>
        <div id="commentContainer" className="comments">
          <div className="comments__header">
            <h2>Найдено более одного совпадения</h2>
          </div>
          <div className="comments__list">
      
              {searchProposalList.map((proposal, index) => (
                <li key={proposal.id} className="comment">
                  <div className="comment__content">
                    <div><strong>{proposal.name}</strong></div> 
                    <div>{proposal.description}</div> 
                    <br/>
                    <div>{proposal.date_creation}</div> 
                    <div>
                      <button
                        className="notification-item-button"
                        onClick={(event) =>  setCoords(proposal.coordinates)}>
                        Перейти
                      </button>
                    </div>
                  </div>
                </li>
              ))}
      
          </div>
        </div>
      </Modal>

        {/* Модальное окно с уведомлениями */}
      <Modal isOpen={notificationsOpen} className="main-modal-form" onRequestClose={() => setNotificationsOpen(false)}>
        <div  className="comments">
          <div className="comments__header">
            <h2>Уведомления</h2>
          </div>
        
          <div className="comments__list">
              {notificationsList.map((notification, index) => (
                <li key={notification.id} className="comment">
                  <div className="comment__content">
                    <div>{notification.text}</div> 
                    <div>
                      <button
                        className="notification-item-button"
                        onClick={(event) => handleClick(notification.link)}>
                        Перейти
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </div>
      
        </div>
      </Modal>

      {/* Модальное окно профиля */}
      <Modal isOpen={isProfileOpen} className="main-modal-form" onRequestClose={() => setProfileOpen(false)}>
      <div className="comments">
          <div className="comments__header">
              <h2>{login}</h2>

            {is_staff ? (
        <PDFDownloadLink document={<MyPDFDocument data={combinedData} />} fileName="AllProposals.pdf"> 
          {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Скачать реестр улучшений городской среды')} 
        </PDFDownloadLink>
            ) : null  }
          {is_staff ? (
             <div className='forgot-password'>
              <span onClick={handleRegisterAdmin}>Зарегистрировать нового администратора</span>
            </div>
          ) : null  }

          </div>
              {profileProposals.map((proposal, index) => (
                <li key={proposal.id} className="comment">
                <div>
                  <div><strong>{proposal.name}</strong></div>
                  <div>Заявка номер: {proposal.id}</div> 
                  <div style={{color: proposal.is_delete ? 'red' : 'green'}}>{proposal.is_delete === 0 ? 'Доступно' : 'Удалено'}</div> 
                  <div>
                    <button
                      className="notification-item-button"
                      onClick={(event) => handleClick(proposal.id)}>
                      Перейти
                    </button>
                  </div>
                </div>
              </li>
              ))}
        </div>
      </Modal>
    </div>
  );
};

Modal.setAppElement('#root'); 

export default MainMap;