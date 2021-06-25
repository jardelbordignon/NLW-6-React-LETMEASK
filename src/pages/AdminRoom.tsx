import { useHistory, useParams } from 'react-router-dom'

import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'

import '../styles/room.scss'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const params = useParams<RoomParams>()
  const history = useHistory()

  const roomId = params.id
  const { questions, title } = useRoom(roomId)

  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({ closedAt: new Date() })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return (
    <div id='page-room'>      
      <header>
        <div className='content'>
          <img src={logoImg} alt='Letmeask' />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleCloseRoom}>Encerrar a sala</Button>
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
              >
                <button
                  type='button'
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt='Remover pergunta' />
                </button>
              </Question>
          ))}
        </div>

      </main>
    </div>
  )
}
