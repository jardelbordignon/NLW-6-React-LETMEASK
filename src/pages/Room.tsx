import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { useRoom } from '../hooks/useRoom'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

import logoImg from '../assets/images/logo.svg'

import '../styles/room.scss'

type RoomParams = {
  id: string
}

export function Room() {
  const { user } = useAuth()
  const params = useParams<RoomParams>()
  const [newQuestion, setNewQuestion] = useState('') 

  const roomId = params.id
  const { questions, title } = useRoom(roomId)

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()
    
    if (newQuestion.trim() === '') {
      toast.error('Digite uma pergunta', { duration: 3000 })
      return
    }

    if (!user) {
      toast.error('User not authenticated', { duration: 3000 })
      return
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
    toast.success('Pergunta enviada com sucesso', { duration: 3000 })
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    const likesRef = `rooms/${roomId}/questions/${questionId}/likes`

    if (likeId)
      await database.ref(`${likesRef}/${likeId}`).remove()
    else
      await database.ref(likesRef).push({ authorId: user?.id })
  }
  
  async function handleLoveQuestion(questionId: string, loveId: string | undefined) {
    const lovesRef = `rooms/${roomId}/questions/${questionId}/loves`

    if (loveId)
      await database.ref(`${lovesRef}/${loveId}`).remove()
    else
      await database.ref(lovesRef).push({ authorId: user?.id })
  }

  return (
    <div id='page-room'>      
      <header>
        <div className='content'>
          <img src={logoImg} alt='Letmeask' />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className='room-title'>
          <h1>{title || 'Carregando...'}</h1>
          { !!questions.length && 
            <span>{questions.length} pergunta{questions.length > 1 && 's'}</span>
          }
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder='O que você quer perguntar?'
            value={newQuestion}
            onChange={event => setNewQuestion(event.target.value)}
          />

          <div className='form-footer'>
            { user ? (
              <div className='user-info'>
                <div>
                  <img src={user.avatar} alt={user.name} />
                </div>
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            ) }

            <Button
              type='submit'
              disabled={!user || !newQuestion.length}
              onClick={handleSendQuestion}
            >
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className='question-list'>
          { questions.map(question => (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                <button
                  className={`like-button ${question.likeId ? 'liked' : ''}`}
                  type='button'
                  aria-label='Marcar como gostei'
                  onClick={() => handleLikeQuestion(question.id, question.likeId)}
                >
                  { question.likeCount > 0 && <span>{question.likeCount}</span> }
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <button
                  className={`like-button ${question.loveId ? 'liked' : ''}`}
                  type='button'
                  aria-label='Marcar como amei'
                  onClick={() => handleLoveQuestion(question.id, question.loveId)}
                >
                  { question.loveCount > 0 && <span>{question.loveCount}</span> }
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-36 h-36">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </Question>
          ))}
        </div>

      </main>
    </div>
  )
}
