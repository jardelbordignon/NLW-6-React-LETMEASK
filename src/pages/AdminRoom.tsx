import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import '../styles/room.scss'
import { Modal } from '../components/Modal'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const params = useParams<RoomParams>()
  const history = useHistory()

  const roomId = params.id
  const { questions, title } = useRoom(roomId)

  const [isDeleteQuestionModalOpen, setDeleteQuestionModalOpen] = useState('')
  const [isCloseRoomModalOpen, setCloseRoomModalOpen] = useState(false)

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
        <div className='room-title'>
          <h1>{title || 'Carregando...'}</h1>
          { !!questions.length && 
            <span>{questions.length} pergunta{questions.length > 1 && 's'}</span>
          }
        </div>

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
      </main>
    </div>
  )
}
