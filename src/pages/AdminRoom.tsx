import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import { Modal } from '../components/Modal'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import emptyQuestionsImg from '../assets/images/empty-questions.svg'

import '../styles/room.scss'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const params = useParams<RoomParams>()
  const history = useHistory()

  const roomId = params.id
  const { room, questions, isLoading } = useRoom(roomId)
  const { user } = useAuth()

  const [isDeleteQuestionModalOpen, setDeleteQuestionModalOpen] = useState('')
  const [isCloseRoomModalOpen, setCloseRoomModalOpen] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (user?.id !== room.author.id ) {
        toast.error('Ambiente exclusivo do administrador')
        history.push(`/rooms/${roomId}`)
        return
      }
    }
  }, [isLoading])

  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({ closedAt: new Date() })

    history.push('/')
  }
  
  async function handleDeleteQuestion(questionId: string) {
    //if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    //}
  }

  async function handleCheckQuestionAsAnswered(questionId: string, isAnswered: boolean) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered
    })
  }
  
  async function handleHighlightQuestion(questionId: string, isHighlighted: boolean) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted
    })
  }

  return (
    <div id='page-room'>      
      <header>
        <div className='content'>
          <img src={logoImg} alt='Letmeask' />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={() => setCloseRoomModalOpen(true)}>Encerrar a sala</Button>
            <Modal
              state={isCloseRoomModalOpen}
              setState={setCloseRoomModalOpen}
              callback={handleCloseRoom}
              title="Encerrar Sala"
              content="Tem certeza que você deseja encerrar esta sala?"
            />
          </div>
        </div>
      </header>

      <main>
        <div className='room-info'>
          <h1>{room?.title || 'Aguarde...'}</h1>
          { !!questions.length && 
            <span>{questions.length} pergunta{questions.length > 1 && 's'}</span>
          }
        </div>

        { isLoading ? (
          <div className='empty-questions'>
            <div>
              <img src={emptyQuestionsImg} alt='Carregando' />
              <h1>Carregando informações...</h1>
            </div>
          </div>
        ) : (

          !!questions.length ? (
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
                    type='button'
                    onClick={() => handleCheckQuestionAsAnswered(question.id, !question.isAnswered)}
                  >
                    <img src={checkImg} alt='Marcar pergunta como respondida' />
                  </button>
                  
                  { !question.isAnswered && (
                    <button
                      type='button'
                      onClick={() => handleHighlightQuestion(question.id, !question.isHighlighted)}
                    >
                      <img src={answerImg} alt='Dar destaque à pergunta' />
                    </button>
                  )}
  
                  <button
                    type='button'
                    onClick={() => setDeleteQuestionModalOpen(question.id)}
                  >
                    <img src={deleteImg} alt='Remover pergunta' />
                  </button>
  
                  <Modal
                    state={isDeleteQuestionModalOpen === question.id}
                    setState={() => setDeleteQuestionModalOpen('')}
                    callback={() => handleDeleteQuestion(question.id)}
                    title="Excluir pergunta"
                    content="Tem certeza que você deseja excluir esta pergunta?"
                  />
                </Question>
              ))}
            </div>
  
          ) : (
            <div className='empty-questions'>
              <div>
                <img src={emptyQuestionsImg} alt='Imagem representando que não há perguntas' />
                <h1>Nenhuma pergunta por aqui...</h1>
                <span>Envie o código desta sala para seus amigos e comece a responder perguntas!</span>
              </div>
            </div>
          )
        )}
        
      </main>
    </div>
  )
}
